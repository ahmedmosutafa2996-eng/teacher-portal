async function getSubmissions() {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbxn4LKrL3Ja8ZfhcidQuYtZ6TrFXqjAgKrhoqD1dFlGdOcZM6L0k1RRkNuUsQ7gpCctwQ/exec",
    {
      cache: "no-store",
    }
  )

  return res.json()
}

function fixDriveLink(url: string) {
  if (!url) return ""

  const match = url.match(/id=([^&]+)/)

  if (match) {
    const fileId = match[1]
    return `https://drive.google.com/file/d/${fileId}/view`
  }

  return url
}

export default async function TeacherPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const submissions = await getSubmissions()

  const teacherName =
    decodeURIComponent(name)

  const teacherSubmissions =
    submissions.filter((item: any) => {
      const slug = item[
        "Teacher Name"
      ]
        ?.toLowerCase()
        .replace(/\s+/g, "-")

      return slug ===
        teacherName.toLowerCase()
    })

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 capitalize">
        {teacherName.replace(/-/g, " ")}
      </h1>

      <div className="space-y-8">

        {teacherSubmissions.map(
          (item: any, index: number) => {
            const rawLink =
              item[
                "Upload PDF Report \\ Reflection Task "
              ]

            const fixedLink =
              fixDriveLink(rawLink)

            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow"
              >
                <div className="flex justify-between mb-4">

                  <div>
                    <p className="font-semibold">
                      {item["Submission Type"]}
                    </p>

                    <p className="text-gray-500">
                      Observer:
                      {" "}
                      {item["Observer"]}
                    </p>
                  </div>

                  <p className="text-sm text-gray-400">
                    {new Date(
                      item["Timestamp"]
                    ).toLocaleDateString()}
                  </p>

                </div>

                <p className="whitespace-pre-line text-gray-700 mb-6">
                  {item["Feedback"]}
                </p>

                <a
                  href={fixedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white px-5 py-3 rounded-xl"
                >
                  Open PDF / Reflection
                </a>

              </div>
            )
          }
        )}

      </div>
    </div>
  )
}