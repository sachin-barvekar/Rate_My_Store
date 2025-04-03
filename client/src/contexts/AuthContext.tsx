import React, { createContext, ReactNode } from 'react'
import useAuth from '../hooks/Auth'
import { User } from './types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (
    name: string,
    email: string,
    password: string,
    address: string,
    role: string,
  ) => Promise<void>
  logout: () => Promise<void>
  token: string | null
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default AuthProvider
export { AuthContext }
