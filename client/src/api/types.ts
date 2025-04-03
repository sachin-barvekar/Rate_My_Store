import { SortType } from 'rsuite/esm/Table'

export interface IListApiResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export interface IListApiRequest<T> {
  filters?: IFilter<T>[]
  sort?: ISortBy<T>[]
  page?: Ipage
  searchKey?: string
  id?: string | number
}

export interface IFilter<T> {
  fieldName: keyof T
  operator: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldValue: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldValues?: any[]
}

export interface ISortBy<T> {
  fieldName: keyof T
  order: SortType
}

export interface Ipage {
  size: number
  number: number
}

export enum Operator {
  EQ = 'eq',
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  IN = 'in',
  NOT_IN = 'not_in',
  LIKE = 'like',
  NOT_LIKE = 'not_like',
}
