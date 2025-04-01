import UrlList from "@/components/url-list"
import { render, screen, waitFor } from "@testing-library/react"

const mockUrls = [
  {
    id: "1",
    shortCode: "1234567890123456",
    createdAt: new Date(Date.now() - 1000 * 60),
  },
]

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal("fetch", vi.fn())
  vi.stubGlobal("navigator", {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

describe("UrlList", () => {
  it("exibe skeleton de carregamento inicialmente", async () => {
    const neverResolving = new Promise(() => {})

    ;(fetch as any).mockReturnValueOnce(neverResolving)

    const { container } = render(<UrlList />)

    const skeleton = container.querySelector(".animate-pulse")
    expect(skeleton).toBeInTheDocument()

    const skeletonItems = container.querySelectorAll("li")
    expect(skeletonItems.length).toBe(3)
  })

  it("exibe mensagem de vazio se não houver urls", async () => {
    ;(fetch as any).mockResolvedValueOnce({
      json: async () => [],
    })

    render(<UrlList />)

    await waitFor(() =>
      expect(screen.getByText("No URLs found.")).toBeInTheDocument()
    )
  })

  it("renderiza urls com botão de copiar", async () => {
    ;(fetch as any).mockResolvedValueOnce({
      json: async () => mockUrls,
    })

    render(<UrlList />)

    await waitFor(() =>
      expect(screen.getByText(/1234567890123456/)).toBeInTheDocument()
    )

    const copyButton = screen.getByRole("button", { name: /copy url/i })
    expect(copyButton).toBeInTheDocument()
  })
})
