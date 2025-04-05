import authApi from '../../api/authApi'
import { IListApiResponse } from '../../api/types'
import { AuthResponse } from '../../contexts/types'
import { LoginRequest, SignupRequest, ChangePassword } from './types'

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
    changePassword: build.mutation<
      IListApiResponse<ChangePassword>,
      ChangePassword
    >({
      query: passwordData => ({
        url: '/auth/change-password',
        method: 'PATCH',
        data: passwordData,
      }),
      invalidatesTags: ['auth'],
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useChangePasswordMutation,
} = authApiSlice
export default authApiSlice
