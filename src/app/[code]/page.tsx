import { redirect } from "next/navigation"

import NotFound from "@/components/not-found"
import { getUrlByCode } from "@/lib/functions/get-url-by-code"

interface Props {
  params: Promise<{
    code: string
  }>
}

export default async function Page({ params }: Props) {
  const { code } = await params

  const url = await getUrlByCode(code)

  if (!url) {
    return <NotFound />
  }

  redirect(url.originalUrl)
}
