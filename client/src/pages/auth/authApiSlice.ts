import authApi from '../../api/authApi'
import { AuthResponse } from '../../contexts/types'
import { LoginRequest, SignupRequest } from './types'

const authApiSlice = authApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<AuthResponse, LoginRequest>({
      query: loginData => ({
        url: '/auth/login',
        method: 'POST',
        data: loginData,
      }),
      invalidatesTags: ['auth'],
    }),

    signup: build.mutation<AuthResponse, SignupRequest>({
      query: signupData => ({
        url: '/auth/signup',
        method: 'POST',
        data: signupData,
      }),
      invalidatesTags: ['auth'],
    }),
  }),
})

export const { useLoginMutation, useSignupMutation } = authApiSlice
export default authApiSlice
