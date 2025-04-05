import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Header as HeaderSuite,
  Nav,
  IconButton,
  Whisper,
  Popover,
  Avatar,
} from 'rsuite'
import LockIcon from '@rsuite/icons/Lock'
import ExitIcon from '@rsuite/icons/Exit'
import MenuIcon from '@rsuite/icons/Menu'
import './header.scss'
import useAuth from '../../../hooks/Auth'
import ChangePasswordModal from '../../../pages/auth/password/ChangePassword'

type Props = {
  onMenuClick: () => void
  isMobile: boolean
}

const Header: React.FC<Props> = ({ onMenuClick, isMobile }) => {
  const { user } = useAuth()
  const name = user?.name ?? '-'
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const [changePasswordModalOpen, setChangePasswordModalOpen] =
    useState<boolean>(false)

  return (
    <HeaderSuite className='header'>
      {isMobile ? (
        <IconButton
          icon={<MenuIcon />}
          onClick={onMenuClick}
          className='menu-button'
        />
      ) : (
        <h2>
          <span className='header_logo'>RateMY</span>Store
        </h2>
      )}
      <Nav className='header__user'>
        {isMobile ? (
          <Whisper
            trigger='click'
            placement='bottomEnd'
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            speaker={
              <Popover full>
                <div className='popover-content'>
                  <p className='popover-username'>{name}</p>
                  <Nav.Item
                    onClick={() => {
                      setChangePasswordModalOpen(true)
                      handleClose()
                    }}>
                    <LockIcon /> &nbsp; Change Password
                  </Nav.Item>
                  <Nav.Item as={Link} to='/logout' onClick={handleClose}>
                    <ExitIcon /> &nbsp; Logout
                  </Nav.Item>
                </div>
              </Popover>
            }>
            <Avatar size='sm' circle onClick={() => setOpen(true)} />
          </Whisper>
        ) : (
          <Nav.Menu title={name}>
            <Nav.Item onClick={() => setChangePasswordModalOpen(true)}>
              <LockIcon /> &nbsp;Change Password
            </Nav.Item>
            <Nav.Item as={Link} to='/logout'>
              <ExitIcon /> &nbsp; Logout
            </Nav.Item>
          </Nav.Menu>
        )}
      </Nav>
      <ChangePasswordModal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </HeaderSuite>
  )
}

export default Header
