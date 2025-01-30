import { subDays } from "date-fns"
import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function GET() {
  const sevenDaysAgo = subDays(new Date(), 7)

  await db.url.deleteMany({
    where: { createdAt: { lte: sevenDaysAgo } },
  })

  return NextResponse.json({ success: true })
}
