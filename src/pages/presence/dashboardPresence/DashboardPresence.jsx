import React from 'react'
import DashlistePresence from './dashlistePresence/DashlistePresence'
import DashPresenceChart from './dashPresenceChart/DashPresenceChart'
import DashboardStats from './dashboardStats/DashboardStats'
import './dashboardPresence.scss';

const DashboardPresence = () => {
  return (
    <>
        <div className="dashboardPresence">
            <DashboardStats/>
            <div className="dashboard_wrapper">
                <DashPresenceChart/>
                <DashlistePresence/>
            </div>
        </div>
    </>
  )
}

export default DashboardPresence