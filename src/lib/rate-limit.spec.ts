import {
  RATE_LIMIT,
  getClientIp,
  isRateLimited,
  resetRateLimit,
} from "./rate-limit"

describe("rate-limit", () => {
  beforeEach(() => {
    resetRateLimit()
  })

  it("libera até o limite e bloqueia depois", () => {
    for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i++) {
      expect(isRateLimited("1.1.1.1")).toBe(false)
    }

    expect(isRateLimited("1.1.1.1")).toBe(true)
  })

  it("conta cada cliente separadamente", () => {
    for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS + 1; i++) {
      isRateLimited("1.1.1.1")
    }

    expect(isRateLimited("2.2.2.2")).toBe(false)
  })

  it("reabre a janela após expirar", () => {
    const start = Date.now()

    for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS + 1; i++) {
      isRateLimited("1.1.1.1", start)
    }

    expect(isRateLimited("1.1.1.1", start + RATE_LIMIT.WINDOW_MS)).toBe(false)
  })

  it("usa o primeiro ip de x-forwarded-for", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "9.9.9.9, 10.0.0.1" },
    })

    expect(getClientIp(request)).toBe("9.9.9.9")
  })

  it("retorna unknown sem headers de ip", () => {
    expect(getClientIp(new Request("http://localhost"))).toBe("unknown")
  })
})
