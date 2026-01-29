import React, { useEffect, useState } from 'react'
import DashlistePresence from './dashlistePresence/DashlistePresence'
import DashPresenceChart from './dashPresenceChart/DashPresenceChart'
import DashboardStats from './dashboardStats/DashboardStats'
import './dashboardPresence.scss';
import { getPresenceDashboard } from '../../../services/presenceService';
import { notification } from 'antd';

const DashboardPresence = () => {
    const [data, setData] = useState({
        kpi: null,
        statuts: null,
        evolution: null,
        employes: null,
        topAbsences: null
    });

    const fetchData = async() => {
        try {
            const res = await getPresenceDashboard();
            setData(res?.data?.data)
        } catch (error) {
            notification.error({
                message : "Erreur de changement",
                description : "Impossible de récupérer les données du dashboard.",
                placement: "topRight"
            })
        }
    }

    useEffect(()=> {
        fetchData()
    }, []);

  return (
    <>
        <div className="dashboardPresence">
            <DashboardStats kpi={data.kpi} />
            <div className="dashboard_wrapper">
                <DashPresenceChart evolution={data.evolution} statuts={data.statuts} />
                <DashlistePresence employes={data.employes}/>
            </div>
        </div>
    </>
  )
}

export default DashboardPresence