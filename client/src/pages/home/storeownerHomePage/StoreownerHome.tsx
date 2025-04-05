import { Stat, StatGroup } from 'rsuite'
import StarIcon from '@rsuite/icons/Star'
import '../adminHomePage/AdminHome.scss'
import { useStoreDashboardCountQuery } from '../dashboardApiSlice'
import { FaStarHalfAlt } from 'react-icons/fa'

const StoreOwnerHome: React.FC = () => {
  const { data } = useStoreDashboardCountQuery()
  return (
    <div className='dashboard'>
      <h2>Welcome, Store Owner</h2>
      <span>Store Name: {data?.storeName}</span>
      <StatGroup className='stat-container' columns={2}>
        <Stat
          bordered
          className='stat-card'
          icon={<FaStarHalfAlt color='red' className='stat-icon' />}>
          <Stat.Value>{data?.totalRatings ?? 0}</Stat.Value>
          <Stat.Label>Total Rating</Stat.Label>
        </Stat>
        <Stat
          bordered
          className='stat-card'
          icon={<StarIcon color='#FF9800' className='stat-icon' />}>
          <Stat.Value>{data?.averageRating ?? 0}</Stat.Value>
          <Stat.Label>Average Rating</Stat.Label>
        </Stat>
      </StatGroup>
    </div>
  )
}

export default StoreOwnerHome
