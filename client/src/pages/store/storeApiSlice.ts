import storeApi from '../../api/storeApi'
import { IListApiRequest, IListApiResponse } from '../../api/types'
import { Store } from './types'
import { getStorePaginationQueryParams } from './utils'

const StoreApiSlice = storeApi.injectEndpoints({
  endpoints: build => ({
    fetchStoreList: build.query<
      IListApiResponse<Store>,
      IListApiRequest<Store>
    >({
      query: request => {
        const params = getStorePaginationQueryParams(request)
        return {
          url: '/stores',
          method: 'GET',
          params,
        }
      },
      providesTags: ['store'],
    }),
    createStore: build.mutation<void, Store>({
      query: signupData => ({
        url: '/store/add',
        method: 'POST',
        data: signupData,
      }),
      invalidatesTags: ['store'],
    }),
    updateStore: build.mutation<void, { id: string; store: Partial<Store> }>({
      query: ({ id, store }) => ({
        url: `/store/edit/${id}`,
        method: 'PATCH',
        data: store,
      }),
      invalidatesTags: ['store'],
    }),
  }),
})

export const {
  useFetchStoreListQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
} = StoreApiSlice
