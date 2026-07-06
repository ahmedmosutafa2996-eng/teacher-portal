"use client"

import { useEffect, useState } from "react"

const RESOURCES_API =
  "https://script.google.com/macros/s/AKfycbzs_F1r87wgAdXYvPVTCSKOopohjGr05cSSnqH-hE55lHyUmM8Pj925HtLgC3TH4oOF/exec"

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchResources() {
      const res = await fetch(RESOURCES_API)
      const data = await res.json()
      setResources(data)
    }

    fetchResources()
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Resources
      </h1>

      <p className="text-gray-500 mb-8">
        Browse teaching resources and PDF materials from the shared Drive library.
      </p>

      <input
        type="text"
        placeholder="Search resources..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-8 p-4 rounded-xl border border-gray-300"
      />

      <div className="space-y-10">
        {resources.map((category: any, index: number) => {
          const filteredFiles = category.files.filter((file: any) =>
            file.name.toLowerCase().includes(search.toLowerCase())
          )

          if (filteredFiles.length === 0) return null

          return (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow"
            >
              <h2 className="text-2xl font-bold mb-6">
                {category.category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFiles.map((file: any, fileIndex: number) => (
                  <div
                    key={fileIndex}
                    className="border rounded-xl p-5 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {file.name}
                      </p>

                      <p className="text-sm text-gray-400">
                        PDF Resource
                      </p>
                    </div>

                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
                    >
                      Open
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}