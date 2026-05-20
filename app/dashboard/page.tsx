async function getSubmissions() {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbxn4LKrL3Ja8ZfhcidQuYtZ6TrFXqjAgKrhoqD1dFlGdOcZM6L0k1RRkNuUsQ7gpCctwQ/exec",
    {
      cache: "no-store",
    }
  )

  return res.json()
}

export default async function DashboardPage() {
  const submissions = await getSubmissions()

  const totalSubmissions = submissions.length

  const observationReports = submissions.filter(
    (item: any) =>
      item["Submission Type"] ===
      "Observation Report"
  ).length

  const reflectionTasks = submissions.filter(
    (item: any) =>
      item["Submission Type"] ===
      "Reflection Task"
  ).length

  const uniqueTeachers = new Set(
    submissions.map(
      (item: any) => item["Teacher Name"]
    )
  ).size

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Total Submissions
          </h2>

          <p className="text-4xl font-bold">
            {totalSubmissions}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Observation Reports
          </h2>

          <p className="text-4xl font-bold">
            {observationReports}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Reflection Tasks
          </h2>

          <p className="text-4xl font-bold">
            {reflectionTasks}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Teachers
          </h2>

          <p className="text-4xl font-bold">
            {uniqueTeachers}
          </p>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">
          Recent Activity
        </h2>

        <div className="space-y-4">

          {submissions
            .slice()
            .reverse()
            .slice(0, 5)
            .map((item: any, index: number) => (
              <div
                key={index}
                className="border-b pb-4"
              >
                <p className="font-semibold">
                  {item["Teacher Name"]}
                </p>

                <p className="text-gray-600">
                  {item["Submission Type"]}
                </p>

                <p className="text-sm text-gray-400">
                  {new Date(
                    item["Timestamp"]
                  ).toLocaleDateString()}
                </p>
              </div>
            ))}

        </div>
      </div>
    </div>
  )
}