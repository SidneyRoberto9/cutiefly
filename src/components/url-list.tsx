"use client"

import { CheckIcon, CopyIcon, EyeIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Url } from "@prisma/client"

const UrlList = () => {
  const [urls, setUrls] = useState<Url[]>([])
  const [copied, setCopied] = useState<boolean>(false)
  const [copyUrl, setCopyUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const shortenerUrl = (url: string) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`

  const fetchUrls = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/urls")
      const data = await response.json()
      setUrls(data)
    } catch (error) {
      console.error("Error fetching URLs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = (code: string) => {
    const fullUrl = shortenerUrl(code)
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopyUrl(code)
      setCopied(true)
      setTimeout(() => {
        setCopyUrl("")
        setCopied(false)
      }, 3000)
    })
  }

  useEffect(() => {
    fetchUrls()
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-4 h-8 w-1/4 rounded bg-gray-200" />
        <ul className="min-h-[13.375rem] space-y-2">
          {[...Array(3)].map((_, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-2 rounded-md border bg-card p-3 text-card-foreground"
            >
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="flex items-center gap-3">
                <div className="size-6 rounded bg-gray-200" />
                <span className="flex items-center gap-2">
                  <div className="size-4 rounded bg-gray-200" />
                  <div className="h-4 w-10 rounded bg-gray-200" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (urls.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-2xl font-bold">Recent URLs</h2>
        <p className="min-h-[13.375rem] text-muted-foreground">
          No URLs found.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Recent URLs</h2>
      <ul className="min-h-[13.375rem] space-y-2">
        {urls.map(({ id, shortCode, visits }) => (
          <li
            key={id}
            className="flex items-center justify-between gap-2 rounded-md border bg-card p-3 text-card-foreground"
          >
            <Link
              href={`/${shortCode}`}
              className="truncate text-blue-500"
              target="_blank"
            >
              {shortenerUrl(shortCode)}
            </Link>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted"
                onClick={() => handleCopyUrl(shortCode)}
              >
                {copied && copyUrl == shortCode ? (
                  <CheckIcon className="size-4 text-emerald-500" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
                <span className="sr-only">Copy URL</span>
              </Button>

              <span className="flex items-center gap-2 max-sm:hidden">
                <EyeIcon className="size-4" />
                {visits} views
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UrlList
