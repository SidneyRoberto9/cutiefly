import { NextRequest } from "next/server"

export function createNextRequest(body: any): NextRequest {
  const req = new Request("http://localhost/api", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })

  return req as unknown as NextRequest
}
