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
  const [error, setError] = useState<string>("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "Could not shorten this URL")
        return
      }

      setUrl("")
      handleUrlShortened()
    } catch (err) {
      console.error("Error shortening URL:", err)
      setError("Could not shorten this URL")
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
        {error && (
          <span role="alert" className="text-xs text-red-500">
            {error}
          </span>
        )}
        <span className="text-xs font-light">
          *Shortened links expire after 7 days. Be sure to save them in time!
        </span>
      </div>
    </form>
  )
}

export default ShortenForm
