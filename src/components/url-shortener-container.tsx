"use client"
import { useState } from "react"

import ShortenForm from "@/components/shorten-form"
import UrlList from "@/components/url-list"

const UrlShortenerContainer = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUrlShortened = () => setRefreshKey((prev) => prev + 1)

  return (
    <div>
      <ShortenForm handleUrlShortened={handleUrlShortened} />
      <UrlList key={refreshKey} />
    </div>
  )
}

export default UrlShortenerContainer
