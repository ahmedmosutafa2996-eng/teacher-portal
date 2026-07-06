"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

const API_URL =
  "https://script.google.com/macros/s/AKfycbz4Qr4NQjfIHEJEqcwOtoQ6OvdT4kRLYbXKwubJ3AGwLa1g5VgFvwMi3kfDj6UetPmT/exec"

const levels = [
  "E0",
  "E1",
  "E2",
  "E3",
  "Pre 1",
  "Pre 2",
  "Pre 3",
  "Intermediate 1",
  "Intermediate 2",
  "Intermediate 3",
  "Upper Intermediate 1",
  "Upper Intermediate 2",
  "Upper Intermediate 3",
  "Advanced 1",
  "Advanced 2",
  "Advanced 3",
]

const strengths = [
  "Strong vocabulary range",
  "Accurate grammar usage",
  "Good pronunciation",
  "Clear sentence structure",
  "Good fluency",
  "Appropriate use of tenses",
  "Good listening comprehension",
  "Clear spoken English",
  "Effective use of new language",
  "Good spelling in writing",
  "Actively participates in class",
  "Confident speaker",
  "Follows instructions well",
  "Shows continuous improvement",
  "Asks relevant questions",
  "Works well in pairs/groups",
  "Demonstrates critical thinking",
  "Maintains good classroom discipline",
  "Positive learning attitude",
]

const weaknesses = [
  "Limited vocabulary",
  "Frequent grammar mistakes",
  "Weak pronunciation",
  "Hesitation while speaking",
  "Sentence structure needs improvement",
  "Confusion with tenses",
  "Difficulty understanding listening tasks",
  "Inaccurate word choice",
  "Spelling mistakes",
  "Weak coherence in writing",
  "Low class participation",
  "Lacks confidence when speaking",
  "Needs more fluency practice",
  "Incomplete homework",
  "Easily distracted in class",
  "Weak time management",
  "Over-reliance on Arabic",
  "Avoids speaking tasks",
  "Needs more practice using new language",
  "Irregular attendance",
]

const scoreFields = [
  "Attendance",
  "Presentation",
  "Vocabulary",
  "Fluency",
  "Grammar",
  "Structure",
  "Pronunciation",
  "Listening",
  "Spoken Arabic Rate",
  "Home Assignments",
]

export default function ScorecardSubmitPage() {
  const { data: session } = useSession() as any

  const [form, setForm] = useState<any>({
    "Student Name": "",
    Level: "E0",
    Day: "",
    time: "",
    Attendance: "",
    Presentation: "",
    Vocabulary: "",
    Fluency: "",
    Grammar: "",
    Structure: "",
    Pronunciation: "",
    Listening: "",
    "Spoken Arabic Rate": "",
    "Home Assignments": "",
    "Other Strength": "",
    "Other Weakness (Optional)": "",
  })

  const [selectedStrengths, setSelectedStrengths] =
    useState<string[]>([])

  const [selectedWeaknesses, setSelectedWeaknesses] =
    useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  function updateField(field: string, value: string) {
    setForm({
      ...form,
      [field]: value,
    })
  }

  function toggleStrength(value: string) {
    if (selectedStrengths.includes(value)) {
      setSelectedStrengths(
        selectedStrengths.filter((item) => item !== value)
      )
    } else {
      setSelectedStrengths([...selectedStrengths, value])
    }
  }

  function toggleWeakness(value: string) {
    if (selectedWeaknesses.includes(value)) {
      setSelectedWeaknesses(
        selectedWeaknesses.filter((item) => item !== value)
      )
    } else {
      setSelectedWeaknesses([...selectedWeaknesses, value])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selectedStrengths.length === 0) {
      setMessage("Please select at least one strength.")
      return
    }

    if (selectedWeaknesses.length === 0) {
      setMessage("Please select at least one weakness.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const payload = {
        ...form,
        "Teacher name": session?.user?.name || "",
        "Student Strengths": selectedStrengths.join(", "),
        "Student Weaknesses": selectedWeaknesses.join(", "),
      }

      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setMessage("Scorecard submitted successfully!")

        setForm({
          "Student Name": "",
          Level: "E0",
          Day: "",
          time: "",
          Attendance: "",
          Presentation: "",
          Vocabulary: "",
          Fluency: "",
          Grammar: "",
          Structure: "",
          Pronunciation: "",
          Listening: "",
          "Spoken Arabic Rate": "",
          "Home Assignments": "",
          "Other Strength": "",
          "Other Weakness (Optional)": "",
        })

        setSelectedStrengths([])
        setSelectedWeaknesses([])
      } else {
        setMessage("Error: " + data.error)
      }
    } catch {
      setMessage("Something went wrong.")
    }

    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Submit Scorecard
      </h1>

      <p className="text-gray-500 mb-8">
        Submit student scorecards directly from the portal.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            placeholder="Student Name"
            value={form["Student Name"]}
            onChange={(e) =>
              updateField("Student Name", e.target.value)
            }
            className="p-4 border rounded-xl"
            required
          />

          <select
            value={form.Level}
            onChange={(e) =>
              updateField("Level", e.target.value)
            }
            className="p-4 border rounded-xl"
            required
          >
            {levels.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>

          <input
            placeholder="Day"
            value={form.Day}
            onChange={(e) =>
              updateField("Day", e.target.value)
            }
            className="p-4 border rounded-xl"
            required
          />

          <input
            placeholder="Time"
            value={form.time}
            onChange={(e) =>
              updateField("time", e.target.value)
            }
            className="p-4 border rounded-xl"
            required
          />

          <input
            value={session?.user?.name || ""}
            disabled
            className="p-4 border rounded-xl bg-gray-100"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Scores
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scoreFields.map((field) => (
              <div key={field}>
                <label className="block font-semibold mb-2">
                  {field}
                </label>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form[field]}
                  onChange={(e) =>
                    updateField(field, e.target.value)
                  }
                  className="w-full p-4 border rounded-xl"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Student Strengths
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strengths.map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 p-3 border rounded-xl"
              >
                <input
                  type="checkbox"
                  checked={selectedStrengths.includes(item)}
                  onChange={() => toggleStrength(item)}
                />

                <span>{item}</span>
              </label>
            ))}
          </div>

          <input
            placeholder="Other Strength (optional)"
            value={form["Other Strength"]}
            onChange={(e) =>
              updateField("Other Strength", e.target.value)
            }
            className="w-full mt-4 p-4 border rounded-xl"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Student Weaknesses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weaknesses.map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 p-3 border rounded-xl"
              >
                <input
                  type="checkbox"
                  checked={selectedWeaknesses.includes(item)}
                  onChange={() => toggleWeakness(item)}
                />

                <span>{item}</span>
              </label>
            ))}
          </div>

          <input
            placeholder="Other Weakness (optional)"
            value={form["Other Weakness (Optional)"]}
            onChange={(e) =>
              updateField(
                "Other Weakness (Optional)",
                e.target.value
              )
            }
            className="w-full mt-4 p-4 border rounded-xl"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-4 rounded-xl disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit Scorecard"}
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