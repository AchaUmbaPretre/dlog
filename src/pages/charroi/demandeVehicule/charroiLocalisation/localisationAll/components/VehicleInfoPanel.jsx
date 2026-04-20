import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, Space, Tag, Tooltip, Progress, Badge, Typography, Divider } from 'antd';
import { 
  CarOutlined, 
  CloseOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  CompassOutlined,
  ThunderboltOutlined,
  AlertOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  CheckOutlined,
  HistoryOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { formatDate } from '../utils/helpers';
import { getDirection } from '../../../../../../utils/prioriteIcons';

const { Text, Title } = Typography;

const VehicleInfoPanel = ({ vehicle, onClose, onShowDetails, className }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const vehicleData = useMemo(() => {
    if (!vehicle) return null;
    
    const ignition = vehicle.sensors?.find(s => s.type === 'acc');
    const odometer = vehicle.sensors?.find(s => s.type === 'odometer');
    const alarm = vehicle.sensors?.find(s => s.type === 'textual');
    const door = vehicle.sensors?.find(s => s.type === 'door');
    
    // Récupérer la direction
    const direction = getDirection(vehicle.course);
    
    const isOnline = vehicle.online === 'online';
    const isMoving = vehicle.speed > 5;
    const hasAlarm = vehicle.alarm === 1;
    const isEngineOn = ignition?.val === true;
    
    let riskLevel = { level: 'low', color: '#52c41a', text: 'Normal' };
    if (hasAlarm) {
      riskLevel = { level: 'high', color: '#ff4d4f', text: 'Risque élevé' };
    } else if (vehicle.speed > 100) {
      riskLevel = { level: 'medium', color: '#faad14', text: 'Vitesse excessive' };
    } else if (!isOnline) {
      riskLevel = { level: 'medium', color: '#faad14', text: 'Hors ligne' };
    }
    
    return {
      ignition, odometer, alarm, door, direction,
      isOnline, isMoving, hasAlarm, isEngineOn, riskLevel
    };
  }, [vehicle]);

  const copyCoordinates = useCallback(async () => {
    if (!vehicle) return;
    const coords = `${vehicle.lat}, ${vehicle.lng}`;
    await navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [vehicle]);

  if (!vehicle || !vehicleData) return null;

  const {
    ignition, odometer, alarm, door, direction,
    isOnline, isMoving, hasAlarm, isEngineOn, riskLevel
  } = vehicleData;

  const batteryLevel = vehicle.power !== '-' ? parseInt(vehicle.power) : 85;
  const lastUpdateTime = new Date(vehicle.time);
  const now = new Date();
  const minutesSinceUpdate = Math.floor((now - lastUpdateTime) / 60000);
  const isDataStale = minutesSinceUpdate > 5;

  return (
    <div className={className} style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 1000, animation: 'slideUp 0.3s ease-out' }}>
      <Card className="vehicle-info-panel-senior" style={{ width: isExpanded ? 400 : 360, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: 16, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        {/* Header avec gradient et direction */}
        <div style={{ background: `linear-gradient(135deg, ${isMoving ? '#1890ff' : hasAlarm ? '#faad14' : '#52c41a'} 0%, ${isMoving ? '#096dd9' : hasAlarm ? '#d48806' : '#389e0d'} 100%)`, padding: '16px 20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Flèche de direction animée */}
                <div style={{ transform: `rotate(${direction.angle}deg)`, transition: 'transform 0.3s ease' }}>
                  {direction.icon || <ArrowUpOutlined style={{ fontSize: 24, color: 'white' }} />}
                </div>
              </div>
              <div>
                <Title level={4} style={{ margin: 0, color: 'white', fontWeight: 600 }}>{vehicle.name}</Title>
                <Space size={8} style={{ marginTop: 4 }}>
                  <Badge status={isOnline ? 'success' : 'error'} text={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>{isOnline ? 'En ligne' : 'Hors ligne'}</span>} />
                  {isMoving && <Badge status="processing" text={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>En mouvement • {direction.label}</span>} />}
                </Space>
              </div>
            </div>
            <Button type="text" icon={<CloseOutlined style={{ color: 'white' }} />} onClick={onClose} />
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ background: `${riskLevel.color}10`, borderLeft: `3px solid ${riskLevel.color}`, padding: '8px 12px', borderRadius: 8, marginBottom: 16 }}>
            <AlertOutlined style={{ color: riskLevel.color, fontSize: 14 }} />
            <Text style={{ fontSize: 12, color: riskLevel.color, marginLeft: 8 }}>{riskLevel.text}</Text>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#f5f5f5', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Vitesse</Text>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: isMoving ? '#1890ff' : '#8c8c8c' }}>{vehicle.speed}</Text>
                <Text style={{ fontSize: 12, color: '#8c8c8c' }}>km/h</Text>
              </div>
              {isMoving && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}><ArrowUpOutlined style={{ color: '#52c41a', fontSize: 10, transform: `rotate(${direction.angle}deg)` }} /><Text style={{ fontSize: 10, color: '#52c41a' }}>Direction {direction.label}</Text></div>}
            </div>

            <div style={{ background: '#f5f5f5', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Cap</Text>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <CompassOutlined style={{ fontSize: 20, color: '#1890ff', transform: `rotate(${direction.angle}deg)` }} />
                <Text style={{ fontSize: 18, fontWeight: 500 }}>{direction.label}</Text>
              </div>
              <Text style={{ fontSize: 10, color: '#8c8c8c' }}>{vehicle.course}°</Text>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text strong>Informations détaillées</Text>
              <Button type="text" size="small" icon={copied ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />} onClick={copyCoordinates}>{copied ? 'Copié !' : 'Copier position'}</Button>
            </div>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><Space><EnvironmentOutlined />Position</Space><Text style={{ fontSize: 11, fontFamily: 'monospace' }}>{vehicle.lat.toFixed(4)}°, {vehicle.lng.toFixed(4)}°</Text></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><Space><ThunderboltOutlined />Contact</Space><Tag color={isEngineOn ? 'green' : 'default'}>{isEngineOn ? 'ON' : 'OFF'}</Tag></div>
              {door && <div style={{ display: 'flex', justifyContent: 'space-between' }}><Space>{door.val ? '🚪' : '🔒'}Portière</Space><Tag color={door.val ? 'orange' : 'green'}>{door.value}</Tag></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><Space><ClockCircleOutlined />Dernière mise à jour</Space><Text style={{ fontSize: 11, color: isDataStale ? '#faad14' : '#666' }}>{formatDate(vehicle.time)}</Text></div>
              {odometer && <div style={{ display: 'flex', justifyContent: 'space-between' }}><Space><HistoryOutlined />Odomètre</Space><Text strong>{odometer.value}</Text></div>}
            </Space>
          </div>

          {isExpanded && (
            <div style={{ marginTop: 16 }}>
              <Divider />
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text>ID véhicule</Text><Text style={{ fontFamily: 'monospace' }}>{vehicle.id}</Text></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text>Altitude</Text><Text>{vehicle.altitude} m</Text></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Text>Batterie</Text><Progress percent={batteryLevel} size="small" width={80} /></div>
              </Space>
            </div>
          )}

          <Divider />
          <Button type="primary" block size="large" onClick={onShowDetails} style={{ height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>Voir le rapport détaillé</Button>
        </div>
      </Card>
    </div>
  );
};

export default VehicleInfoPanel;