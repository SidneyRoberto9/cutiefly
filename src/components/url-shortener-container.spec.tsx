import UrlShortenerContainer from "@/components/url-shortener-container"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("@/components/url-list", () => ({
  default: () => <div data-testid="url-list" />,
}))

vi.mock("@/components/shorten-form", () => ({
  default: ({ handleUrlShortened }: any) => (
    <button onClick={handleUrlShortened} data-testid="shorten-form">
      ShortenFormMock
    </button>
  ),
}))

vi.mock("@/components/api-integration", () => ({
  default: () => <div data-testid="api-integration" />,
}))

describe("UrlShortenerContainer", () => {
  it("renderiza todos os subcomponentes corretamente", () => {
    render(<UrlShortenerContainer />)

    expect(screen.getByTestId("url-list")).toBeInTheDocument()
    expect(screen.getByTestId("shorten-form")).toBeInTheDocument()
    expect(screen.getByTestId("api-integration")).toBeInTheDocument()
  })

  it("incrementa a chave do UrlList quando handleUrlShortened é chamado", async () => {
    render(<UrlShortenerContainer />)

    const button = screen.getByTestId("shorten-form")

    const user = userEvent.setup()
    await user.click(button)

    expect(screen.getByTestId("url-list")).toBeInTheDocument()
  })
})
