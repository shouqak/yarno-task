import axios from "axios"

// Prefer Vite-style env vars; fall back to older names, then mock API
export const BASE_URL ="https://6875177fdd06792b9c96ba28.mockapi.io"

export const api = axios.create({ baseURL: BASE_URL })

const getTotalFromHeaders = (headers, fallback) => {
  const raw = headers?.["x-total-count"] || headers?.get?.("x-total-count")
  const parsed = parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export async function listUsers(params = {}) {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "id",
    order = "asc",
  } = params
  const res = await api.get("/users", {
    params: {
      page,
      limit,
      search: search || undefined,
      sortBy,
      order,
    },
  })
  const data = Array.isArray(res.data) ? res.data : []
  return { data, total: getTotalFromHeaders(res.headers, data.length) }
}

export async function getUser(id) {
  const res = await api.get(`/users/${id}`)
  return res.data
}

export async function createUser(payload) {
  const res = await api.post(`/users`, payload)
  return res.data
}

export async function updateUser(id, payload) {
  const res = await api.put(`/users/${id}`, payload)
  return res.data
}

export async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`)
  return res.data
}

export async function listActivities(params = {}) {
  const { page = 1, limit = 10, type, userId, from, to } = params
  try {
    const res = await api.get(`/activities`, {
      params: {
        page,
        limit,
        type: type || undefined,
        userId: userId || undefined,
        // json-server style range filters; ignored by backends that don't support them
        createdAt_gte: from || undefined,
        createdAt_lte: to || undefined,
      },
    })
    const data = Array.isArray(res.data) ? res.data : []
    return { data, total: getTotalFromHeaders(res.headers, data.length) }
  } catch (err) {
    if (err?.response?.status === 404) {
      // Fallback: synthesize mock activity data when the backend endpoint is missing
      const TYPES = ["login", "create", "update", "delete"]
      const now = Date.now()
      const baseCount = 80
      let arr = Array.from({ length: baseCount }, (_, i) => {
        const t = TYPES[Math.floor(Math.random() * TYPES.length)]
        const daysAgo = Math.floor(Math.random() * 14)
        const offset = Math.floor(Math.random() * 86400000)
        const ts = new Date(now - daysAgo * 86400000 - offset).toISOString()
        const uid = userId ? Number(userId) : Math.floor(Math.random() * 25) + 1
        return { id: String(i + 1), type: t, userId: uid, createdAt: ts }
      })
      // Apply filters
      if (type)
        arr = arr.filter(
          (a) => (a.type || "").toLowerCase() === String(type).toLowerCase()
        )
      if (userId) arr = arr.filter((a) => String(a.userId) === String(userId))
      if (from) arr = arr.filter((a) => new Date(a.createdAt) >= new Date(from))
      if (to) arr = arr.filter((a) => new Date(a.createdAt) <= new Date(to))
      const total = arr.length
      const start = (page - 1) * limit
      const data = arr.slice(start, start + limit)
      return { data, total }
    }
    throw err
  }
}

export async function getAuth(id) {
  const res = await api.get(`/users/${id}`)
  return res.data
}

export async function updateAuth(id, payload) {
  const res = await api.put(`/users/${id}`, payload)
  return res.data
}
