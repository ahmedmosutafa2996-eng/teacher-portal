import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

function normalizeRole(role: string) {
  const cleanRole = String(role || "")
    .trim()
    .toLowerCase()

  if (cleanRole === "admin") {
    return "admin"
  }

  if (cleanRole === "branch manager") {
    return "branch_manager"
  }

  if (cleanRole === "academic supervisor") {
    return "academic_supervisor"
  }

  if (cleanRole === "team leader") {
    return "team_leader"
  }

  if (cleanRole === "teacher") {
    return "teacher"
  }

  return "teacher"
}

const handler = NextAuth({
  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email =
          credentials?.email
            ?.trim()
            .toLowerCase()

        const password =
          credentials?.password?.trim()

        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbzFQvFl3Am1LgvL_6hsNexb38wO4_UMZ84DpzqzxLeRu0GLTwIuiJmHEAt2ZhUX-KHk4Q/exec"
        )

        const users = await res.json()

        const user = users.find(
          (item: any) =>
            String(item.Email)
              .trim()
              .toLowerCase() === email &&
            String(item.ID).trim() === password
        )

        if (!user) {
          return null
        }

        return {
          id: String(user.ID),
          name: String(user.Name).trim(),
          email: String(user.Email).trim(),
          role: normalizeRole(
            String(user.Role)
          ),
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({
      token,
      user,
    }: any) {
      if (user) {
        token.role = user.role
        token.name = user.name
        token.email = user.email
      }

      return token
    },

    async session({
      session,
      token,
    }: any) {
      if (session.user) {
        session.user.role = token.role
        session.user.name = token.name
        session.user.email = token.email
      }

      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})

export {
  handler as GET,
  handler as POST,
}