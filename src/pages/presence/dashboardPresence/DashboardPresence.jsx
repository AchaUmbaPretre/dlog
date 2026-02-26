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
import { useDashboardPresence } from './hooks/useDashboardPresence';

const DashboardPresence = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const { data, sites, reload } = useDashboardPresence()

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
                <FiltreDashboard reload={reload} />
            </div>

            <DashboardStats kpi={data.kpi} sites={sites} />

            <Tabs
                type="card"
                tabPosition="top"
                destroyInactiveTabPane
                animated
                style={{marginTop:'10px'}}
            >
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
                        Rapport global
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