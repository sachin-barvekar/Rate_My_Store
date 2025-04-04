import { FC, useState } from 'react'
import { IListApiRequest } from '../../../api/types'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import { useTableHandlers } from '../../../hooks/useTableHandlers'
import { Store } from '../types'
import { useFetchStoreListQuery } from '../storeApiSlice'
import AddEditStore from '../addEditStore/AddEditStore'

const { Column, HeaderCell, Cell, ActionCell } = Table

const COLUMNS = [
  { key: 'name', label: 'Store Name', flexGrow: 1, minWidth: 150 },
  { key: 'email', label: 'Email', flexGrow: 1, minWidth: 150 },
  { key: 'storeOwner', label: 'Store Owner', flexGrow: 1, minWidth: 150 },
  { key: 'address', label: 'Address', flexGrow: 1, minWidth: 150 },
]

const StoreList: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [selectedStore, setSelectedStore] = useState<Store>()
  const { requestBody, onPageChange, onSearchChange, onSortColumn } =
    useTableHandlers<Store, IListApiRequest<Store>>(
      {
        page: { size: 10, number: 0 },
        filters: [],
      },
      'search',
    )

  const { data, isFetching } = useFetchStoreListQuery(requestBody)
  const total = data?.totalElements || data?.content?.length || 0

  const handleAction = (action: string | undefined, rowData: Store) => {
    switch (action) {
      case '2':
        setIsEditMode(true)
        setSelectedStore(rowData)
        setIsModalOpen(true)
        break
      default:
        break
    }
  }

  const options = [
    {
      label: 'All Stores',
      value: '',
      onClick: () => {},
    },
  ]

  return (
    <div className='list'>
      <Toolbar
        options={options}
        onSearchChange={onSearchChange}
        total={total ?? 0}
        buttonName='Add Store'
        onButtonClick={() => setIsModalOpen(true)}
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
          <Column flexGrow={0.5} minWidth={80} key='action'>
            <HeaderCell>Action</HeaderCell>
            <ActionCell
              tooltip
              dataKey='action'
              onAction={handleAction}
              actionOptions={['Edit']}
            />
          </Column>
        </Table>
      </div>
      <AddEditStore
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedStore(undefined)
          setIsEditMode(false)
        }}
        isEditMode={isEditMode}
        storeData={selectedStore}
      />
    </div>
  )
}

export default StoreList
