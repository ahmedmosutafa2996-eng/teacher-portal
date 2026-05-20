"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts"

import { useEffect, useState } from "react"

export default function AnalyticsPage() {
  const [submissions, setSubmissions] =
    useState<any[]>([])

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

  const observationCount = submissions.filter(
    (item) =>
      item["Submission Type"] ===
      "Observation Report"
  ).length

  const reflectionCount = submissions.filter(
    (item) =>
      item["Submission Type"] ===
      "Reflection Task"
  ).length

  const coachingCount = submissions.filter(
    (item) =>
      item["Submission Type"] ===
      "Coaching Session"
  ).length

  const pieData = [
    {
      name: "Observation",
      value: observationCount,
    },
    {
      name: "Reflection",
      value: reflectionCount,
    },
    {
      name: "Coaching",
      value: coachingCount,
    },
  ]

  const teacherMap: any = {}

  submissions.forEach((item) => {
    const teacher = item["Teacher Name"]

    if (!teacherMap[teacher]) {
      teacherMap[teacher] = 0
    }

    teacherMap[teacher]++
  })

  const teacherData = Object.keys(
    teacherMap
  ).map((teacher) => ({
    teacher,
    submissions: teacherMap[teacher],
  }))

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Analytics
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6">
            Submission Types
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#16a34a" />
                  <Cell fill="#9333ea" />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6">
            Teacher Activity
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={teacherData}>
                <XAxis dataKey="teacher" />
                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="submissions"
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}