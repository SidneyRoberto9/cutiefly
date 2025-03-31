import { describe, expect, it, vi } from "vitest"

import { render, screen } from "@testing-library/react"

import Home from "./page"

vi.mock("@/components/url-shortener-container", () => ({
  default: () => <div data-testid="url-shortener">Mocked Component</div>,
}))

describe("Default Page", () => {
  it("renders the title and description", () => {
    render(<Home />)

    expect(screen.getByText("Cutiefly")).toBeInTheDocument()
    expect(
      screen.getByText("Shorten your URLS and share then easily")
    ).toBeInTheDocument()
    expect(screen.getByTestId("url-shortener")).toBeInTheDocument()
  })
})
