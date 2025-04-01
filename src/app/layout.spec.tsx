import RootLayout from "@/app/layout"
import { render, screen } from "@testing-library/react"

vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "font-inter", variable: "--font-inter" }),
}))

describe("Default Layout", () => {
  it("renders children correctly", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})

    render(
      <RootLayout>
        <span data-testid="child">Teste</span>
      </RootLayout>
    )

    expect(screen.getByTestId("child")).toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })
})
