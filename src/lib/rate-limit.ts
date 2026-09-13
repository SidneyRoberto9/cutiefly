const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const MAX_TRACKED_CLIENTS = 10_000

interface Window {
  count: number
  resetAt: number
}

// ponytail: in-memory fixed window, per serverless instance — a cold start or a
// second instance resets the counter. Swap for Upstash/Redis if abuse gets real.
const windows = new Map<string, Window>()

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  return request.headers.get("x-real-ip") ?? "unknown"
}

export function isRateLimited(key: string, now = Date.now()): boolean {
  const current = windows.get(key)

  if (!current || now >= current.resetAt) {
    if (windows.size >= MAX_TRACKED_CLIENTS) {
      windows.clear()
    }

    windows.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  current.count += 1

  return current.count > MAX_REQUESTS
}

export function resetRateLimit(): void {
  windows.clear()
}

export const RATE_LIMIT = { WINDOW_MS, MAX_REQUESTS }
