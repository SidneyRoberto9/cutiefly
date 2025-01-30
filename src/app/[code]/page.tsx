import { redirect } from "next/navigation"

import { db } from "@/lib/db"

interface Props {
  params: Promise<{
    code: string
  }>
}

export default async function Page({ params }: Props) {
  const { code } = await params

  const url = await db.url.findUnique({
    where: { shortCode: code },
  })

  if (!url) {
    return <div>404 - URL not found</div>
  }

  redirect(url.originalUrl)
}
