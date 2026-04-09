import React from 'react';
import { Card, Button, Space, Tag, Descriptions, Tooltip } from 'antd';
import { 
  CarOutlined, 
  CloseOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  CompassOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { formatDate } from '../utils/helpers';

const VehicleInfoPanel = ({ vehicle, onClose, onShowDetails }) => {
  if (!vehicle) {
    console.log('Pas de véhicule, retour null');
    return null;
  }

  const ignition = vehicle.sensors?.find(s => s.type === 'acc');
  const odometer = vehicle.sensors?.find(s => s.type === 'odometer');
  const alarm = vehicle.sensors?.find(s => s.type === 'textual');

  return (
    <Card
      className="vehicle-info-panel"
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 320,
        zIndex: 1000, // Augmentez le z-index
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.3s ease-out',
        backgroundColor: 'white', // Assurez-vous que la couleur de fond est visible
        display: 'block' // Force l'affichage
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <Space>
          <CarOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <h3 style={{ margin: 0, fontSize: 16 }}>{vehicle.name}</h3>
        </Space>
        <Tooltip title="Fermer">
          <Button 
            type="text" 
            size="small" 
            onClick={onClose}
            icon={<CloseOutlined />}
          />
        </Tooltip>
      </div>
      
      <Descriptions column={1} size="small" style={{ marginBottom: 12 }}>
        <Descriptions.Item label="Vitesse">
          <Tag color={vehicle.speed > 0 ? 'blue' : 'default'}>
            {vehicle.speed} km/h
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Position">
          <Tooltip title="Cliquer pour copier">
            <span style={{ cursor: 'pointer', fontSize: 12 }}>
              <EnvironmentOutlined /> {vehicle.lat.toFixed(6)}, {vehicle.lng.toFixed(6)}
            </span>
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Direction">
          <CompassOutlined /> {vehicle.course}°
        </Descriptions.Item>
        <Descriptions.Item label="Dernière mise à jour">
          <ClockCircleOutlined /> {formatDate(vehicle.time)}
        </Descriptions.Item>
        <Descriptions.Item label="Contact">
          <Tag color={ignition?.val ? 'green' : 'default'}>
            <ThunderboltOutlined /> {ignition?.value || 'Off'}
          </Tag>
        </Descriptions.Item>
        {odometer && (
          <Descriptions.Item label="Odomètre">
            {odometer.value}
          </Descriptions.Item>
        )}
      </Descriptions>
      
      {alarm?.value && alarm.value !== '-' && (
        <div style={{ 
          background: '#fff7e6', 
          padding: '8px 12px', 
          borderRadius: 8, 
          marginBottom: 12,
          border: '1px solid #ffd591'
        }}>
          <span style={{ color: '#faad14' }}>⚠️</span> {alarm.value}
        </div>
      )}
      
      <Space style={{ width: '100%' }}>
        <Button 
          type="primary" 
          block
          onClick={onShowDetails}
        >
          Voir détails complets
        </Button>
      </Space>
    </Card>
  );
};

export default VehicleInfoPanel; 