"use client"

import { useEffect, useState } from "react"

const API_URL =
  "https://script.google.com/macros/s/AKfycbz4Qr4NQjfIHEJEqcwOtoQ6OvdT4kRLYbXKwubJ3AGwLa1g5VgFvwMi3kfDj6UetPmT/exec"

export default function ScorecardsPage() {
  const [scorecards, setScorecards] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(API_URL)
      const data = await res.json()

      setScorecards(data.scorecards || [])
    }

    fetchData()
  }, [])

  const filtered = scorecards.filter(
    (card) =>
      card.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Scorecards
      </h1>

      <p className="text-gray-500 mb-8">
        Download generated student scorecards.
      </p>

      <input
        type="text"
        placeholder="Search scorecards..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full p-4 border rounded-xl mb-8"
      />

      <div className="space-y-4">
        {filtered.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">
                {card.name}
              </h2>
            </div>

            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-4 py-2 rounded-xl"
            >
              Open
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}