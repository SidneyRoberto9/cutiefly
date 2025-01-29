"use client"

import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ShortenForm = () => {
  const [url, setUrl] = useState<string>("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    console.log(url)
    setUrl("")
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="space-y-4">
        <Input
          className="h-12"
          type="url"
          placeholder="Ender URL to shorten"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button className="w-full p-2" type="submit">
          Shorten URL
        </Button>
      </div>
    </form>
  )
}

export default ShortenForm
