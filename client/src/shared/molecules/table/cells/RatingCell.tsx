import React from 'react'
import { Cell } from 'rsuite-table'

type RatingCellProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData?: { [key: string]: any }
  ratingKey?: string
}

const RatingCell: React.FC<RatingCellProps> = ({
  rowData = {},
  ratingKey = 'rating',
  ...props
}) => {
  const rating = rowData[ratingKey] || 0

  return (
    <Cell {...props} className='rating-cell'>
      {Array.from({ length: rating }).map((_, i) => (
        <span key={i}>⭐</span>
      ))}
    </Cell>
  )
}

export default RatingCell
