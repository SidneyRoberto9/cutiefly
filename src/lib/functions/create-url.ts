import { db } from "@/lib/db"

interface RequestCreateUrl {
  url: string
  shortCode: string
  isPrivate: boolean
}

export async function createUrl({
  url,
  shortCode,
  isPrivate,
}: RequestCreateUrl) {
  return db.url.create({
    data: { originalUrl: url, shortCode, isPrivate },
  })
}
