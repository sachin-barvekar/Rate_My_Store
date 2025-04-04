import { IListApiRequest } from '../../api/types'
import { User } from '../../contexts/types'
import { UserListParams } from './types'

export enum ACTIVE_TAB {
  ALL = 'all',
  ADMIN = 'admin',
  STORE_OWNER = 'store_owner',
  USER = 'user',
}

export const getUserPaginationQueryParams = (
  request: IListApiRequest<User>,
): UserListParams => {
  const { filters, page } = request
  const params: UserListParams = {
    size: page?.size,
    page: page?.number ? page.number - 1 : 0,
  }

  if (filters && filters.length > 0) {
    filters.forEach(({ fieldName, fieldValue }) => {
      if (
        fieldValue === null ||
        fieldValue === undefined ||
        fieldValue === '' ||
        fieldValue === 'all'
      ) {
        delete params[fieldName]
      } else {
        params[fieldName] = fieldValue
      }
    })
  }

  return params
}
