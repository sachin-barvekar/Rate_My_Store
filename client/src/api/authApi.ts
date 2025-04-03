import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const authApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl,
  }),
  reducerPath: 'authApi',
  tagTypes: ['auth'],
  endpoints: () => ({}),
})

export default authApi
