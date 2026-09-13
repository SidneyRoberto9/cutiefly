import ShortenForm from "@/components/shorten-form"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

describe("ShortenForm", () => {
  const mockHandler = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
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
        ok: true,
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

  it("mostra a mensagem de erro retornada pela API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error: "Too many requests, try again in a minute",
        }),
      })
    )

    render(<ShortenForm handleUrlShortened={mockHandler} />)

    fireEvent.change(screen.getByPlaceholderText(/enter url/i), {
      target: { value: "https://example.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: /shorten/i }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Too many requests, try again in a minute"
      )
    })
    expect(mockHandler).not.toHaveBeenCalled()
  })
})
