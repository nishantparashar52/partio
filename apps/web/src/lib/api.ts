export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
// export const API_BASE = 'http://localhost:4000'

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed')
  return res.json()
}

export const api = {
  // Auth (passwordless)
  me: () => request('/auth/me'),
  requestOtp: (data: { email: string; name?: string }) => request('/auth/request-otp', { method: 'POST', body: JSON.stringify(data) }),
  verifyOtp: (data: { email: string; code: string }) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Parties
  listParties: (params: Record<string, any>) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined))).toString()
    return request(`/parties?${qs}`)
  },
  getParty: (id: string) => request(`/parties/${id}`),
  createParty: (payload: any) => request('/parties', { method: 'POST', body: JSON.stringify(payload) }),
  myParties: (role: 'host' | 'guest') => request(`/parties/me/list?role=${role}`),

  // Requests
  join: (partyId: string, message?: string) => request(`/parties/${partyId}/join`, { method: 'POST', body: JSON.stringify({ message }) }),
  listRequests: () => request('/requests'),
  approveRequest: (id: string) => request(`/requests/${id}/approve`, { method: 'POST' }),
  rejectRequest: (id: string) => request(`/requests/${id}/reject`, { method: 'POST' }),
}
