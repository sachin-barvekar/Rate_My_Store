import useAuth from '../../hooks/Auth'
import AdminHome from './adminHomePage/AdminHomePage'
import StoreOwnerHome from './storeownerHomePage/StoreownerHome'
import UserHome from './userHomePage/UserHomePage'

const RoleBasedHomePages: Record<string, React.FC> = {
  admin: AdminHome,
  user: UserHome,
  store_owner: StoreOwnerHome,
}

export const HomePage = () => {
  const { user } = useAuth()
  const role = user?.role ?? ''
  const RoleBasedHomePage = RoleBasedHomePages[role]

  return RoleBasedHomePage ? <RoleBasedHomePage /> : <div>Unauthorized</div>
}

export default HomePage