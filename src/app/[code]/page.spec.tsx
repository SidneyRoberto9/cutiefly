import { redirect } from "next/navigation"
import { JSX } from "react"

import Page from "@/app/[code]/page"
import { getUrlByCode } from "@/lib/functions/get-url-by-code"
import { render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}))

vi.mock("@/lib/functions/get-url-by-code", () => ({
  getUrlByCode: vi.fn(),
}))

describe("Page [code]", () => {
  const mockedGet = getUrlByCode as unknown as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redireciona se encontrar URL correspondente", async () => {
    mockedGet.mockResolvedValueOnce({
      id: "1",
      isPrivate: false,
      shortCode: "Uakgb_J5m9g-0JDM",
      createdAt: new Date(),
      originalUrl: "https://example.com",
    })

    await Page({ params: Promise.resolve({ code: "Uakgb_J5m9g-0JDM" }) })

    expect(redirect).toHaveBeenCalledWith("https://example.com")
  })

  it("renderiza NotFound se código não for encontrado", async () => {
    mockedGet.mockResolvedValueOnce(null)

    const result = await Page({ params: Promise.resolve({ code: "notfound" }) })
    render(result as JSX.Element)

    expect(screen.getByTestId("not-found-alert")).toBeInTheDocument()
  })
})
