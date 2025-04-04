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
  }),
})

export const { useAdminDashboardCountQuery } = dashboardApiSlice
