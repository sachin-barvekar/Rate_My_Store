import React from 'react'
import { Link } from 'react-router-dom'
import {
  Header as HeaderSuite,
  Nav,
  IconButton,
  Whisper,
  Popover,
} from 'rsuite'
import { CgProfile } from 'react-icons/cg'
import ExitIcon from '@rsuite/icons/Exit'
import MenuIcon from '@rsuite/icons/Menu'

import './header.scss'
import useAuth from '../../../hooks/Auth'

type Props = {
  onMenuClick: () => void
  isMobile: boolean
}

const Header: React.FC<Props> = ({ onMenuClick, isMobile }) => {
  const { user } = useAuth()
  const name = user?.name ?? '-'

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
            speaker={
              <Popover full>
                <div className='popover-content'>
                  <p className='popover-username'>{name}</p>
                  <Nav.Item as={Link} to='/profile'>
                    <CgProfile /> &nbsp;Profile
                  </Nav.Item>
                  <Nav.Item as={Link} to='/logout'>
                    <ExitIcon /> &nbsp; Logout
                  </Nav.Item>
                </div>
              </Popover>
            }>
            <span className='header__user-name'>{name}</span>
          </Whisper>
        ) : (
          <Nav.Menu title={name}>
            <Nav.Item as={Link} to='/profile'>
              <CgProfile /> &nbsp;Profile
            </Nav.Item>
            <Nav.Item as={Link} to='/logout'>
              <ExitIcon /> &nbsp; Logout
            </Nav.Item>
          </Nav.Menu>
        )}
      </Nav>
    </HeaderSuite>
  )
}

export default Header
