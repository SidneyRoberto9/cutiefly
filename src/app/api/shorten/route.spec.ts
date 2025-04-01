import { createNextRequest } from "@/lib/__tests__/craete-next-request"
import { createUrl } from "@/lib/functions/create-url"
import { getUrlByCode } from "@/lib/functions/get-url-by-code"

import { POST } from "./route"

vi.mock("@/lib/functions/get-url-by-code", () => ({
  getUrlByCode: vi.fn(),
}))

vi.mock("@/lib/functions/create-url", () => ({
  createUrl: vi.fn(),
}))

vi.mock("nanoid", () => ({
  nanoid: () => "1234567890123456",
}))

describe("POST /api", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost"
  })

  const mockedGetUrlByCode = getUrlByCode as unknown as ReturnType<typeof vi.fn>
  const mockedCreateUrl = createUrl as unknown as ReturnType<typeof vi.fn>

  it("cria com código gerado automaticamente", async () => {
    mockedGetUrlByCode.mockResolvedValueOnce(null)
    mockedCreateUrl.mockResolvedValueOnce({ shortCode: "1234567890123456" })

    const req = createNextRequest({ url: "https://example.com", visible: true })
    const res = await POST(req)

    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.url).toBe("http://localhost/1234567890123456")
    expect(mockedCreateUrl).toHaveBeenCalledWith({
      url: "https://example.com",
      shortCode: "1234567890123456",
      isPrivate: false,
    })
  })

  it("cria com código customizado válido", async () => {
    mockedGetUrlByCode.mockResolvedValueOnce(null)
    mockedCreateUrl.mockResolvedValueOnce({ shortCode: "custom-code" })

    const req = createNextRequest({
      url: "https://example.com",
      code: "custom-code",
      visible: false,
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.url).toBe("http://localhost/custom-code")
    expect(mockedCreateUrl).toHaveBeenCalledWith({
      url: "https://example.com",
      shortCode: "custom-code",
      isPrivate: true,
    })
  })

  it("retorna erro se código for muito longo", async () => {
    const req = createNextRequest({
      url: "https://example.com",
      code: "this-code-is-way-too-long",
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBe("Code too long, maximum 16 characters")
  })

  it("retorna erro se shortCode já existir", async () => {
    mockedGetUrlByCode.mockResolvedValueOnce({ shortCode: "taken-code" })

    const req = createNextRequest({
      url: "https://example.com",
      code: "taken-code",
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBe("Short code already exists")
  })

  it("usa isPrivate como false se visible for null", async () => {
    mockedGetUrlByCode.mockResolvedValueOnce(null)
    mockedCreateUrl.mockResolvedValueOnce({ shortCode: "no-visible" })

    const req = createNextRequest({
      url: "https://example.com",
      visible: null,
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(mockedCreateUrl).toHaveBeenCalledWith({
      url: "https://example.com",
      shortCode: "1234567890123456",
      isPrivate: false,
    })
  })

  it("usa isPrivate como false se visible for undefined", async () => {
    mockedGetUrlByCode.mockResolvedValueOnce(null)
    mockedCreateUrl.mockResolvedValueOnce({ shortCode: "no-visible2" })

    const req = createNextRequest({
      url: "https://example.com",
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(mockedCreateUrl).toHaveBeenCalledWith({
      url: "https://example.com",
      shortCode: "1234567890123456",
      isPrivate: false,
    })
  })
})
