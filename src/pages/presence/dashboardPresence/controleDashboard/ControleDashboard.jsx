import './controleDashboard.scss'
import DashEntreeSortie from './dashEntreeSortie/DashEntreeSortie'
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

            <DashboardSites/>
        </div>
    </>
  )
}

export default ControleDashboard