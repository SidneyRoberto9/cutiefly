import { NextRequest, NextResponse } from "next/server"

import { deleteLast7DaysUrls } from "@/lib/functions/delete-last-7-days-urls"

export async function POST(request: NextRequest) {
  const secret = process.env.CLEANUP_SECRET

  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await deleteLast7DaysUrls()

  return NextResponse.json({ success: true })
}
