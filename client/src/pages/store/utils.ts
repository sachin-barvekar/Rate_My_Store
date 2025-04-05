import * as Yup from 'yup'
import { IListApiRequest } from '../../api/types'
import { Store, StoreListParams } from './types'

export enum STORE_FORM_FIELDS {
  NAME = 'name',
  EMAIL = 'email',
  ADDRESS = 'address',
  STORE_OWNER = 'storeOwner',
  STORE_RATING = 'rating',
}

export interface IStoreForm {
  [STORE_FORM_FIELDS.NAME]: string
  [STORE_FORM_FIELDS.EMAIL]: string
  [STORE_FORM_FIELDS.ADDRESS]: string
  [STORE_FORM_FIELDS.STORE_OWNER]: string
  [STORE_FORM_FIELDS.STORE_RATING]: Record<string, number> | undefined | number
}

export const getInitialStoreFormValueFromResponse = (
  store: Store,
): IStoreForm => ({
  [STORE_FORM_FIELDS.NAME]: store?.name ?? '',
  [STORE_FORM_FIELDS.EMAIL]: store?.email ?? '',
  [STORE_FORM_FIELDS.ADDRESS]: store?.address ?? '',
  [STORE_FORM_FIELDS.STORE_OWNER]: store?.storeOwnerId ?? '',
  [STORE_FORM_FIELDS.STORE_RATING]: store?.myRating ?? 0,
})

export const defaultStoreFormValues: IStoreForm = {
  [STORE_FORM_FIELDS.NAME]: '',
  [STORE_FORM_FIELDS.EMAIL]: '',
  [STORE_FORM_FIELDS.ADDRESS]: '',
  [STORE_FORM_FIELDS.STORE_OWNER]: '',
  [STORE_FORM_FIELDS.STORE_RATING]: {}, // Ensure it's an object
}

export const storeValidationSchema = () => {
  return Yup.object().shape({
    [STORE_FORM_FIELDS.NAME]: Yup.string()
      .required('Store Name is required')
      .min(3, 'Store Name must be at least 3 characters')
      .max(100, 'Store Name cannot exceed 100 characters'),

    [STORE_FORM_FIELDS.EMAIL]: Yup.string()
      .required('Store Email is required')
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'),

    [STORE_FORM_FIELDS.ADDRESS]: Yup.string()
      .required('Store Address is required')
      .max(400, 'Address cannot exceed 400 characters'),

    [STORE_FORM_FIELDS.STORE_OWNER]: Yup.string().required(
      'Store Owner is required',
    ),
  })
}

export const getStorePaginationQueryParams = (
  request: IListApiRequest<Store>,
): StoreListParams => {
  const { filters, page } = request
  const params: StoreListParams = {
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
