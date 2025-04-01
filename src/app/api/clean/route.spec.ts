import { deleteLast7DaysUrls } from "@/lib/functions/delete-last-7-days-urls"

import { GET } from "./route"

vi.mock("@/lib/functions/delete-last-7-days-urls", () => ({
  deleteLast7DaysUrls: vi.fn(),
}))

describe("GET /api/cleanup", () => {
  it("chama deleteLast7DaysUrls e retorna sucesso", async () => {
    const mockedDelete = deleteLast7DaysUrls as unknown as ReturnType<
      typeof vi.fn
    >
    mockedDelete.mockResolvedValueOnce({ count: 5 })

    const response = await GET()
    const json = await response.json()

    expect(mockedDelete).toHaveBeenCalled()
    expect(response.status).toBe(200)
    expect(json).toEqual({ success: true })
  })
})
