import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

import { createUrl } from "@/lib/functions/create-url"
import { getUrlByCode } from "@/lib/functions/get-url-by-code"

export async function POST(request: NextRequest) {
  const { url, code, visible } = await request.json()

  let shortCode = nanoid(16)

  if (code != null && code != undefined) {
    if (code.length > 16) {
      return NextResponse.json(
        { error: "Code too long, maximum 16 characters" },
        { status: 400 }
      )
    } else {
      shortCode = code
    }
  }

  const existingUrl = await getUrlByCode(shortCode)

  if (existingUrl) {
    return NextResponse.json(
      { error: "Short code already exists" },
      { status: 400 }
    )
  }

  let isPrivate = !visible

  if (visible == null || visible == undefined) {
    isPrivate = false
  }

  const shortenedUrl = await createUrl({
    url,
    shortCode,
    isPrivate,
  })

  return NextResponse.json({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortenedUrl.shortCode}`,
  })
}
