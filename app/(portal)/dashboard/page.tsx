"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

const UPLOADS_API =
  "https://script.google.com/macros/s/AKfycbwjbCWb2CbwJVlsxdxs2fLlZ7Nag3stJfVEKS9WWVkhp7if1ZfeASXoHmfJ6YPOAEnPDw/exec"

export default function DashboardPage() {
  const { data: session } = useSession() as any
  const [submissions, setSubmissions] = useState<any[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(UPLOADS_API, {
          cache: "no-store",
        })

        const data = await res.json()

        const teacherUploads = (data.teacherUploads || []).map((item: any) => ({
          timestamp: item["Timestamp"] || item["Timestamp "],
          teacherName: item["Teacher Name"]?.trim(),
          submissionType: item["Submission Type"],
          observer: "Teacher Upload",
          status: "Pending",
        }))

        const managementReports = (data.managementReports || []).map((item: any) => ({
          timestamp: item["Timestamp"],
          teacherName: item["Teacher Name"]?.trim(),
          submissionType: item["Submission Type"],
          observer: item["Observer"],
          status: item["Status"] || "Published",
        }))

        let combined = [
          ...teacherUploads,
          ...managementReports,
        ]

        if (session?.user?.role === "teacher") {
          combined = combined.filter(
            (item: any) =>
              item.teacherName?.toLowerCase() ===
              session.user.name?.toLowerCase()
          )
        }

        setSubmissions(combined)
      } catch (err) {
        setError("Could not load dashboard data. Please refresh the page.")
      }
    }

    if (session) {
      fetchData()
    }
  }, [session])

  const isTeacher =
    session?.user?.role === "teacher"

  const totalSubmissions = submissions.length

  const observationReports = submissions.filter(
    (item: any) =>
      item.submissionType === "Observation Report"
  ).length

  const reflectionTasks = submissions.filter(
    (item: any) =>
      item.submissionType === "Reflection Task"
  ).length

  const coachingSessions = submissions.filter(
    (item: any) =>
      item.submissionType === "Coaching Session"
  ).length

  const uniqueTeachers = new Set(
    submissions.map((item: any) => item.teacherName)
  ).size

  const latestActivity = submissions
    .slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 5)

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          {isTeacher
            ? `Welcome, ${session?.user?.name}`
            : "Management Dashboard"}
        </h1>

        <p className="text-gray-500">
          {isTeacher
            ? "Here is your personal development overview."
            : "Here is the full teacher development overview."}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-black">
          <p className="text-gray-500 mb-2">
            Total Records
          </p>
          <p className="text-4xl font-bold">
            {totalSubmissions}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-blue-600">
          <p className="text-gray-500 mb-2">
            Observations
          </p>
          <p className="text-4xl font-bold">
            {observationReports}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-green-600">
          <p className="text-gray-500 mb-2">
            Reflections
          </p>
          <p className="text-4xl font-bold">
            {reflectionTasks}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-purple-600">
          <p className="text-gray-500 mb-2">
            {isTeacher ? "Profile" : "Teachers"}
          </p>
          <p className="text-4xl font-bold">
            {isTeacher ? 1 : uniqueTeachers}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6">
            Recent Activity
          </h2>

          <div className="space-y-5">
            {latestActivity.length === 0 && (
              <p className="text-gray-500">
                No records found yet.
              </p>
            )}

            {latestActivity.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-start border-b pb-4"
              >
                <div>
                  <p className="font-semibold">
                    {item.teacherName}
                  </p>

                  <p className="text-gray-600">
                    {item.submissionType}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Observer: {item.observer}
                  </p>
                </div>

                <p className="text-sm text-gray-400">
                  {new Date(
                    item.timestamp
                  ).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black text-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">
            Quick Summary
          </h2>

          <p className="text-gray-300 mb-6">
            {isTeacher
              ? "This space shows your personal teaching development activity."
              : "This space shows the overall branch teacher development activity."}
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400">
                Coaching Sessions
              </p>
              <p className="text-3xl font-bold">
                {coachingSessions}
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Latest Update
              </p>
              <p className="text-lg">
                {latestActivity[0]
                  ? latestActivity[0].submissionType
                  : "No updates yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}