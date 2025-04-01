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

describe("Page", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  const mockedGetUrlByCode = getUrlByCode as ReturnType<typeof vi.fn>

  it("redireciona se o código for válido", async () => {
    mockedGetUrlByCode.mockResolvedValueOnce({
      id: "1",
      isPrivate: false,
      shortCode: "Uakgb_J5m9g-0JDM",
      createdAt: new Date(),
      originalUrl: "https://google.com",
    })

    await Page({ params: Promise.resolve({ code: "Uakgb_J5m9g-0JDM" }) })

    expect(redirect).toHaveBeenCalledWith("https://google.com")
  })

  it("renderiza NotFound se o código for inválido", async () => {
    mockedGetUrlByCode.mockResolvedValueOnce(null)

    const result = await Page({
      params: Promise.resolve({ code: "Uakgb_J5m9g-0JDK" }),
    })

    render(result as JSX.Element)

    expect(screen.getByTestId("not-found-alert")).toBeInTheDocument()
  })
})
