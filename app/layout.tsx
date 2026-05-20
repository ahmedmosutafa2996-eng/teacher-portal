import Link from "next/link"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-10">
              Teacher Portal
            </h1>

            <nav className="space-y-4">

              <Link
                href="/dashboard"
                className="block hover:text-blue-600"
              >
                Dashboard
              </Link>

              <Link
                href="/teachers"
                className="block hover:text-blue-600"
              >
                Teachers
              </Link>

              <Link
                href="/submissions"
                className="block hover:text-blue-600"
              >
                Feedback
              </Link>

              <Link
                href="/schedule"
                className="block hover:text-blue-600"
              >
                Schedule
              </Link>

              <Link
                href="/resources"
                className="block hover:text-blue-600"
              >
                Resources
              </Link>

            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-10">
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}