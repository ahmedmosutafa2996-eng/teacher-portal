"use client"

import { useEffect, useState } from "react"

function fixDriveLink(url: string) {
  if (!url) return ""

  const match = url.match(/id=([^&]+)/)

  if (match) {
    const fileId = match[1]
    return `https://drive.google.com/file/d/${fileId}/view`
  }

  return url
}

function getStatusColor(status: string) {
  switch (status) {
    case "Reviewed":
      return "bg-blue-100 text-blue-700"

    case "Signed":
      return "bg-green-100 text-green-700"

    default:
      return "bg-yellow-100 text-yellow-700"
  }
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] =
    useState("All")

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbxn4LKrL3Ja8ZfhcidQuYtZ6TrFXqjAgKrhoqD1dFlGdOcZM6L0k1RRkNuUsQ7gpCctwQ/exec"
      )

      const data = await res.json()

      setSubmissions(data)
    }

    fetchData()
  }, [])

  const filteredSubmissions = submissions.filter(
    (item) => {
      const matchesSearch =
        item["Teacher Name"]
          ?.toLowerCase()
          .includes(search.toLowerCase())

      const matchesType =
        typeFilter === "All" ||
        item["Submission Type"] ===
          typeFilter

      return matchesSearch && matchesType
    }
  )

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Feedback & Submissions
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search teacher..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full mb-6 p-4 rounded-xl border border-gray-300"
      />

      {/* Filter */}
      <select
        value={typeFilter}
        onChange={(e) =>
          setTypeFilter(e.target.value)
        }
        className="w-full mb-8 p-4 rounded-xl border border-gray-300"
      >
        <option value="All">
          All Submission Types
        </option>

        <option value="Observation Report">
          Observation Report
        </option>

        <option value="Reflection Task">
          Reflection Task
        </option>

        <option value="Coaching Session">
          Coaching Session
        </option>
      </select>

      <div className="space-y-8">

        {filteredSubmissions.map(
          (item: any, index: number) => {
            const rawLink =
              item[
                "Upload PDF Report \\ Reflection Task "
              ]

            const fixedLink =
              fixDriveLink(rawLink)

            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">

                  <div>
                    <h2 className="text-2xl font-bold">
                      {item["Teacher Name"]}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Observer:
                      {" "}
                      {item["Observer"]}
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(
                        item["Timestamp"]
                      ).toLocaleDateString()}
                    </p>

                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mb-2">
                      {item["Submission Type"]}
                    </span>

                    <br />

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                        item["Status"]
                      )}`}
                    >
                      {item["Status"] || "Pending"}
                    </span>

                  </div>
                </div>

                {/* Feedback */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-lg">
                    Feedback
                  </h3>

                  <p className="text-gray-700 whitespace-pre-line leading-7">
                    {item["Feedback"]}
                  </p>
                </div>

                {/* PDF Button */}
                <a
                  href={fixedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800"
                >
                  Open PDF / Reflection
                </a>

              </div>
            )
          }
        )}

      </div>
    </div>
  )
}