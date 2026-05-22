import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">

        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Access Denied
        </h1>

        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>

        <Link
          href="/resources"
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
        >
          Go Back
        </Link>

      </div>

    </div>
  )
}