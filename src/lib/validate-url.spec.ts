import { isSafeUrl } from "./validate-url"

describe("isSafeUrl", () => {
  it("aceita http e https", () => {
    expect(isSafeUrl("http://example.com")).toBe(true)
    expect(isSafeUrl("https://example.com/a/b?c=1")).toBe(true)
  })

  it("rejeita protocolos perigosos", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false)
    expect(isSafeUrl("data:text/html,<script>alert(1)</script>")).toBe(false)
    expect(isSafeUrl("file:///etc/passwd")).toBe(false)
  })

  it("rejeita valores não-url", () => {
    expect(isSafeUrl("not-a-url")).toBe(false)
    expect(isSafeUrl("")).toBe(false)
    expect(isSafeUrl(null)).toBe(false)
    expect(isSafeUrl(42)).toBe(false)
  })

  it("rejeita urls absurdamente longas", () => {
    expect(isSafeUrl(`https://example.com/${"a".repeat(2049)}`)).toBe(false)
  })
})
