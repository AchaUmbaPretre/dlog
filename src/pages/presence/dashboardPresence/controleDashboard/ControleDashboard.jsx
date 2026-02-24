import './controleDashboard.scss'
import DashEntreeSortie from './dashEntreeSortie/DashEntreeSortie'
import DashboardActivite from './dashboardActivite/DashboardActivite'
import DashboardAlerts from './dashboardAlerts/DashboardAlerts'
import DashboardSites from './dashboardSites/DashboardSites'

const ControleDashboard = () => {
  return (
    <>
        <div className="dashboard-section_control">
            <div className="dashboard_control_wrapper">
                <DashEntreeSortie/>
                <DashboardAlerts/>
            </div>
            <div style={{display:'flex', gap:'10px'}}>
                <DashboardSites/>
                <DashboardActivite/>
            </div>
        </div>
    </>
  )
}

export default ControleDashboard