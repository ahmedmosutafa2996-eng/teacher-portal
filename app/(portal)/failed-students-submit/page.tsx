"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

const API_URL =
  "https://script.google.com/macros/s/AKfycbwjbCWb2CbwJVlsxdxs2fLlZ7Nag3stJfVEKS9WWVkhp7if1ZfeASXoHmfJ6YPOAEnPDw/exec"

const levels = [
  "E0", "E1", "E2", "E3",
  "Pre 1", "Pre 2", "Pre 3",
  "Intermediate 1", "Intermediate 2", "Intermediate 3",
  "Upper Intermediate 1", "Upper Intermediate 2", "Upper Intermediate 3",
  "Advanced 1", "Advanced 2", "Advanced 3",
]

const failedReasons = [
  "Absent 3 sessions or more",
  "Did not attend the exam",
  "Did not complete the final assessment",
  "Irregular attendance",
  "Weak grammar accuracy",
  "Limited vocabulary range",
  "Difficulty using past tenses",
  "Difficulty using verb to be",
  "Drops the subject in sentences",
  "Weak sentence structure",
  "Weak speaking fluency",
  "Weak pronunciation",
  "Difficulty understanding listening tasks",
  "Weak writing coherence",
  "Incomplete homework",
  "Low class participation",
  "Over-reliance on Arabic",
  "Needs more practice before moving up",
]

function normalizeRole(role: string) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
}

export default function FailedStudentsSubmitPage() {
  const { data: session } = useSession() as any

  const userName = session?.user?.name
  const userEmail = session?.user?.email

  const [people, setPeople] = useState<any[]>([])
  const [currentUserRole, setCurrentUserRole] = useState("")
  const [studentName, setStudentName] = useState("")
  const [days, setDays] = useState("")
  const [time, setTime] = useState("")
  const [level, setLevel] = useState("E0")
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [extraReason, setExtraReason] = useState("")
  const [toEmails, setToEmails] = useState<string[]>([])
  const [ccEmails, setCcEmails] = useState<string[]>([])
  const [status, setStatus] = useState("Pending Review")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
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

      const nonTeachers = allPeople.filter(
        (person: any) =>
          normalizeRole(person.Role) !== "teacher"
      )

      setPeople(nonTeachers)
    }

    if (session) {
      fetchData()
    }
  }, [session, userEmail, userName])

  const canSubmit =
    currentUserRole === "teacher" ||
    currentUserRole === "team_leader" ||
    userName === "Ahmed Mostafa"

  function toggleItem(
    item: string,
    list: string[],
    setList: (value: string[]) => void
  ) {
    if (list.includes(item)) {
      setList(list.filter((value) => value !== item))
    } else {
      setList([...list, item])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!canSubmit) {
      setMessage("You do not have permission to submit failed student reports.")
      return
    }

    if (selectedReasons.length === 0) {
      setMessage("Please choose at least one reason.")
      return
    }

    if (toEmails.length === 0) {
      setMessage("Please choose at least one TO recipient.")
      return
    }

    const finalReason = extraReason
      ? `${selectedReasons.join(", ")}\n\nAdditional notes:\n${extraReason}`
      : selectedReasons.join(", ")

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          formType: "failed-student",
          studentName,
          days,
          time,
          level,
          reason: finalReason,
          reportedBy: userName || "",
          toEmails,
          ccEmails,
          status,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage("Failed student report submitted and email sent successfully!")

        setStudentName("")
        setDays("")
        setTime("")
        setLevel("E0")
        setSelectedReasons([])
        setExtraReason("")
        setToEmails([])
        setCcEmails([])
        setStatus("Pending Review")
      } else {
        setMessage("Error: " + data.error)
      }
    } catch {
      setMessage("Something went wrong.")
    }

    setLoading(false)
  }

  if (!canSubmit) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-4">
          Access Denied
        </h1>

        <p className="text-gray-500">
          You do not have permission to submit failed student reports.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Submit Failed Student
      </h1>

      <p className="text-gray-500 mb-8">
        Submit failed student reports and notify the relevant team.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="p-4 border rounded-xl"
            required
          />

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="p-4 border rounded-xl"
            required
          >
            {levels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <input
            placeholder="Days e.g. Sat and Tue"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="p-4 border rounded-xl"
            required
          />

          <input
            placeholder="Time e.g. 2-4"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-4 border rounded-xl"
            required
          />

          <input
            value={userName || ""}
            disabled
            className="p-4 border rounded-xl bg-gray-100"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-4 border rounded-xl"
          >
            <option>Pending Review</option>
            <option>Confirmed Failed</option>
            <option>Needs Follow-up</option>
            <option>Passed After Review</option>
          </select>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Reasons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {failedReasons.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-3 p-3 border rounded-xl"
              >
                <input
                  type="checkbox"
                  checked={selectedReasons.includes(reason)}
                  onChange={() =>
                    toggleItem(reason, selectedReasons, setSelectedReasons)
                  }
                />

                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <textarea
          value={extraReason}
          onChange={(e) => setExtraReason(e.target.value)}
          rows={6}
          placeholder="Additional details..."
          className="w-full p-4 border rounded-xl"
        />

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Send To
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {people.map((person) => (
              <label
                key={person.Email}
                className="flex items-center gap-3 p-3 border rounded-xl"
              >
                <input
                  type="checkbox"
                  checked={toEmails.includes(person.Email)}
                  onChange={() =>
                    toggleItem(person.Email, toEmails, setToEmails)
                  }
                />

                <span>
                  {person.Name} — {person.Role}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            CC
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {people.map((person) => (
              <label
                key={person.Email + "-cc"}
                className="flex items-center gap-3 p-3 border rounded-xl"
              >
                <input
                  type="checkbox"
                  checked={ccEmails.includes(person.Email)}
                  onChange={() =>
                    toggleItem(person.Email, ccEmails, setCcEmails)
                  }
                />

                <span>
                  {person.Name} — {person.Role}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-4 rounded-xl disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit Failed Student Report"}
        </button>

        {message && (
          <p className="text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}