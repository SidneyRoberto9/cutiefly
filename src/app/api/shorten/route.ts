import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

import { createUrl } from "@/lib/functions/create-url"
import { getUrlByCode } from "@/lib/functions/get-url-by-code"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"
import { isSafeUrl } from "@/lib/validate-url"

const CODE_PATTERN = /^[A-Za-z0-9_-]+$/

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { error: "Too many requests, try again in a minute" },
      { status: 429 }
    )
  }

  const { url, code, visible } = await request.json()

  if (!isSafeUrl(url)) {
    return NextResponse.json(
      { error: "Invalid url, only http and https are allowed" },
      { status: 400 }
    )
  }

  let shortCode = nanoid(16)

  if (code != null && code != undefined) {
    if (code.length > 16) {
      return NextResponse.json(
        { error: "Code too long, maximum 16 characters" },
        { status: 400 }
      )
    }

    if (typeof code !== "string" || !CODE_PATTERN.test(code)) {
      return NextResponse.json(
        { error: "Invalid code, use letters, numbers, hyphen or underscore" },
        { status: 400 }
      )
    }

    shortCode = code
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
