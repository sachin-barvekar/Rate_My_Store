import { Stat, StatGroup } from 'rsuite'
import PeoplesIcon from '@rsuite/icons/Peoples'
import StarIcon from '@rsuite/icons/Star'
import { FaStore } from 'react-icons/fa'
import { useAdminDashboardCountQuery } from '../dashboardApiSlice'
import './AdminHome.scss'

const AdminHome: React.FC = () => {
  const { data } = useAdminDashboardCountQuery()

  return (
    <div className='dashboard'>
      <h2>Welcome, Admin</h2>
      <StatGroup className='stat-container' columns={3}>
        <Stat
          bordered
          className='stat-card'
          icon={<PeoplesIcon color='#733832' className='stat-icon' />}>
          <Stat.Value>{data?.totalUsers ?? 0}</Stat.Value>
          <Stat.Label>Total Users</Stat.Label>
        </Stat>
        <Stat
          bordered
          className='stat-card'
          icon={<FaStore color='#B71C1C' className='stat-icon' />}>
          <Stat.Value>{data?.totalStore ?? 0}</Stat.Value>
          <Stat.Label>Total Stores</Stat.Label>
        </Stat>
        <Stat
          bordered
          className='stat-card'
          icon={<StarIcon color='#FF9800' className='stat-icon' />}>
          <Stat.Value>{data?.totalSubmittedRatings}</Stat.Value>
          <Stat.Label>Total Ratings Submitted</Stat.Label>
        </Stat>
      </StatGroup>
    </div>
  )
}

export default AdminHome
