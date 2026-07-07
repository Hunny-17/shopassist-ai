const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

async function parseJsonResponse(response) {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.message || "API request failed"
    throw new Error(message)
  }

  if (payload?.success === false) {
    throw new Error(payload.message || "API returned an error")
  }

  return payload
}

export async function sendChatMessage(sessionId, message) {
  const response = await fetch(`${API_BASE}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message })
  })

  return parseJsonResponse(response)
}

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry))
      return
    }
    params.set(key, value)
  })

  const query = params.toString()
  const response = await fetch(`${API_BASE}/api/v1/products${query ? `?${query}` : ""}`)
  return parseJsonResponse(response)
}

export async function fetchProductStock(productId) {
  const response = await fetch(`${API_BASE}/api/v1/products/${productId}/stock`)
  return parseJsonResponse(response)
}
