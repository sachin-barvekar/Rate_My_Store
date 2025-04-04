import React from 'react'
import { Loader as RsuiteLoader } from 'rsuite'
import './Loader.scss'

const Loader: React.FC = () => {
  return (
    <div className='loader'>
      <div className='loader-icon'>
        <RsuiteLoader size='md' />
      </div>
      <div>
        <p>Loading...</p>
      </div>
    </div>
  )
}

export default Loader
