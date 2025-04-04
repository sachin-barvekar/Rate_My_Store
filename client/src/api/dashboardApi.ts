import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const dashboardApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl,
  }),
  reducerPath: 'dashboardApi',
  tagTypes: ['admin'],
  endpoints: () => ({}),
})

export default dashboardApi
