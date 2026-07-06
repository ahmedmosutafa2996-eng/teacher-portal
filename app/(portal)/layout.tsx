"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SessionProvider,
  signOut,
  useSession,
} from "next-auth/react"

function normalizeRole(role: string) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
}

function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession() as any

  const role = normalizeRole(session?.user?.role)
  const userName = session?.user?.name

  const isTeacher = role === "teacher"
  const isTeamLeader =
    role === "team_leader" ||
    userName === "Ahmed Mostafa"

  const isAcademicSupervisor =
    role === "academic_supervisor" ||
    userName === "Khaled Magdy"

  const isBranchManager =
    role === "branch_manager"

  const isAdmin =
    role === "admin"

  const canSeeTeachers =
    isTeamLeader ||
    isAcademicSupervisor ||
    isBranchManager ||
    isAdmin

  const canSeeSubmissions =
    isTeacher ||
    isTeamLeader ||
    isAcademicSupervisor

  const canSubmitTeacherUpload =
    isTeacher ||
    isTeamLeader

  const canSubmitManagement =
    isTeamLeader ||
    isAcademicSupervisor

  const canSeeAnalytics =
    isTeamLeader ||
    isAcademicSupervisor ||
    isBranchManager ||
    isAdmin ||
    isTeacher

  const canSubmitScorecard =
    isTeacher ||
    isTeamLeader

  const canManageSchedule =
    isTeamLeader ||
    isAcademicSupervisor

  const canSeeFailedStudents =
    isTeamLeader ||
    isAcademicSupervisor ||
    isBranchManager ||
    isAdmin

  const canSubmitFailedStudent =
    isTeacher ||
    isTeamLeader

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },

    ...(canSeeTeachers
      ? [
          {
            href: "/teachers",
            label: "Teachers",
          },
        ]
      : []),

    ...(canSeeSubmissions
      ? [
          {
            href: "/submissions",
            label: "Submissions",
          },
        ]
      : []),

    ...(canSubmitTeacherUpload
      ? [
          {
            href: "/submit",
            label: "Submit",
          },
        ]
      : []),

    ...(canSubmitManagement
      ? [
          {
            href: "/management-submit",
            label: "Management Submit",
          },
        ]
      : []),

    ...(canSeeAnalytics
      ? [
          {
            href: "/analytics",
            label: "Analytics",
          },
        ]
      : []),

    {
      href: "/resources",
      label: "Resources",
    },

    {
      href: "/scorecards",
      label: "Scorecards",
    },

    ...(canSubmitScorecard
      ? [
          {
            href: "/scorecard-submit",
            label: "Submit Scorecard",
          },
        ]
      : []),

    {
      href: "/schedule",
      label: "Schedule",
    },

    ...(canManageSchedule
      ? [
          {
            href: "/schedule-management",
            label: "Schedule Management",
          },
        ]
      : []),

    ...(canSubmitFailedStudent
      ? [
          {
            href: "/failed-students-submit",
            label: "Submit Failed Student",
          },
        ]
      : []),

    ...(canSeeFailedStudents
      ? [
          {
            href: "/failed-students",
            label: "Failed Students",
          },
        ]
      : []),
  ]

  return (
    <aside className="w-72 bg-black text-white flex flex-col justify-between p-6">
      <div>
        <div className="mb-12">
          <h1 className="text-3xl font-bold">
            EZ Portal
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Teacher Management System
          </p>
        </div>

        <nav className="space-y-3">
          {links.map((link) => {
            const isActive =
              pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-5 py-4 rounded-2xl transition ${
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "hover:bg-gray-900 text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <p className="font-semibold text-lg">
          {session?.user?.name}
        </p>

        <p className="text-gray-400 text-sm capitalize mb-4">
          {role.replace(/_/g, " ")}
        </p>

        <button
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}