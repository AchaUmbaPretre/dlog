import React, { useState } from 'react';
import { Button, Space, Segmented, Tooltip } from 'antd';
import { 
  CarOutlined, 
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { TILE_LAYERS } from '../utils/constants';
import VehicleFilter from './VehicleFilter';
import HistoryControl from './HistoryControl';

const FleetSidebar = ({ 
  stats, 
  vehicles, 
  selectedVehicle,
  onVehicleSelect,
  onActiveVehicleChange,
  onStyleChange,
  onToggleTrails,
  onToggleHeatmap,
  showTrails,
  showHeatmap,
  currentStyle,
  onFilterChange,
  selectedVehiclesIds,
  showHistory,
  onToggleHistory,
  onLoadHistoryWithFilter,
  onClearHistory,
  activeVehicle
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const styleOptions = Object.keys(TILE_LAYERS).map(key => ({
    label: TILE_LAYERS[key].name,
    value: key,
    icon: key === 'satellite' ? '🛰️' : key === 'dark' ? '🌙' : key === 'light' ? '☀️' : <GlobalOutlined />
  }));

  return (
    <div className={`fleet-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="header-content">
            <h2><CarOutlined className="header-icon" /> Gestionnaire de flotte</h2>
            <p>Suivi en temps réel</p>
          </div>
        )}
        <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} className="collapse-btn" />
      </div>

      {!collapsed && (
        <>
          <VehicleFilter 
            vehicles={vehicles} 
            onFilterChange={onFilterChange}
            onActiveVehicleChange={onActiveVehicleChange}
          />
          <div className="sidebar-footer">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Segmented block value={currentStyle} onChange={onStyleChange} options={styleOptions} />
              
              <HistoryControl
                vehicle={activeVehicle}
                onLoadHistory={onLoadHistoryWithFilter}
                onClearHistory={onClearHistory}
                showHistory={showHistory}
                onToggleHistory={onToggleHistory}
              />
              
              <Space style={{ width: '100%' }} size={8}>
                <Tooltip title="Traces">
                  <Button 
                    type={showTrails ? 'primary' : 'default'}
                    icon={<LineChartOutlined />}
                    onClick={onToggleTrails}
                    style={{ flex: 1 }}
                  />
                </Tooltip>
                <Tooltip title="Heatmap">
                  <Button 
                    type={showHeatmap ? 'primary' : 'default'}
                    icon={<ThunderboltOutlined />}
                    onClick={onToggleHeatmap}
                    style={{ flex: 1 }}
                  />
                </Tooltip>
              </Space>
            </Space>
          </div>
        </>
      )}
    </div>
  );
};

export default FleetSidebar;