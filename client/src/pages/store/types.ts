export interface Store {
  _id?: string
  name: string
  email: string
  address: string
  rating?: Record<string, number>
  storeOwner: string
  search?: string
  storeOwnerId?: string
}

export interface StoreListParams {
  size?: number
  page?: number
  [key: string]: string | number | undefined
}
