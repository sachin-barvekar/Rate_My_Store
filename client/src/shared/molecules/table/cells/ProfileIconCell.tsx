import React from 'react'
import { Cell } from 'rsuite-table'
import { Avatar } from 'rsuite'
import './ProfileIcon.scss'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData?: any
  imgKey?: string
}

const ProfileIconCell: React.FC<Props> = ({
  rowData = {},
  imgKey = 'photoUrl',
  ...props
}) => {
  const profileImgUrl = rowData[imgKey]

  return (
    <Cell {...props} className='profile-icon-cell'>
      <div className='profile-icon-wrapper'>
        {profileImgUrl ? (
          <img
            src={profileImgUrl}
            alt='User Profile'
            className='profile-image'
          />
        ) : (
          <div className='no-image'>
            <Avatar circle />
          </div>
        )}
      </div>
    </Cell>
  )
}

export default ProfileIconCell
