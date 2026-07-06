"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

const API_URL =
  "https://script.google.com/macros/s/AKfycbwjbCWb2CbwJVlsxdxs2fLlZ7Nag3stJfVEKS9WWVkhp7if1ZfeASXoHmfJ6YPOAEnPDw/exec"

function getStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700"
    case "Cancelled":
      return "bg-red-100 text-red-700"
    default:
      return "bg-yellow-100 text-yellow-700"
  }
}

export default function SchedulePage() {
  const { data: session } = useSession() as any
  const [schedule, setSchedule] = useState<any[]>([])

  useEffect(() => {
    async function fetchSchedule() {
      const res = await fetch(API_URL)
      const data = await res.json()

      let scheduleData = data.schedule || []

      if (session?.user?.role === "teacher") {
        scheduleData = scheduleData.filter(
          (item: any) =>
            item["Teacher Name"]?.trim().toLowerCase() ===
            session.user.name?.trim().toLowerCase()
        )
      }

      setSchedule(scheduleData)
    }

    if (session) {
      fetchSchedule()
    }
  }, [session])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Schedule
      </h1>

      <p className="text-gray-500 mb-8">
        {session?.user?.role === "teacher"
          ? "Showing your scheduled academic events."
          : "Management view of all scheduled academic events."}
      </p>

      <div className="space-y-6">
        {schedule.length === 0 && (
          <div className="bg-white p-8 rounded-2xl shadow">
            <p className="text-gray-500">
              No schedule items found.
            </p>
          </div>
        )}

        {schedule.map((item: any, index: number) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {item["Event Type"]}
                </h2>

                <p className="text-gray-500 mt-1">
                  Teacher: {item["Teacher Name"]}
                </p>

                <p className="text-gray-500 mt-1">
                  Observer: {item["Observer"]}
                </p>
              </div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                  item["Status"]
                )}`}
              >
                {item["Status"] || "Upcoming"}
              </span>
            </div>

            <p className="text-gray-700 mb-2">
              <strong>Date:</strong> {item["Date"]}
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Time:</strong> {item["Time"]}
            </p>

            {item["Notes"] && (
              <p className="text-gray-700 mt-4 whitespace-pre-line">
                <strong>Notes:</strong> {item["Notes"]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}