import { describe, it } from "vitest"

import NotFound from "@/components/not-found"
import { render, screen } from "@testing-library/react"

describe("NotFound", () => {
  it("renderiza título e descrição", () => {
    render(<NotFound />)

    expect(screen.getByText("404")).toBeInTheDocument()
    expect(screen.getByText(/The page you're looking for/i)).toBeInTheDocument()
    expect(screen.getByRole("link")).toHaveTextContent(/get out of here/i)
  })

  it("possui alerta com data-testid", () => {
    render(<NotFound />)

    expect(screen.getByTestId("not-found-alert")).toBeInTheDocument()
  })
})
