import React from 'react'
import { Footer as FooterSuite } from 'rsuite'
import './footer.scss'

const Footer: React.FC = () => {
  return (
    <FooterSuite className='footer'>
      <div className='footer__center'>
        <p>
          &copy;2025 RateMYStore. <br /> Designed and developed by
          <b> Sachin Barvekar.</b>
        </p>
      </div>
    </FooterSuite>
  )
}

export default Footer
