import { HTMLAttributes } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import useAuth from '../hooks/Auth'
import StarIcon from '@rsuite/icons/Star'
import { FaUsers, FaStore } from 'react-icons/fa'

type SubMenuItemType = {
  id: string
  name: string
  link: string
  icon?: React.FC<HTMLAttributes<SVGElement>>
}

type MenuItemType = {
  id: string
  name: string
  link?: string
  icon: React.FC<HTMLAttributes<SVGElement>>
  roles: string[]
  subMenu?: SubMenuItemType[]
}

const menuItems: MenuItemType[] = [
  {
    id: '1',
    name: 'Dashboard',
    link: '/',
    icon: AiOutlineHome,
    roles: ['admin', 'user', 'store_owner'],
  },
  {
    id: '2',
    name: 'Users',
    link: '/users',
    icon: FaUsers,
    roles: ['admin'],
  },
  {
    id: '3',
    name: 'Stores',
    link: '/stores',
    icon: FaStore,
    roles: ['admin', 'user'],
  },
  {
    id: '4',
    name: 'Store Ratings',
    link: '/ratings',
    icon: StarIcon,
    roles: ['store_owner'],
  },
]

export const getMenuItemsForRole = (role: string): MenuItemType[] => {
  return menuItems.filter(item => item.roles.includes(role))
}

export const useFilteredMenuItems = (): MenuItemType[] => {
  const { user } = useAuth()
  const role = user?.role
  return getMenuItemsForRole(role ?? '')
}

export default menuItems
