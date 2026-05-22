"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

const UPLOAD_API =
  "https://script.google.com/macros/s/AKfycbwjbCWb2CbwJVlsxdxs2fLlZ7Nag3stJfVEKS9WWVkhp7if1ZfeASXoHmfJ6YPOAEnPDw/exec"

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1]
      resolve(base64)
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function SubmitPage() {
  const { data: session } = useSession()

  const [submissionType, setSubmissionType] =
    useState("Reflection Task")

  const [notes, setNotes] = useState("")
  const [file, setFile] =
    useState<File | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [message, setMessage] =
    useState("")

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!file) {
      setMessage("Please upload a file first.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const fileBase64 = await fileToBase64(file)

      const res = await fetch(UPLOAD_API, {
        method: "POST",
        body: JSON.stringify({
          teacherName: session?.user?.name || "",
          submissionType,
          notes,
          fileName: file.name,
          mimeType: file.type,
          fileBase64,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage("Submitted successfully!")
        setNotes("")
        setFile(null)
      } else {
        setMessage("Error: " + data.error)
      }
    } catch (error) {
      setMessage("Something went wrong.")
    }

    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Submit Work
      </h1>

      <p className="text-gray-500 mb-8">
        Upload a reflection task, observation response, or supporting document.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow max-w-2xl"
      >
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Teacher
          </label>

          <input
            value={session?.user?.name || ""}
            disabled
            className="w-full p-4 rounded-xl border bg-gray-100"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Submission Type
          </label>

          <select
            value={submissionType}
            onChange={(e) =>
              setSubmissionType(e.target.value)
            }
            className="w-full p-4 rounded-xl border"
          >
            <option>Reflection Task</option>
            <option>Coaching Response</option>
            <option>Lesson Plan</option>
            <option>Supporting Document</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            rows={6}
            placeholder="Write any notes here..."
            className="w-full p-4 rounded-xl border"
          />
        </div>

        <div className="mb-8">
          <label className="block font-semibold mb-2">
            Upload File
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="w-full p-4 rounded-xl border bg-white"
          />

          {file && (
            <p className="text-sm text-gray-500 mt-2">
              Selected file: {file.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p className="mt-6 text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}