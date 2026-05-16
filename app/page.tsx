export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      
      <h1 className="text-4xl font-bold mb-8">
        Teacher Portal Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">
            Upcoming Supervision
          </h2>

          <p>
            Tuesday - Intermediate B1
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">
            Next Training
          </h2>

          <p>
            Classroom Management Workshop
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">
            Pending Reflection
          </h2>

          <p>
            Submit reflection by Thursday
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">
            Latest Feedback
          </h2>

          <p>
            Strong classroom presence and interaction.
          </p>
        </div>

      </div>

    </main>
  )
}