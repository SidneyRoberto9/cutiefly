"use client"

import { useState } from "react"

import ApiIntegration from "@/components/api-integration"
import ShortenForm from "@/components/shorten-form"
import UrlList from "@/components/url-list"

const UrlShortenerContainer = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUrlShortened = () => setRefreshKey((prev) => prev + 1)

  return (
    <div className="space-y-8">
      <ShortenForm handleUrlShortened={handleUrlShortened} />
      <UrlList key={refreshKey} />
      <ApiIntegration />
    </div>
  )
}

export default UrlShortenerContainer
