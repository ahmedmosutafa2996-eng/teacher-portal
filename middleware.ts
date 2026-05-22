import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {

    const token = req.nextauth.token
    const pathname =
      req.nextUrl.pathname

    const role = token?.role

    // 🔒 Teachers cannot access management pages
    if (
      role === "teacher" &&
      (
        pathname.startsWith(
          "/management-submit"
        ) ||
        pathname.startsWith(
          "/teachers"
        )
      )
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard",
          req.url
        )
      )
    }

    return NextResponse.next()
  },

  {
    callbacks: {
      authorized: ({
        token,
      }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/teachers/:path*",
    "/submissions/:path*",
    "/submit/:path*",
    "/management-submit/:path*",
    "/analytics/:path*",
    "/resources/:path*",
    "/schedule/:path*",
  ],
}