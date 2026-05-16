import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex gap-6 p-4 border-b">
      <Link href="/">Dashboard</Link>
      <Link href="/feedback">Feedback</Link>
      <Link href="/schedule">Schedule</Link>
      <Link href="/resources">Resources</Link>
    </nav>
  )
}