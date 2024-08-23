import React from 'react'
import './rightBar.scss'
import Statistique from '../../components/statistique/Statistique'

const RightBar = () => {
  return (
    <>
        <div className="rightbar">
          <div className="rightbar-wrapper">
            <div className="rightbar-left">
              <Statistique/>
            </div>
          </div>
        </div>
    </>
  )
}

export default RightBar