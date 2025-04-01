import { NextResponse } from "next/server"

import { take3Urls } from "@/lib/functions/take-3-url"

export async function GET() {
  try {
    const urls = await take3Urls()

    return NextResponse.json(urls)
  } catch (error) {
    console.error("Error fetching URLs:", error)
    return NextResponse.json({ error: "Error fetching URLs" }, { status: 500 })
  }
}
