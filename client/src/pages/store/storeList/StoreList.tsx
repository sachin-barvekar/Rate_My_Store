import { FC, useState } from 'react'
import { IListApiRequest } from '../../../api/types'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import { useTableHandlers } from '../../../hooks/useTableHandlers'
import { Store } from '../types'
import { useFetchStoreListQuery } from '../storeApiSlice'
import AddEditStore from '../addEditStore/AddEditStore'
import useAuth from '../../../hooks/Auth'
import AddEditRating from '../addEditRating/AddEditRating'

const { Column, HeaderCell, Cell, ActionCell, RatingCell } = Table

const StoreList: FC = () => {
  const { user } = useAuth()
  const role = user?.role
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false)
  const [selectedRatingData, setSelectedRatingData] = useState<Store>()
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
  const COLUMNS = [
    { key: 'name', label: 'Store Name', flexGrow: 1, minWidth: 150 },
    { key: 'email', label: 'Email', flexGrow: 1.2, minWidth: 150 },
    ...(role !== 'user'
      ? [
          {
            key: 'storeOwner',
            label: 'Store Owner',
            flexGrow: 1.3,
            minWidth: 150,
          },
        ]
      : []),
    { key: 'address', label: 'Address', flexGrow: 1, minWidth: 150 },
  ]
  const { data, isFetching } = useFetchStoreListQuery(requestBody)
  const total = data?.totalElements || data?.content?.length || 0
  const userId = user?._id

  const formattedData =
    data?.content?.map(store => {
      const ratings: { userId: string; value: number }[] = Array.isArray(
        store.rating,
      )
        ? store.rating
        : Object.entries(store.rating || {}).map(([userId, value]) => ({
            userId,
            value,
          }))
      const totalRatings = ratings.length
      const overallRating =
        totalRatings > 0
          ? ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings
          : 0

      return {
        ...store,
        overallRating: overallRating.toFixed(1),
        myRating: ratings.find(r => r.userId === userId)?.value || 0,
      }
    }) || []

  const handleAction = (action: string | undefined, rowData: Store) => {
    switch (action) {
      case '2':
        setIsEditMode(true)
        setSelectedStore(rowData)
        setIsModalOpen(true)
        break
      case '4':
        setIsRatingModalOpen(true)
        setSelectedRatingData(rowData)
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
        buttonName={role === 'admin' ? 'Add Store' : undefined}
        onButtonClick={() => role === 'admin' && setIsModalOpen(true)}
        searchPlaceholder='Search by name, email, address...'
      />

      <div className='list__main-container'>
        <Table
          data={formattedData ?? []}
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
            key='overallRating'
            align='center'>
            <HeaderCell>Overall Rating</HeaderCell>
            <RatingCell ratingKey='overallRating' />
          </Column>
          {role === 'user' && (
            <Column flexGrow={1} minWidth={150} key='myRating' align='center'>
              <HeaderCell>My Rating</HeaderCell>
              <RatingCell ratingKey='myRating' />
            </Column>
          )}
          <Column flexGrow={0.5} minWidth={80} key='action'>
            <HeaderCell>Action</HeaderCell>
            <ActionCell
              tooltip
              dataKey='action'
              onAction={handleAction}
              actionOptions={role === 'admin' ? ['Edit'] : ['Update Rating']}
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
      <AddEditRating
        isOpen={isRatingModalOpen}
        ratingData={selectedRatingData}
        onClose={() => {
          setIsRatingModalOpen(false)
          setSelectedRatingData(undefined)
        }}
      />
    </div>
  )
}

export default StoreList
