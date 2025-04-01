import { db } from "@/lib/db"

export async function take3Urls() {
  return db.url.findMany({
    where: { isPrivate: false },
    orderBy: { createdAt: "desc" },
    take: 3,
  })
}
