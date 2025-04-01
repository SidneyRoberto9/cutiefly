import { deleteLast7DaysUrls } from "@/lib/functions/delete-last-7-days-urls"

import { GET } from "./route"

vi.mock("@/lib/functions/delete-last-7-days-urls", () => ({
  deleteLast7DaysUrls: vi.fn(),
}))

describe("GET /api/cleanup", () => {
  const mockedDelete = deleteLast7DaysUrls as unknown as ReturnType<
    typeof vi.fn
  >

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost"
  })

  it("retorna status 200 se a exclusão for bem-sucedida", async () => {
    mockedDelete.mockResolvedValueOnce({ count: 5 })

    const response = await GET()
    const body = await response.json()

    expect(mockedDelete).toHaveBeenCalled()
    expect(response.status).toBe(200)
    expect(body).toEqual({ success: true })
  })

  it("lança erro se deleteLast7DaysUrls falhar", async () => {
    mockedDelete.mockRejectedValueOnce(new Error("DB error"))

    await expect(GET()).rejects.toThrow("DB error")
    expect(mockedDelete).toHaveBeenCalled()
  })
})
