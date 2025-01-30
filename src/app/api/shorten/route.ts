import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  const { url } = await request.json()

  const shortCode = nanoid(16)

  const shortenedUrl = await db.url.create({
    data: {
      originalUrl: url,
      shortCode,
    },
  })

  return NextResponse.json({ url: shortenedUrl.shortCode })
}
