import { AuthResponse, User } from '../types'

// Use relative path in development (Vite proxy handles it), or use env var if set
const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

interface RequestOptions extends RequestInit {
  token?: string
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options
  const storedToken = token || localStorage.getItem('auth_token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user')
    window.location.href = '/login'
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || error.errors?.[0] || 'API error')
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json()
}

export const authApi = {
  register: (email: string, password: string, name: string, role: string) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ user: { email, password, name, role } }),
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch<User>('/auth/me'),
}

export const leadsApi = {
  list: (filters?: {
    status?: string
    source?: string
    q?: string
  }) => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.source) params.append('source', filters.source)
    if (filters?.q) params.append('q', filters.q)

    return apiFetch<{ data: any[] }>(`/leads?${params.toString()}`)
  },

  get: (id: number) => apiFetch(`/leads/${id}`),

  create: (lead: Partial<any>) =>
    apiFetch(`/leads`, {
      method: 'POST',
      body: JSON.stringify({ lead }),
    }),

  update: (id: number, lead: Partial<any>) =>
    apiFetch(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ lead }),
    }),

  delete: (id: number) =>
    apiFetch(`/leads/${id}`, { method: 'DELETE' }),
}

export const tasksApi = {
  list: (leadId: number) =>
    apiFetch(`/leads/${leadId}/tasks`),

  create: (leadId: number, task: Partial<any>) =>
    apiFetch(`/leads/${leadId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ task }),
    }),

  update: (id: number, task: Partial<any>) =>
    apiFetch(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ task }),
    }),

  delete: (id: number) =>
    apiFetch(`/tasks/${id}`, { method: 'DELETE' }),
}

export const notesApi = {
  list: (leadId: number) =>
    apiFetch(`/leads/${leadId}/notes`),

  create: (leadId: number, note: Partial<any>) =>
    apiFetch(`/leads/${leadId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),

  delete: (id: number) =>
    apiFetch(`/notes/${id}`, { method: 'DELETE' }),
}
