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
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

const UPLOADS_API =
  "https://script.google.com/macros/s/AKfycbwjbCWb2CbwJVlsxdxs2fLlZ7Nag3stJfVEKS9WWVkhp7if1ZfeASXoHmfJ6YPOAEnPDw/exec"

export default function AnalyticsPage() {
  const { data: session } = useSession()

  const [submissions, setSubmissions] =
    useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(UPLOADS_API)
      const data = await res.json()

      const teacherUploads =
        data.teacherUploads.map(
          (item: any) => ({
            timestamp:
              item["Timestamp"] ||
              item["Timestamp "],
            teacherName:
              item["Teacher Name"]?.trim(),
            submissionType:
              item["Submission Type"],
          })
        )

      const managementReports =
        data.managementReports.map(
          (item: any) => ({
            timestamp: item["Timestamp"],
            teacherName:
              item["Teacher Name"]?.trim(),
            submissionType:
              item["Submission Type"],
          })
        )

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
    }

    if (session) {
      fetchData()
    }
  }, [session])

  const observationCount =
    submissions.filter(
      (item) =>
        item.submissionType ===
        "Observation Report"
    ).length

  const reflectionCount =
    submissions.filter(
      (item) =>
        item.submissionType ===
        "Reflection Task"
    ).length

  const coachingCount =
    submissions.filter(
      (item) =>
        item.submissionType ===
        "Coaching Session"
    ).length

  const supervisedClassCount =
    submissions.filter(
      (item) =>
        item.submissionType ===
        "Supervised Class"
    ).length

  const trainingFollowUpCount =
    submissions.filter(
      (item) =>
        item.submissionType ===
        "Training Follow-up"
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
    {
      name: "Supervised",
      value: supervisedClassCount,
    },
    {
      name: "Training",
      value: trainingFollowUpCount,
    },
  ]

  const teacherMap: any = {}

  submissions.forEach((item) => {
    const teacher = item.teacherName

    if (!teacherMap[teacher]) {
      teacherMap[teacher] = 0
    }

    teacherMap[teacher]++
  })

  const teacherData =
    Object.keys(teacherMap).map(
      (teacher) => ({
        teacher,
        submissions:
          teacherMap[teacher],
      })
    )

  const monthlyMap: any = {}

  submissions.forEach((item) => {
    const month = new Date(
      item.timestamp
    ).toLocaleString("default", {
      month: "short",
    })

    if (!monthlyMap[month]) {
      monthlyMap[month] = 0
    }

    monthlyMap[month]++
  })

  const monthlyData =
    Object.keys(monthlyMap).map(
      (month) => ({
        month,
        submissions:
          monthlyMap[month],
      })
    )

  const isTeacher =
    session?.user?.role === "teacher"

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          Analytics
        </h1>

        <p className="text-gray-500">
          {isTeacher
            ? `Personal analytics for ${session?.user?.name}`
            : "Branch-wide analytics overview"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-blue-600">
          <p className="text-gray-500 mb-2">
            Observations
          </p>
          <p className="text-4xl font-bold">
            {observationCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-green-600">
          <p className="text-gray-500 mb-2">
            Reflections
          </p>
          <p className="text-4xl font-bold">
            {reflectionCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-purple-600">
          <p className="text-gray-500 mb-2">
            Coaching
          </p>
          <p className="text-4xl font-bold">
            {coachingCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-orange-600">
          <p className="text-gray-500 mb-2">
            Supervised
          </p>
          <p className="text-4xl font-bold">
            {supervisedClassCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-black">
          <p className="text-gray-500 mb-2">
            Training
          </p>
          <p className="text-4xl font-bold">
            {trainingFollowUpCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
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
                  <Cell fill="#ea580c" />
                  <Cell fill="#111827" />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6">
            {isTeacher
              ? "My Activity"
              : "Teacher Activity"}
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={teacherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="teacher" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="submissions"
                  fill="#2563eb"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">
          Monthly Submission Trend
        </h2>

        <div className="h-96">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="#2563eb"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}