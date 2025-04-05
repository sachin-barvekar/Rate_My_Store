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
    updateStore: build.mutation<
      IListApiResponse<Store>,
      { id: string; store: Partial<Store> }
    >({
      query: ({ id, store }) => ({
        url: `/store/edit/${id}`,
        method: 'PATCH',
        data: store,
      }),
      invalidatesTags: ['store'],
    }),
    updateStoreRating: build.mutation<
      void,
      { id: string; store: Partial<Store> }
    >({
      query: ({ id, store }) => ({
        url: `/stores/${id}/rating`,
        method: 'PATCH',
        data: store,
      }),
      invalidatesTags: ['store'],
    }),
    fetchStoreRatingsByOwner: build.query<
      IListApiResponse<Store>,
      IListApiRequest<Store>
    >({
      query: request => {
        const params = getStorePaginationQueryParams(request)
        return {
          url: '/store/my-store-ratings',
          method: 'GET',
          params,
        }
      },
      providesTags: ['store'],
    }),
  }),
})

export const {
  useFetchStoreListQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useUpdateStoreRatingMutation,
  useFetchStoreRatingsByOwnerQuery,
} = StoreApiSlice
