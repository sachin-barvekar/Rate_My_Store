import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from './axiosBaseQuery'
import { baseUrl } from './axiosInstance'

const dashboardApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl,
  }),
  reducerPath: 'dashboardApi',
  tagTypes: ['admin', 'store_owner'],
  endpoints: () => ({}),
})

export default dashboardApi
