export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  address: string
  role: string
}

export interface ChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
