"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

const API_URL =
  "https://script.google.com/macros/s/AKfycbwjbCWb2CbwJVlsxdxs2fLlZ7Nag3stJfVEKS9WWVkhp7if1ZfeASXoHmfJ6YPOAEnPDw/exec"

export default function ScheduleManagementPage() {
  const { data: session } = useSession() as any

  const [teacherName, setTeacherName] = useState("")
  const [eventType, setEventType] = useState("Observation")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("Upcoming")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const allowed =
    session?.user?.name === "Ahmed Mostafa" ||
    session?.user?.name === "Khaled Magdy"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!allowed) {
      setMessage("You do not have permission to create schedule items.")
      return
    }

    if (!teacherName || !date || !time) {
      setMessage("Please complete teacher, date, and time.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          formType: "schedule",
          date,
          time,
          teacherName,
          eventType,
          observer: session?.user?.name || "",
          notes,
          status,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage("Schedule item created successfully!")
        setTeacherName("")
        setEventType("Observation")
        setDate("")
        setTime("")
        setNotes("")
        setStatus("Upcoming")
      } else {
        setMessage("Error: " + data.error)
      }
    } catch {
      setMessage("Something went wrong.")
    }

    setLoading(false)
  }

  if (!allowed) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-4">
          Access Denied
        </h1>

        <p className="text-gray-500">
          Only Ahmed Mostafa and Khaled Magdy can manage schedule items.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Schedule Management
      </h1>

      <p className="text-gray-500 mb-8">
        Create observations, coaching sessions, supervised classes, trainings, and follow-ups.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow max-w-3xl"
      >
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Teacher Name
          </label>

          <input
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Enter teacher name..."
            className="w-full p-4 rounded-xl border"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Event Type
          </label>

          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full p-4 rounded-xl border"
          >
            <option>Observation</option>
            <option>Coaching Session</option>
            <option>Supervised Class</option>
            <option>Training</option>
            <option>Follow-up</option>
            <option>Meeting</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-xl border"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Time
            </label>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-4 rounded-xl border"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-4 rounded-xl border"
          >
            <option>Upcoming</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="mb-8">
          <label className="block font-semibold mb-2">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Write schedule notes..."
            className="w-full p-4 rounded-xl border"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Schedule Item"}
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