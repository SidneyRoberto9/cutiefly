import { redirect } from "next/navigation"

import NotFound from "@/components/not-found"
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
    return <NotFound />
  }

  redirect(url.originalUrl)
}
