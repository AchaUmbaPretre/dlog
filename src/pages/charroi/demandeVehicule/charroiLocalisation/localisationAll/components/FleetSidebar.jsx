import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Button, Space, Segmented, Tooltip, Badge, Tag, List } from 'antd';
import { 
  CarOutlined, 
  WifiOutlined, 
  AlertOutlined, 
  DashboardOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { TILE_LAYERS } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { VehicleAddress } from '../../../../../../utils/vehicleAddress';

const FleetSidebar = ({ 
  stats, 
  vehicles, 
  selectedVehicle,
  onVehicleSelect,
  onStyleChange,
  onToggleTrails,
  onToggleHeatmap,
  showTrails,
  showHeatmap,
  currentStyle
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
            <h2>
              <CarOutlined className="header-icon" />
              Gestionnaire de flotte
            </h2>
            <p>Suivi en temps réel</p>
          </div>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="collapse-btn"
        />
      </div>

      {!collapsed && (
        <>
          <div className="stats-container">
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Card size="small" className="stat-card stat-total">
                  <Statistic 
                    title="Total" 
                    value={stats?.total || 0} 
                    prefix={<CarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" className="stat-card stat-online">
                  <Statistic 
                    title="En ligne" 
                    value={stats?.online || 0} 
                    prefix={<WifiOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" className="stat-card stat-moving">
                  <Statistic 
                    title="En mouvement" 
                    value={stats?.moving || 0} 
                    prefix={<DashboardOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" className="stat-card stat-alerts">
                  <Statistic 
                    title="Alertes" 
                    value={stats?.alerts || 0} 
                    prefix={<AlertOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          <div className="vehicles-list">
            <h3>Véhicules</h3>
            <List
              dataSource={vehicles}
              renderItem={(vehicle) => (
                <List.Item
                  className={`vehicle-item ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                  onClick={() => onVehicleSelect(vehicle)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        color={vehicle.online === 'online' ? '#52c41a' : '#faad14'}
                        status={vehicle.online === 'online' ? 'success' : 'warning'}
                      />
                    }
                    title={<strong>{vehicle.name}</strong>}
                    description={
                      <>
                        <div className="vehicle-info">
                          <Tag color={vehicle.speed > 0 ? 'blue' : 'default'}>
                            {vehicle.speed} km/h
                          </Tag>
                          <div className="vehicle-coords">
                            <EnvironmentOutlined />
                            <VehicleAddress record={vehicle} />
                          </div>
                          <div className="vehicle-time">
                            <ClockCircleOutlined /> {formatDate(vehicle.time)}
                          </div>
                        </div>
                        {vehicle.sensors?.find(s => s.type === 'textual')?.value !== '-' && (
                          <Tag color="orange" className="vehicle-alert">
                            <AlertOutlined /> {vehicle.sensors.find(s => s.type === 'textual')?.value}
                          </Tag>
                        )}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </div>

          <div className="sidebar-footer">
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Segmented
                block
                value={currentStyle}
                onChange={onStyleChange}
                options={styleOptions}
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