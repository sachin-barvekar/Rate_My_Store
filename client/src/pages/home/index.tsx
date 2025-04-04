import useAuth from '../../hooks/Auth';
import AdminHome from './adminHomePage/AdminHomePage';

const RoleBasedHomePages: Record<string, React.FC> = {
  admin: AdminHome,
};

export const HomePage = () => {
  const { user } = useAuth();
  const role = user?.role ?? '';
  const RoleBasedHomePage = RoleBasedHomePages[role];

  return RoleBasedHomePage ? <RoleBasedHomePage /> : <div>Unauthorized</div>;
};

export default HomePage;