"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

const API_URL =
  "https://script.google.com/macros/s/AKfycbwjbCWb2CbwJVlsxdxs2fLlZ7Nag3stJfVEKS9WWVkhp7if1ZfeASXoHmfJ6YPOAEnPDw/exec"

const levels = [
  "All",
  "E0", "E1", "E2", "E3",
  "Pre 1", "Pre 2", "Pre 3",
  "Intermediate 1", "Intermediate 2", "Intermediate 3",
  "Upper Intermediate 1", "Upper Intermediate 2", "Upper Intermediate 3",
  "Advanced 1", "Advanced 2", "Advanced 3",
]

const statuses = [
  "All",
  "Pending Review",
  "Confirmed Failed",
  "Needs Follow-up",
  "Passed After Review",
]

const editableStatuses = [
  "Pending Review",
  "Confirmed Failed",
  "Needs Follow-up",
  "Passed After Review",
]

function normalizeRole(role: string) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
}

function getStatusColor(status: string) {
  switch (status) {
    case "Confirmed Failed":
      return "bg-red-100 text-red-700"

    case "Needs Follow-up":
      return "bg-orange-100 text-orange-700"

    case "Passed After Review":
      return "bg-green-100 text-green-700"

    default:
      return "bg-yellow-100 text-yellow-700"
  }
}

export default function FailedStudentsPage() {
  const { data: session } = useSession() as any

  const userName = session?.user?.name
  const userEmail = session?.user?.email

  const [failedStudents, setFailedStudents] =
    useState<any[]>([])

  const [currentUserRole, setCurrentUserRole] =
    useState("")

  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [updatingRow, setUpdatingRow] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  async function fetchData() {
    const res = await fetch(API_URL, {
      cache: "no-store",
    })

    const data = await res.json()
    const allPeople = data.teachers || []

    const currentUser = allPeople.find(
      (person: any) =>
        String(person.Email).trim().toLowerCase() ===
          String(userEmail).trim().toLowerCase() ||
        String(person.Name).trim().toLowerCase() ===
          String(userName).trim().toLowerCase()
    )

    setCurrentUserRole(
      normalizeRole(currentUser?.Role || session?.user?.role)
    )

    setFailedStudents(data.failedStudents || [])
  }

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, userEmail, userName])

  const canView =
    currentUserRole === "admin" ||
    currentUserRole === "team_leader" ||
    currentUserRole === "academic_supervisor" ||
    currentUserRole === "branch_manager" ||
    userName === "Ahmed Mostafa" ||
    userName === "Khaled Magdy"

  const canUpdateStatus =
    currentUserRole === "admin" ||
    currentUserRole === "team_leader" ||
    currentUserRole === "academic_supervisor" ||
    currentUserRole === "branch_manager" ||
    userName === "Ahmed Mostafa" ||
    userName === "Khaled Magdy"

  async function updateStatus(rowNumber: number, status: string) {
    setUpdatingRow(rowNumber)
    setMessage("")

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          formType: "update-failed-student-status",
          rowNumber,
          status,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage("Status updated successfully.")
        await fetchData()
      } else {
        setMessage("Error: " + data.error)
      }
    } catch {
      setMessage("Something went wrong while updating the status.")
    }

    setUpdatingRow(null)
  }

  const filteredStudents = failedStudents.filter(
    (item: any) => {
      const studentName = String(
        item["Student Name"] || ""
      ).toLowerCase()

      const level = String(
        item["Level"] || ""
      ).trim()

      const status = String(
        item["Status"] || "Pending Review"
      ).trim()

      const matchesSearch =
        studentName.includes(search.toLowerCase())

      const matchesLevel =
        levelFilter === "All" ||
        level === levelFilter

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter

      return (
        matchesSearch &&
        matchesLevel &&
        matchesStatus
      )
    }
  )

  if (!canView) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-4">
          Access Denied
        </h1>

        <p className="text-gray-500">
          You do not have permission to view failed student records.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Failed Students
      </h1>

      <p className="text-gray-500 mb-8">
        Review, search, filter, and update failed student reports.
      </p>

      {message && (
        <div className="bg-blue-100 text-blue-700 p-4 rounded-xl mb-6">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <input
          type="text"
          placeholder="Search student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-4 border rounded-xl"
        />

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="p-4 border rounded-xl"
        >
          {levels.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-4 border rounded-xl"
        >
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="mb-6 text-gray-500">
        Showing {filteredStudents.length} of {failedStudents.length} records.
      </div>

      <div className="space-y-6">
        {filteredStudents.length === 0 && (
          <div className="bg-white p-8 rounded-2xl shadow">
            <p className="text-gray-500">
              No failed student reports found.
            </p>
          </div>
        )}

        {filteredStudents.map((item: any, index: number) => {
          const status =
            item["Status"] || "Pending Review"

          const rowNumber =
            Number(item["_rowNumber"])

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow"
            >
              <div className="flex justify-between mb-4 gap-6">
                <div>
                  <h3 className="text-2xl font-bold">
                    {item["Student Name"]}
                  </h3>

                  <p className="text-gray-500">
                    Level: {item["Level"]}
                  </p>

                  <p className="text-gray-500">
                    Reported by: {item["Reported By"]}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full h-fit mb-3 ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>

                  {canUpdateStatus && rowNumber && (
                    <div className="flex gap-2">
                      <select
                        defaultValue={status}
                        onChange={(e) =>
                          updateStatus(rowNumber, e.target.value)
                        }
                        disabled={updatingRow === rowNumber}
                        className="p-2 border rounded-xl text-sm"
                      >
                        {editableStatuses.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <p className="text-gray-700">
                  <strong>Days:</strong> {item["Days"]}
                </p>

                <p className="text-gray-700">
                  <strong>Time:</strong> {item["Time"]}
                </p>

                <p className="text-gray-700">
                  <strong>To:</strong> {item["To"]}
                </p>

                <p className="text-gray-700">
                  <strong>CC:</strong> {item["CC"]}
                </p>
              </div>

              <p className="text-gray-700 whitespace-pre-line mt-4 leading-7">
                <strong>Reason:</strong> {item["Reason"]}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}