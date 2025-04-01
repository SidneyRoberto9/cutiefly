import { NextResponse } from "next/server"

import { deleteLast7DaysUrls } from "@/lib/functions/delete-last-7-days-urls"

export async function GET() {
  await deleteLast7DaysUrls()

  return NextResponse.json({ success: true })
}
