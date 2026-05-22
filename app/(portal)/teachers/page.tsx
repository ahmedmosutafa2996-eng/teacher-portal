"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function TeachersPage() {
  const { data: session } = useSession()

  const [teachers, setTeachers] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbxn4LKrL3Ja8ZfhcidQuYtZ6TrFXqjAgKrhoqD1dFlGdOcZM6L0k1RRkNuUsQ7gpCctwQ/exec"
      )

      const submissions = await res.json()

      let filteredSubmissions = submissions

      // 👨‍🏫 Teacher personalization
      if (session?.user?.role === "teacher") {
        filteredSubmissions =
          submissions.filter(
            (item: any) =>
              item["Teacher Name"] ===
              session.user.name
          )
      }

      const uniqueTeachers = Array.from(
        new Set(
          filteredSubmissions.map(
            (item: any) => item["Teacher Name"]
          )
        )
      )

      const teacherData = uniqueTeachers.map(
        (teacher: any) => {
          const teacherSubmissions =
            filteredSubmissions.filter(
              (item: any) =>
                item["Teacher Name"] === teacher
            )

          const latestSubmission =
            teacherSubmissions[
              teacherSubmissions.length - 1
            ]

          return {
            teacher,
            submissionsCount:
              teacherSubmissions.length,
            latestSubmission,
          }
        }
      )

      setTeachers(teacherData)
    }

    fetchData()
  }, [session])

  const filteredTeachers = teachers.filter(
    (item: any) =>
      item.teacher
        ?.toLowerCase()
        .includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Teachers
      </h1>

      <input
        type="text"
        placeholder="Search teacher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-8 p-4 rounded-xl border border-gray-300"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {filteredTeachers.map(
          (item: any, index: number) => {

            const slug = item.teacher
              .toLowerCase()
              .replace(/\s+/g, "-")

            const initials = item.teacher
              .split(" ")
              .map((word: string) => word[0])
              .join("")
              .slice(0, 2)

            return (
              <Link
                key={index}
                href={`/teachers/${slug}`}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold mb-4">
                  {initials}
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  {item.teacher}
                </h2>

                <p className="text-gray-600 mb-1">
                  Submissions:
                  {" "}
                  {item.submissionsCount}
                </p>

                <p className="text-sm text-gray-400">
                  Latest:
                  {" "}
                  {item.latestSubmission
                    ? item.latestSubmission[
                        "Submission Type"
                      ]
                    : "No submissions"}
                </p>

                <p className="text-blue-600 mt-4">
                  View Portfolio →
                </p>
              </Link>
            )
          }
        )}

      </div>
    </div>
  )
}