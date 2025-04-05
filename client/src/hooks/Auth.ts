import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { notifySuccess } from '../utils'
import { User } from '../contexts/types'
import { useLoginMutation, useSignupMutation } from '../pages/auth/authApiSlice'

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

const useAuth = (): AuthContextType => {
  const hasLoggedOutRef = useRef(false)
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  )
  const [loginMutation] = useLoginMutation()
  const [signupMutation] = useSignupMutation()

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await loginMutation({ email, password }).unwrap()

      if (res && res.user && res.token) {
        const { user, token } = res
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        setUser(user)
        setToken(token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        notifySuccess('Login successful.')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Login Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
    address: string,
    role: string,
  ) => {
    setLoading(true)
    try {
      const res = await signupMutation({
        name,
        email,
        password,
        address,
        role,
      }).unwrap()

      if (res) {
        notifySuccess('Signup successful! You can now log in.')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Signup Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(async () => {
    if (hasLoggedOutRef.current) return
    hasLoggedOutRef.current = true

    try {
      localStorage.clear()
      setUser(null)
      setToken(null)
      setLoading(false)
      delete axios.defaults.headers.common['Authorization']
      notifySuccess('Logout successful.')
    } catch (error) {
      console.error('Logout failed. Please try again.', error)
    }
  }, [])

  useEffect(() => {
    if (user) {
      hasLoggedOutRef.current = false
    }
  }, [user])

  return {
    user,
    loading,
    login,
    signup,
    logout,
    token,
    isLoggedIn: !!token,
  }
}

export default useAuth
