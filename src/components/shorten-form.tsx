"use client"

import { Loader2Icon } from "lucide-react"
import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ShortenFormProps {
  handleUrlShortened: () => void
}

const ShortenForm = ({ handleUrlShortened }: ShortenFormProps) => {
  const [url, setUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      await response.json()
      setUrl("")
      handleUrlShortened()
    } catch (error) {
      console.error("Error shortening URL:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="space-y-4">
        <Input
          className="h-12"
          type="url"
          placeholder="Enter URL to shorten"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button className="w-full p-2" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2Icon className="mr-2 animate-spin" />
          ) : (
            "Shorten"
          )}
        </Button>
        <span className="text-xs font-light">
          *Shortened links expire after 7 days. Be sure to save them in time!
        </span>
      </div>
    </form>
  )
}

export default ShortenForm
