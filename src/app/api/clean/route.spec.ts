import { NextRequest } from "next/server"

import { deleteLast7DaysUrls } from "@/lib/functions/delete-last-7-days-urls"

import { POST } from "./route"

vi.mock("@/lib/functions/delete-last-7-days-urls", () => ({
  deleteLast7DaysUrls: vi.fn(),
}))

function createRequest(authorization?: string): NextRequest {
  const headers: Record<string, string> = {}

  if (authorization) {
    headers.authorization = authorization
  }

  const req = new Request("http://localhost/api/clean", {
    method: "POST",
    headers,
  })

  return req as unknown as NextRequest
}

describe("POST /api/clean", () => {
  const mockedDelete = deleteLast7DaysUrls as unknown as ReturnType<
    typeof vi.fn
  >

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.CLEANUP_SECRET = "super-secret"
  })

  it("retorna status 200 se a exclusão for bem-sucedida", async () => {
    mockedDelete.mockResolvedValueOnce({ count: 5 })

    const response = await POST(createRequest("Bearer super-secret"))
    const body = await response.json()

    expect(mockedDelete).toHaveBeenCalled()
    expect(response.status).toBe(200)
    expect(body).toEqual({ success: true })
  })

  it("retorna 401 sem o header Authorization", async () => {
    const response = await POST(createRequest())

    expect(response.status).toBe(401)
    expect(mockedDelete).not.toHaveBeenCalled()
  })

  it("retorna 401 com segredo incorreto", async () => {
    const response = await POST(createRequest("Bearer wrong"))

    expect(response.status).toBe(401)
    expect(mockedDelete).not.toHaveBeenCalled()
  })

  it("retorna 401 se CLEANUP_SECRET não estiver configurado", async () => {
    delete process.env.CLEANUP_SECRET

    const response = await POST(createRequest("Bearer super-secret"))

    expect(response.status).toBe(401)
    expect(mockedDelete).not.toHaveBeenCalled()
  })

  it("lança erro se deleteLast7DaysUrls falhar", async () => {
    mockedDelete.mockRejectedValueOnce(new Error("DB error"))

    await expect(POST(createRequest("Bearer super-secret"))).rejects.toThrow(
      "DB error"
    )
    expect(mockedDelete).toHaveBeenCalled()
  })
})
