import React from 'react'
import LoaderIcon from '../../../assets/images/Loader.svg'
import './Loader.scss'

const Loader: React.FC = () => {
  return (
    <div className='loader'>
      <div className='loader-icon'>
        <LoaderIcon />
      </div>
      <div>
        <p>Loading...</p>
      </div>
    </div>
  )
}

export default Loader
