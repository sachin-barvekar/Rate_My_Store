export interface User {
  _id?: string
  name: string
  email: string
  address: string
  role: string
}

export interface AuthResponse {
  token: string
  user: User
}
