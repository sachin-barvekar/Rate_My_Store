import { FC, useState } from 'react'
import { IFilter, IListApiRequest, Operator } from '../../../api/types'
import { Table, Toolbar } from '../../../shared'
import '../../../scss/common/list/List.scss'
import { useTableHandlers } from '../../../hooks/useTableHandlers'
import { User } from '../../../contexts/types'
import { useFetchUserListQuery } from '../userListApiSlice'
import AddEditUser from '../addEditUser/AddEditUser'
import { IAuthForm } from '../../auth/utils'
import { ACTIVE_TAB } from '../utils'

const { Column, HeaderCell, ProfileIconCell, Cell, ActionCell } = Table

const COLUMNS = [
  { key: 'name', label: 'Full Name', flexGrow: 1, minWidth: 150 },
  { key: 'email', label: 'Email', flexGrow: 1, minWidth: 150 },
  { key: 'address', label: 'Address', flexGrow: 1, minWidth: 150 },
  { key: 'role', label: 'Role', flexGrow: 0.6, minWidth: 80 },
]

const UserList: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<IAuthForm>()
  const {
    requestBody,
    onPageChange,
    onSearchChange,
    onSortColumn,
    onFilterChange,
  } = useTableHandlers<User, IListApiRequest<User>>(
    {
      page: { size: 10, number: 0 },
      filters: [],
    },
    'search',
  )

  const { data, isFetching } = useFetchUserListQuery(requestBody)
  const total = data?.totalElements || data?.content?.length || 0

  const handleAction = (action: string | undefined, rowData: IAuthForm) => {
    switch (action) {
      case '2':
        setIsEditMode(true)
        setSelectedUser(rowData)
        setIsModalOpen(true)
        break
      default:
        break
    }
  }

  const options = [
    {
      label: 'All Users',
      value: ACTIVE_TAB.ALL,
      onClick: () => handleTabChange(ACTIVE_TAB.ALL),
    },
    {
      label: 'Admin',
      value: ACTIVE_TAB.ADMIN,
      onClick: () => handleTabChange(ACTIVE_TAB.ADMIN),
    },
    {
      label: 'Store Owner',
      value: ACTIVE_TAB.STORE_OWNER,
      onClick: () => handleTabChange(ACTIVE_TAB.STORE_OWNER),
    },
    {
      label: 'User',
      value: ACTIVE_TAB.USER,
      onClick: () => handleTabChange(ACTIVE_TAB.USER),
    },
  ]
  const handleTabChange = (tab: ACTIVE_TAB) => {
    let fieldValue
    switch (tab) {
      case ACTIVE_TAB.ALL:
        fieldValue = 'all'
        break
      case ACTIVE_TAB.ADMIN:
        fieldValue = 'admin'
        break
      case ACTIVE_TAB.STORE_OWNER:
        fieldValue = 'store_owner'
        break
      case ACTIVE_TAB.USER:
        fieldValue = 'user'
        break
      default:
        fieldValue = ''
    }

    const activeFilter: IFilter<User> = {
      fieldName: 'role',
      operator: Operator.EQ,
      fieldValue: fieldValue ?? 'true',
    }

    const updatedFilters = [
      activeFilter,
      ...(requestBody.filters ?? []).filter(f => f.fieldName !== 'role'),
    ]
    onFilterChange(updatedFilters)
  }

  return (
    <div className='list'>
      <Toolbar
        options={options}
        onSearchChange={onSearchChange}
        total={total ?? 0}
        buttonName='Add User'
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
          <Column flexGrow={0.3} fixed>
            <HeaderCell>Profile</HeaderCell>
            <ProfileIconCell imgKey='profilePhoto' />
          </Column>
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
      <AddEditUser
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(undefined)
          setIsEditMode(false)
        }}
        isEditMode={isEditMode}
        userData={selectedUser}
      />
    </div>
  )
}

export default UserList
