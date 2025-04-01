import { take3Urls } from "@/lib/functions/take-3-url"

import { GET } from "./route"

vi.mock("@/lib/functions/take-3-url", () => ({
  take3Urls: vi.fn(),
}))

describe("GET /api/urls", () => {
  const mockedTake3Urls = take3Urls as unknown as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("retorna lista de URLs com status 200", async () => {
    const mockData = [
      { id: "1", shortCode: "abc", originalUrl: "https://google.com" },
      { id: "2", shortCode: "def", originalUrl: "https://vitejs.dev" },
      { id: "3", shortCode: "ghi", originalUrl: "https://nextjs.org" },
    ]

    mockedTake3Urls.mockResolvedValueOnce(mockData)

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual(mockData)
    expect(mockedTake3Urls).toHaveBeenCalledTimes(1)
  })

  it("retorna lista vazia com status 200", async () => {
    mockedTake3Urls.mockResolvedValueOnce([])

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual([])
  })

  it("retorna erro 500 se take3Urls lançar erro", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})

    mockedTake3Urls.mockRejectedValueOnce(new Error("DB down"))

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({ error: "Error fetching URLs" })

    consoleErrorSpy.mockRestore()
  })
})
