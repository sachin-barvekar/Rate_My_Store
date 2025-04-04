import { HTMLAttributes } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import useAuth from '../hooks/Auth'
import { FaUsers } from 'react-icons/fa'

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
