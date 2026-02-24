import { notification } from 'antd'
import './controleDashboard.scss'
import DashEntreeSortie from './dashEntreeSortie/DashEntreeSortie'
import DashboardActivite from './dashboardActivite/DashboardActivite'
import DashboardAlerts from './dashboardAlerts/DashboardAlerts'
import DashboardSites from './dashboardSites/DashboardSites'
import { getPresenceDashboardStatisque } from '../../../../services/presenceService'
import { useEffect, useState } from 'react'

const ControleDashboard = () => {
    const [data, setData] = useState({
        live: {
            presentsNow: { total: 0, parSite: [] },
            attendus: { total: 0, parSite: [] }
        },
        entreeSortie: [],
        alertes: [],
        presenceSite: [],
        globalStats: {
            presents: 0,
            retards: 0,
            absents: 0,
            totalPresences: 0,
            totalSites: 0
        },
        evenements: [],
        topSites: [],
        statsParVille: []
    })
    
    const [loading, setLoading] = useState(true)

    const fetchData = async() => {
        try {
            setLoading(true)
            const res = await getPresenceDashboardStatisque()
            setData(res.data.data)
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Impossible de charger les données...',
            });
        } finally {
            setLoading(false)
        }
    };

    useEffect(()=> {
        fetchData()
        
        // Rafraîchir toutes les 5 minutes
        const interval = setInterval(fetchData, 300000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="dashboard-section_control loading">
                <div className="loading-spinner">Chargement des données...</div>
            </div>
        )
    }

    return (
        <>
            <div className="dashboard-section_control">

                {/* Première ligne */}
                <div className="dashboard_control_wrapper">
                    <DashEntreeSortie data={data.entreeSortie} />
                    <DashboardAlerts data={data.alertes} />
                </div>

                {/* Deuxième ligne */}
                <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                    <DashboardSites 
                        data={data.presenceSite} 
                        globalStats={data.globalStats}
                        statsParVille={data.statsParVille}
                        topSites={data.topSites}
                    />
                    <DashboardActivite 
                        data={data.evenements}
                        globalStats={data.globalStats}
                    />
                </div>
            </div>
        </>
    )
}

export default ControleDashboard