import { subDays } from "date-fns"

import { db } from "@/lib/db"

export async function deleteLast7DaysUrls() {
  const sevenDaysAgo = subDays(new Date(), 7)

  await db.url.deleteMany({
    where: { createdAt: { lte: sevenDaysAgo } },
  })
}
