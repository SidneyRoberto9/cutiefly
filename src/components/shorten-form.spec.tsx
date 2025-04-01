import ShortenForm from "@/components/shorten-form"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

describe("ShortenForm", () => {
  const mockHandler = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({}),
      })
    )
  })

  it("preenche o input e envia o formulário", async () => {
    render(<ShortenForm handleUrlShortened={mockHandler} />)

    const input = screen.getByPlaceholderText(/enter url/i)
    const button = screen.getByRole("button", { name: /shorten/i })

    fireEvent.change(input, { target: { value: "https://example.com" } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/shorten", expect.any(Object))
      expect(mockHandler).toHaveBeenCalled()
    })
  })

  it("desativa botão enquanto carrega", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({}),
      })
    )

    render(<ShortenForm handleUrlShortened={() => {}} />)

    const input = screen.getByPlaceholderText(/enter url/i)
    fireEvent.change(input, { target: { value: "https://example.com" } })

    const button = screen.getByRole("button")
    fireEvent.click(button)

    await waitFor(() => expect(button).toBeDisabled())
  })
})
