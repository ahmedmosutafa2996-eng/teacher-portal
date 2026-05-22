"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] =
    useState("")

  const [error, setError] =
    useState("")

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault()

    setError("")

    // 👨‍🏫 Teacher redirect
    const callbackUrl =
      email === "teacher@portal.com"
        ? "/resources"
        : "/dashboard"

    await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: true,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Teacher Portal
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-4 border rounded-xl mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-4 border rounded-xl mb-4"
        />

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white p-4 rounded-xl hover:bg-gray-800"
        >
          Login
        </button>

      </form>

    </div>
  )
}