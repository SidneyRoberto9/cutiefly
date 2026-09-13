const ALLOWED_PROTOCOLS = ["http:", "https:"]

export function isSafeUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) {
    return false
  }

  try {
    return ALLOWED_PROTOCOLS.includes(new URL(value).protocol)
  } catch {
    return false
  }
}
