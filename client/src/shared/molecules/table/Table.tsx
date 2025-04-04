import { useState, useEffect, JSX } from 'react'
import { Table as RsuiteTable } from 'rsuite'
import { TableProps, RowDataType, RowKeyType } from 'rsuite-table'
import { Loader } from '../../atoms'
import {
  HeaderCell,
  Cell,
  StatusCell,
  ActionCell,
  ProfileIconCell,
  RatingCell,
} from './cells'
import TableFooter from './footer/TableFooter'
import './Table.scss'

const { Column } = RsuiteTable

export interface Pagination {
  page: number
  limit: number
}

const DEFAULT_PAGE_SIZE = 10
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table<R extends RowDataType<any>, K extends RowKeyType>(
  props: TableProps<R, K> & {
    paginated?: boolean
    pageSizeOptions?: number[]
    defaultPageSize?: number
    total?: number
    onPageChange?: (page: number, pageSize: number) => void
    maxButtons?: number
  },
): JSX.Element {
  const {
    data = [],
    children,
    loading = false,
    hover = true,
    fillHeight = true,
    onRowClick,
    paginated = false,
    pageSizeOptions,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    total = data.length,
    onPageChange,
    maxButtons = 3,
    ...rest
  } = props

  const initialPageSize =
    pageSizeOptions && pageSizeOptions.length > 0
      ? pageSizeOptions[0]
      : defaultPageSize

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const filteredData = data.filter(item => item !== null)

  const handlePageChangeInternal = (page: number) => {
    setCurrentPage(page)
    if (onPageChange) {
      onPageChange(page, pageSize)
    }
  }

  const handlePageSizeChangeInternal = (value: number | null) => {
    if (value !== null) {
      setPageSize(value)
      setCurrentPage(1)
      if (onPageChange) {
        onPageChange(1, value)
      }
    }
  }

  useEffect(() => {
    if (onPageChange) {
      onPageChange(currentPage, pageSize)
    }
    // eslint-disable-next-line
  }, [currentPage, pageSize])

  return (
    <div className='table-container'>
      <div className='table-wrapper'>
        {loading && <Loader />}
        {!loading && (
          <RsuiteTable
            loading={false}
            height={400}
            wordWrap='break-word'
            hover={hover}
            fillHeight={fillHeight}
            data={filteredData}
            onRowClick={onRowClick}
            {...rest}>
            {children}
          </RsuiteTable>
        )}
      </div>
      {paginated && (
        <TableFooter
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChangeInternal}
          onPageSizeChange={handlePageSizeChangeInternal}
          maxButtons={maxButtons}>
          {`${(currentPage - 1) * pageSize + 1}-${Math.min(
            currentPage * pageSize,
            total,
          )} of ${total}`}
        </TableFooter>
      )}
    </div>
  )
}

Table.Column = Column
Table.Cell = Cell
Table.HeaderCell = HeaderCell
Table.ActionCell = ActionCell
Table.StatusCell = StatusCell
Table.ProfileIconCell = ProfileIconCell
Table.RatingCell = RatingCell
Table.DEFAULT_PAGE_SIZE = DEFAULT_PAGE_SIZE

export default Table
