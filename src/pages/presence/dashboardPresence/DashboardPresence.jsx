import { useState } from 'react'
import DashlistePresence from './dashlistePresence/DashlistePresence'
import DashPresenceChart from './dashPresenceChart/DashPresenceChart'
import DashboardStats from './dashboardStats/DashboardStats'
import './dashboardPresence.scss';
import { Button, Tooltip, Tabs, Spin } from 'antd';
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
  const [filters, setFilters] = useState(null);
  
  const { data, sites, loading, reload } = useDashboardPresence(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading && !data.kpi) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

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
            <FiltreDashboard 
              onFilterChange={handleFilterChange}
              reload={reload}
            />
          </div>

          <DashboardStats kpi={data.kpi} sites={sites} />

          <Tabs
            type="card"
            tabPosition="top"
            destroyInactiveTabPane
            animated
            style={{ marginTop: '10px' }}
            onChange={setActiveKey}
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
              <ControleDashboard filters={filters} />
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
                    filters={filters}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <DashlistePresence 
                    employes={data?.employes} 
                    filters={filters}
                  />
                  <TopAbsences 
                    topAbsences={data?.topAbsences}
                    filters={filters}
                  />
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