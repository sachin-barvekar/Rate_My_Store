import dashboardApi from '../../api/dashboardApi'

const dashboardApiSlice = dashboardApi.injectEndpoints({
  endpoints: build => ({
    adminDashboardCount: build.query<
      { totalUsers: number; totalStore: number; totalSubmittedRatings: number },
      void
    >({
      query: () => ({
        url: '/dashboard/admin',
        method: 'GET',
      }),
      providesTags: ['admin'],
    }),
    storeDashboardCount: build.query<
      {
        totalRatings: number
        averageRating: number
        storeId: number
        storeName: string
      },
      void
    >({
      query: () => ({
        url: '/dashboard/store_owner',
        method: 'GET',
      }),
      providesTags: ['store_owner'],
    }),
  }),
})

export const { useAdminDashboardCountQuery, useStoreDashboardCountQuery } =
  dashboardApiSlice
