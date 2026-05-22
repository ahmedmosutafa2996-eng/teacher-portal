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

export default function ManagementSubmitPage() {
  const { data: session } = useSession()

  const [teacherName, setTeacherName] = useState("")
  const [submissionType, setSubmissionType] =
    useState("Observation Report")
  const [feedback, setFeedback] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!teacherName) {
      setMessage("Please enter the teacher name.")
      return
    }

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
          formType: "management",
          teacherName,
          submissionType,
          observer: session?.user?.name || "",
          feedback,
          fileName: file.name,
          mimeType: file.type,
          fileBase64,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage("Management report submitted successfully!")
        setTeacherName("")
        setFeedback("")
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
        Management Submission
      </h1>

      <p className="text-gray-500 mb-8">
        Upload official academic observations and coaching records.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow max-w-3xl"
      >
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Reviewer
          </label>

          <input
            value={session?.user?.name || ""}
            disabled
            className="w-full p-4 rounded-xl border bg-gray-100"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Teacher Name
          </label>

          <input
            value={teacherName}
            onChange={(e) =>
              setTeacherName(e.target.value)
            }
            placeholder="Enter teacher name..."
            className="w-full p-4 rounded-xl border"
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
            <option>Observation Report</option>
            <option>Reflection Task</option>
            <option>Coaching Session</option>
            <option>Supervised Class</option>
            <option>Training Follow-up</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Feedback
          </label>

          <textarea
            value={feedback}
            onChange={(e) =>
              setFeedback(e.target.value)
            }
            rows={8}
            placeholder="Write detailed academic feedback..."
            className="w-full p-4 rounded-xl border"
          />
        </div>

        <div className="mb-8">
          <label className="block font-semibold mb-2">
            Upload PDF / Report
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
          {loading
            ? "Submitting..."
            : "Submit Academic Record"}
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