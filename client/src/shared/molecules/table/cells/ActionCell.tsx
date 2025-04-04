import React from 'react'
import { Cell } from 'rsuite-table'
import EditIcon from '@rsuite/icons/Edit'
import TrashIcon from '@rsuite/icons/Trash'
import VisibleIcon from '@rsuite/icons/Visible'
import { Whisper, Tooltip } from 'rsuite'
import './ActionCell.scss'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData?: any
  dataKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAction?: (eventKey: string | undefined, rowData: any) => void
  actionOptions?: string[]
  tooltip?: boolean
}

const defaultOptions = [
  { label: 'View', eventKey: '1', icon: <VisibleIcon /> },
  { label: 'Edit', eventKey: '2', icon: <EditIcon /> },
  { label: 'Delete', eventKey: '3', icon: <TrashIcon /> },
]

const ActionCell: React.FC<Props> = ({
  rowData,
  onAction = () => {},
  actionOptions = [],
  tooltip = false,
  ...props
}) => {
  const optionsToDisplay =
    actionOptions.length > 0
      ? defaultOptions.filter(option => actionOptions.includes(option.label))
      : defaultOptions

  const handleActionClick = (
    event: React.MouseEvent,
    eventKey: string | undefined,
  ) => {
    event.stopPropagation()
    if (eventKey) {
      onAction(eventKey, rowData)
    }
  }

  return (
    <Cell {...props} className='link-group'>
      <div className='action-icons-wrapper'>
        {optionsToDisplay.map(option => (
          <button
            type='button'
            key={option.eventKey}
            className='action-icon'
            onClick={event => handleActionClick(event, option.eventKey)}>
            {tooltip ? (
              <Whisper
                placement='bottom'
                trigger='hover'
                speaker={<Tooltip>{option.label}</Tooltip>}>
                <div className='icon-container'>{option.icon}</div>
              </Whisper>
            ) : (
              <div className='icon-container'>{option.icon}</div>
            )}
          </button>
        ))}
      </div>
    </Cell>
  )
}

export default ActionCell
