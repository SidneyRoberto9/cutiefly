import { db } from "@/lib/db"

export async function getUrlByCode(code: string) {
  return db.url.findUnique({
    where: { shortCode: code },
  })
}
