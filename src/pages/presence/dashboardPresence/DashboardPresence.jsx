import React from 'react'
import DashboardStats from './dashboardStats/DashboardStats'
import DashlistePresence from './dashlistePresence/DashlistePresence'

const DashboardPresence = () => {
  return (
    <>
        <div className="dashboardPresence">
            <DashboardStats/>
            <div className="dashboard_wrapper">
                <DashboardPresence/>
                <DashlistePresence/>
            </div>
        </div>
    </>
  )
}

export default DashboardPresence