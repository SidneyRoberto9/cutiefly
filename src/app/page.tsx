import UrlShortenerContainer from "@/components/url-shortener-container"

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 py-12 max-sm:px-4 md:py-24">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Cutiefly</h1>
        <p className="md:text-lg">Shorten your URLS and share then easily</p>
      </div>

      <UrlShortenerContainer />
    </main>
  )
}
