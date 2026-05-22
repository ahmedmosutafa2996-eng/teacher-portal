import { notFound } from "next/navigation"

const UPLOADS_API =
  "https://script.google.com/macros/s/AKfycbwjbCWb2CbwJVlsxdxs2fLlZ7Nag3stJfVEKS9WWVkhp7if1ZfeASXoHmfJ6YPOAEnPDw/exec"

function formatName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
}

function getStatusColor(status: string) {
  switch (status) {
    case "Reviewed":
      return "bg-blue-100 text-blue-700"

    case "Signed":
      return "bg-green-100 text-green-700"

    case "Published":
      return "bg-purple-100 text-purple-700"

    default:
      return "bg-yellow-100 text-yellow-700"
  }
}

async function getData() {
  const res = await fetch(UPLOADS_API, {
    cache: "no-store",
  })

  return res.json()
}

export default async function TeacherPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const data = await getData()

  const teacherUploads =
    data.teacherUploads || []

  const managementReports =
    data.managementReports || []

  const combined = [
    ...teacherUploads.map((item: any) => ({
      ...item,
      source: "Teacher Upload",
      feedback: item["Notes"],
      observer: "Teacher",
      status: "Pending",
    })),

    ...managementReports.map((item: any) => ({
      ...item,
      source: "Management Report",
      feedback: item["Feedback"],
      observer: item["Observer"],
      status:
        item["Status"] || "Published",
    })),
  ]

  const teacherRecords =
    combined.filter((item: any) => {

      const teacherSlug =
        formatName(
          item["Teacher Name"] || ""
        )

      return teacherSlug === name
    })

  if (teacherRecords.length === 0) {
    notFound()
  }

  const teacherName =
    teacherRecords[0]["Teacher Name"]

  return (
    <div>

      <div className="mb-10">

        <h1 className="text-4xl font-bold mb-2">
          {teacherName}
        </h1>

        <p className="text-gray-500">
          Teacher development portfolio
        </p>

      </div>

      <div className="space-y-8">

        {teacherRecords
          .slice()
          .reverse()
          .map(
            (
              item: any,
              index: number
            ) => {

              const fileLink =
                item["File URL"]

              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow"
                >

                  <div className="flex justify-between items-start mb-6">

                    <div>

                      <h2 className="text-2xl font-bold">
                        {
                          item[
                            "Submission Type"
                          ]
                        }
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Source:
                        {" "}
                        {item.source}
                      </p>

                      <p className="text-gray-500 mt-1">
                        Observer:
                        {" "}
                        {item.observer}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-sm text-gray-400 mb-2">
                        {new Date(
                          item[
                            "Timestamp"
                          ]
                        ).toLocaleDateString()}
                      </p>

                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </div>

                  </div>

                  {item.feedback && (
                    <div className="mb-6">

                      <h3 className="font-semibold mb-3 text-lg">
                        Feedback / Notes
                      </h3>

                      <p className="text-gray-700 whitespace-pre-line leading-7">
                        {item.feedback}
                      </p>

                    </div>
                  )}

                  {fileLink && (
                    <a
                      href={fileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800"
                    >
                      Open File
                    </a>
                  )}

                </div>
              )
            }
          )}

      </div>

    </div>
  )
}