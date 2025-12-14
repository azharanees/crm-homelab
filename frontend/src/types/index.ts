export interface User {
  id: number
  email: string
  name: string
  role: 'rep' | 'manager'
}

export interface Lead {
  id: number
  title: string
  company: string
  contact_name: string
  email: string
  phone: string
  status: 'new_lead' | 'pending' | 'contacted' | 'qualified' | 'won' | 'lost'
  source: 'referral' | 'cold_call' | 'inbound' | 'other'
  owner: User
  address: string
  latitude: number
  longitude: number
  description: string
  created_at: string
  updated_at: string
  tasks?: Task[]
  notes?: Note[]
}

export interface Task {
  id: number
  title: string
  due_date: string
  status: 'open' | 'completed'
  user: User
  created_at: string
}

export interface Note {
  id: number
  body: string
  user: User
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
}
