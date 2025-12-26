import { useCallback,useEffect, useState } from "react"

export default function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(null)

  const API_KEY = import.meta.env.VITE_NASA_API_KEY

  function getRandomDate() {
  const start = new Date(1995, 5, 16)
  const end = new Date()
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
  return date.toISOString().split("T")[0]
}

const fetchAPOD = useCallback(async (retries = 0) => {
  try {
    setLoading(true)
    setError(null)
    setTitle(null)
    setDate(null)

    const randomDate = getRandomDate()

    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${randomDate}`
    )

    const data = await res.json()

    if (data.media_type !== "image") {
      if (retries < 3) {
        return fetchAPOD(retries + 1)
      }
      throw new Error("Too many non-image APODs")
    }

    setImageUrl(data.url)
    setTitle(data.title)
    setDate(data.date)

  } catch {
    setError("Failed to fetch image. Please try again later.")
  } finally {
    setLoading(false)
  }
}, [API_KEY])

  useEffect(() => {
    console.log("API KEY:", import.meta.env.VITE_NASA_API_KEY)
    fetchAPOD()
  }, [fetchAPOD])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6 text-white px-4">
      <h1 className="text-3xl font-bold">NASA Astronomy Picture of the Day but randomized.</h1>
      {/* LOADING */}
      {loading && (
        <p className="animate-pulse text-lg tracking-wide">
          Loading APOD...
        </p>
      )}

      {/* ERROR */}
      {error && <p className="text-red-500">{error}</p>}

      {/* IMAGE */}
      {imageUrl && !loading && (
    <div className="flex flex-col items-center gap-2 text-center">
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-sm text-gray-400">{date}</p>

    <img
      src={imageUrl}
      alt={title ?? "NASA APOD"}
      className="max-w-md w-full rounded-xl shadow-lg mt-3"
    />
  </div>
)}


      {/* BUTTON */}
  <button
  onClick={() => fetchAPOD()}
  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg">
  Fetch Image
  </button>

    </div>
  )
}
