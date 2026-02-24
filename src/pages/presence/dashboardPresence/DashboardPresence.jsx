import { useEffect, useState } from 'react'
import DashlistePresence from './dashlistePresence/DashlistePresence'
import DashPresenceChart from './dashPresenceChart/DashPresenceChart'
import DashboardStats from './dashboardStats/DashboardStats'
import './dashboardPresence.scss';
import { getPresenceDashboard, getPresenceDashboardParSite } from '../../../services/presenceService';
import { notification, Button, Tooltip, Tabs } from 'antd';
import TopAbsences from './topAbsences/TopAbsences';
import FiltreDashboard from './filtreDashboard/FiltreDashboard';
import {
  FilterOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';
import ControleDashboard from './controleDashboard/ControleDashboard';

const DashboardPresence = () => {
  const [data, setData] = useState({
    kpi: null,
    statuts: null,
    evolution: null,
    employes: null,
    topAbsences: null
  });

  const [sites, setSites] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [activeKey, setActiveKey] = useState('1');

  const fetchData = async () => {
    try {
      const [presentData, allData] = await Promise.all([
        getPresenceDashboard(),
        getPresenceDashboardParSite()
      ]);

      setData(presentData?.data?.data);
      setSites(allData?.data?.data);

    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de récupérer les données du dashboard.",
        placement: "topRight"
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

return (
    <>
        <div className="dashboard_container">
            <div className="dashboardPresence">

            <div className="dashboard_header">
                <Tooltip
                    title={showFilter ? "Masquer les filtres" : "Afficher les filtres"}
                    placement="top"
                >
                <Button
                    icon={<FilterOutlined />}
                    type={showFilter ? "primary" : "default"}
                    onClick={() => setShowFilter(prev => !prev)}
                />
                </Tooltip>
            </div>

            <div className={`dashboard_filter ${showFilter ? "open" : "closed"}`}>
                <FiltreDashboard />
            </div>

            <DashboardStats kpi={data.kpi} sites={sites} />

            <Tabs>
                <Tabs.TabPane
                    key="1"
                    tab={
                      <span style={getTabStyle('4', activeKey)}>
                        <BarChartOutlined style={iconStyle('4', activeKey)} />
                        Statistique
                      </span>
                    }
                >
                    <ControleDashboard />
                </Tabs.TabPane> 
                <Tabs.TabPane
                    key="2"
                    tab={
                      <span style={getTabStyle('4', activeKey)}>
                        <BarChartOutlined style={iconStyle('4', activeKey)} />
                        Dashboard
                      </span>
                    }
                  >
                    <div className="dashboard_wrapper">
                        <div style={{ flex: 1 }}>
                            <DashPresenceChart
                            evolution={data?.evolution}
                            statuts={data?.statuts}
                            kpi={data?.kpi}
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <DashlistePresence employes={data?.employes} />
                            <TopAbsences topAbsences={data?.topAbsences} />
                        </div>
                    </div>
                  </Tabs.TabPane>    
            </Tabs>
            </div>
        </div>
    </>
  );
};

export default DashboardPresence;