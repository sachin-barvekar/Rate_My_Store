import userApi from '../../api/userApi'
import { IListApiRequest, IListApiResponse } from '../../api/types'
import { User } from '../../contexts/types'
import { getUserPaginationQueryParams } from './utils'
import { SignupRequest } from '../auth/types'

const UserApiSlice = userApi.injectEndpoints({
  endpoints: build => ({
    fetchUserList: build.query<IListApiResponse<User>, IListApiRequest<User>>({
      query: request => {
        const params = getUserPaginationQueryParams(request)
        return {
          url: '/users',
          method: 'GET',
          params,
        }
      },
      providesTags: ['user'],
    }),
    signup: build.mutation<void, SignupRequest>({
      query: signupData => ({
        url: '/user/add',
        method: 'POST',
        data: signupData,
      }),
      invalidatesTags: ['user'],
    }),
    updateUser: build.mutation<void, { id: string; user: Partial<User> }>({
      query: ({ id, user }) => ({
        url: `/user/edit/${id}`,
        method: 'PATCH',
        data: user,
      }),
      invalidatesTags: ['user'],
    }),
  }),
})

export const {
  useFetchUserListQuery,
  useSignupMutation,
  useUpdateUserMutation,
} = UserApiSlice
