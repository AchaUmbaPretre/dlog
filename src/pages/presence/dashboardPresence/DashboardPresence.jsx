import React, { useEffect, useState } from 'react'
import DashlistePresence from './dashlistePresence/DashlistePresence'
import DashPresenceChart from './dashPresenceChart/DashPresenceChart'
import DashboardStats from './dashboardStats/DashboardStats'
import './dashboardPresence.scss';
import { getPresenceDashboard, getPresenceDashboardParSite } from '../../../services/presenceService';
import { notification } from 'antd';
import TopAbsences from './topAbsences/TopAbsences';

const DashboardPresence = () => {
    const [data, setData] = useState({
        kpi: null,
        statuts: null,
        evolution: null,
        employes: null,
        topAbsences: null
    });
    const [sites, setSites] = useState([])

    const fetchData = async() => {
        try {
            const [ presentData, allData ] = await Promise.all([
                getPresenceDashboard(),
                getPresenceDashboardParSite()
            ])
            setData(presentData?.data?.data);
            setSites(allData?.data?.data)

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
            <DashboardStats kpi={data.kpi} sites={sites} />
            <div className="dashboard_wrapper">
                <div style={{flex:1}}>
                    <DashPresenceChart evolution={data?.evolution} statuts={data.statuts} kpi={data.kpi} />
                </div>

                <div style={{flex:1}}>
                    <DashlistePresence employes={data?.employes} />
                    <TopAbsences topAbsences={data?.topAbsences} />
                </div>
            </div>
        </div>
    </>
  )
}

export default DashboardPresence