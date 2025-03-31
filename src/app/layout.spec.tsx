import RootLayout from "@/app/layout"
import { render, screen } from "@testing-library/react"

vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "font-inter", variable: "--font-inter" }),
}))

describe("Default Layout", () => {
  it("renders children correctly", () => {
    render(
      <RootLayout>
        <div data-testid="child">Teste</div>
      </RootLayout>
    )

    expect(screen.getByTestId("child")).toBeInTheDocument()
  })
})
