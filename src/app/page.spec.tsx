import { render, screen } from "@testing-library/react"

import Home from "./page"

vi.mock("@/components/url-shortener-container", () => ({
  default: () => <div data-testid="url-shortener">Mocked Component</div>,
}))

describe("Home page", () => {
  it("renderiza título e descrição corretamente", () => {
    render(<Home />)

    expect(screen.getByText("Cutiefly")).toBeInTheDocument()
    expect(
      screen.getByText("Shorten your URLS and share then easily")
    ).toBeInTheDocument()
  })

  it("renderiza o componente UrlShortenerContainer", () => {
    render(<Home />)
    expect(screen.getByTestId("url-shortener")).toBeInTheDocument()
  })
})
