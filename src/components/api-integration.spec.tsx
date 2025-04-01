import { describe, it } from "vitest"

import ApiIntegration from "@/components/api-integration"
import { render, screen } from "@testing-library/react"

describe("ApiIntegration", () => {
  it("exibe título da seção e código de exemplo", () => {
    const { container } = render(<ApiIntegration />)

    expect(screen.getByText("Api Integration")).toBeInTheDocument()

    const codeElement = container.querySelector("code")

    expect(codeElement?.textContent).toContain("fetch")
    expect(codeElement?.textContent).toContain("/api/shorten")
  })
})
