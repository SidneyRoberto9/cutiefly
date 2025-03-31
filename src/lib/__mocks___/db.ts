import { beforeEach } from "vitest"
import { mockDeep, mockReset } from "vitest-mock-extended"

import { PrismaClient } from "@prisma/client"

beforeEach(() => {
  mockReset(db)
})

const db = mockDeep<PrismaClient>()
export default db
