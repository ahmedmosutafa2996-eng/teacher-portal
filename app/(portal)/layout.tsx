"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SessionProvider,
  signOut,
  useSession,
} from "next-auth/react"

function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession() as any
  const role = session?.user?.role

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },

    ...(role !== "teacher"
      ? [
          {
            href: "/teachers",
            label: "Teachers",
          },
        ]
      : []),

    {
      href: "/submissions",
      label: "Submissions",
    },

    {
      href: "/submit",
      label: "Submit",
    },

    ...(role !== "teacher"
      ? [
          {
            href: "/management-submit",
            label: "Management Submit",
          },
        ]
      : []),

    {
      href: "/analytics",
      label: "Analytics",
    },

    {
      href: "/resources",
      label: "Resources",
    },

    {
      href: "/schedule",
      label: "Schedule",
    },
  ]

  return (
    <aside className="w-72 bg-black text-white flex flex-col justify-between p-6">
      <div>
        <div className="mb-12">
          <h1 className="text-3xl font-bold">
            EZ Portal
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Teacher Management System
          </p>
        </div>

        <nav className="space-y-3">
          {links.map((link) => {
            const isActive =
              pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-5 py-4 rounded-2xl transition ${
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "hover:bg-gray-900 text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <p className="font-semibold text-lg">
          {session?.user?.name}
        </p>

        <p className="text-gray-400 text-sm capitalize mb-4">
          {session?.user?.role?.replace(
            /_/g,
            " "
          )}
        </p>

        <button
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}