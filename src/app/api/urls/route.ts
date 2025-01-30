import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function GET() {
  try {
    const urls = await db.url.findMany({
      where: { isPrivate: false },
      orderBy: { createdAt: "desc" },
      take: 3,
    })

    return NextResponse.json(urls)
  } catch (error) {
    console.error("Error fetching URLs:", error)
    return NextResponse.json({ error: "Error fetching URLs" }, { status: 500 })
  }
}
