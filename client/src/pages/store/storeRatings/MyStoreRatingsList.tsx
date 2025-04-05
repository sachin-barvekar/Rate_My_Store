import { FC } from 'react'
import { IListApiRequest } from '../../../api/types'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import { useTableHandlers } from '../../../hooks/useTableHandlers'
import { Store } from '../types'
import { useFetchStoreRatingsByOwnerQuery } from '../storeApiSlice'

const { Column, HeaderCell, Cell, RatingCell } = Table

const MyStoreRatingList: FC = () => {
  const { requestBody, onPageChange, onSearchChange, onSortColumn } =
    useTableHandlers<Store, IListApiRequest<Store>>({
      page: { size: 10, number: 0 },
      filters: [],
    })

  const { data, isFetching } = useFetchStoreRatingsByOwnerQuery(requestBody)
  const total = data?.totalElements || data?.content?.length || 0

  const COLUMNS = [
    { key: 'username', label: 'User Name', flexGrow: 1, minWidth: 150 },
    { key: 'useremail', label: 'Email', flexGrow: 1.2, minWidth: 150 },
    { key: 'useraddress', label: 'Address', flexGrow: 1, minWidth: 150 },
    { key: 'userrole', label: 'Role', flexGrow: 0.6, minWidth: 80 },
  ]

  return (
    <div className='list'>
      <Toolbar
        options={[{ label: 'My Store Rating', value: '', onClick: () => {} }]}
        onSearchChange={onSearchChange}
        total={total}
        searchPlaceholder='Search by name, email, address...'
      />

      <div className='list__main-container'>
        <Table
          data={data?.content ?? []}
          loading={isFetching}
          onSortColumn={onSortColumn}
          paginated
          pageSizeOptions={[10, 20, 30]}
          total={total}
          defaultPageSize={data?.size ?? 10}
          onPageChange={onPageChange}>
          {COLUMNS.map((column, index) => {
            const { key, label, flexGrow, minWidth } = column
            return (
              <Column
                minWidth={minWidth ?? 100}
                flexGrow={flexGrow ?? 1}
                key={key}
                align={index === 0 ? 'left' : 'center'}
                sortable>
                <HeaderCell>{label}</HeaderCell>
                <Cell dataKey={key} tooltip />
              </Column>
            )
          })}
          <Column
            flexGrow={1}
            minWidth={150}
            key='userratingValue'
            align='center'>
            <HeaderCell>Rating</HeaderCell>
            <RatingCell ratingKey='userratingValue' />
          </Column>
        </Table>
      </div>
    </div>
  )
}

export default MyStoreRatingList
