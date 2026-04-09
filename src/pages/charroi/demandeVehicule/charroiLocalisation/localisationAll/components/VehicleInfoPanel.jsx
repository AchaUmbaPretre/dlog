import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, Space, Tag, Tooltip, Progress, Badge, Typography, Divider } from 'antd';
import { 
  CarOutlined, 
  CloseOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
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

  // Calcul des données mémorisées - déplacé avant le return
  const vehicleData = useMemo(() => {
    if (!vehicle) return null;
    
    const ignition = vehicle.sensors?.find(s => s.type === 'acc');
    const odometer = vehicle.sensors?.find(s => s.type === 'odometer');
    const alarm = vehicle.sensors?.find(s => s.type === 'textual');
    const door = vehicle.sensors?.find(s => s.type === 'door');
    const fuel = vehicle.sensors?.find(s => s.type === 'fuel_tank');
    const { label, icon } = getDirection(vehicle);
    
    const isOnline = vehicle.online === 'online';
    const isMoving = vehicle.speed > 5;
    const hasAlarm = vehicle.alarm === 1;
    const isEngineOn = ignition?.val === true;
    
    // Calcul du niveau de risque
    let riskLevel = { level: 'low', color: '#52c41a', text: 'Normal' };
    if (hasAlarm) {
      riskLevel = { level: 'high', color: '#ff4d4f', text: 'Risque élevé' };
    } else if (vehicle.speed > 100) {
      riskLevel = { level: 'medium', color: '#faad14', text: 'Vitesse excessive' };
    } else if (!isOnline) {
      riskLevel = { level: 'medium', color: '#faad14', text: 'Hors ligne' };
    }
    
    return {
      ignition, odometer, alarm, door, fuel, label, icon,
      isOnline, isMoving, hasAlarm, isEngineOn, riskLevel
    };
  }, [vehicle]);

  // Copie des coordonnées
  const copyCoordinates = useCallback(async () => {
    if (!vehicle) return;
    const coords = `${vehicle.lat}, ${vehicle.lng}`;
    await navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [vehicle]);

  if (!vehicle || !vehicleData) {
    return null;
  }

  const {
    ignition, odometer, alarm, door, fuel, label, icon,
    isOnline, isMoving, hasAlarm, isEngineOn, riskLevel
  } = vehicleData;

  // Calcul du pourcentage de batterie (simulation)
  const batteryLevel = vehicle.power !== '-' ? parseInt(vehicle.power) : 85;
  
  // Temps depuis la dernière mise à jour
  const lastUpdateTime = new Date(vehicle.time);
  const now = new Date();
  const minutesSinceUpdate = Math.floor((now - lastUpdateTime) / 60000);
  const isDataStale = minutesSinceUpdate > 5;

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <Card
        className="vehicle-info-panel-senior"
        style={{
          width: isExpanded ? 400 : 360,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header avec gradient */}
        <div
          style={{
            background: `linear-gradient(135deg, ${isMoving ? '#1890ff' : hasAlarm ? '#faad14' : '#52c41a'} 0%, ${isMoving ? '#096dd9' : hasAlarm ? '#d48806' : '#389e0d'} 100%)`,
            padding: '16px 20px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Pattern décoratif */}
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
            }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CarOutlined style={{ color: 'white', fontSize: 24 }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, color: 'white', fontWeight: 600 }}>
                  {vehicle.name}
                </Title>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <Badge 
                    status={isOnline ? 'success' : 'error'} 
                    text={
                      <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
                        {isOnline ? 'En ligne' : 'Hors ligne'}
                      </span>
                    }
                  />
                  {isMoving && (
                    <Badge 
                      status="processing" 
                      text={
                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
                          En mouvement
                        </span>
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Tooltip title={isExpanded ? "Réduire" : "Plus de détails"}>
                <Button
                  type="text"
                  icon={<HistoryOutlined style={{ color: 'white' }} />}
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ color: 'white' }}
                />
              </Tooltip>
              <Tooltip title="Fermer">
                <Button
                  type="text"
                  icon={<CloseOutlined style={{ color: 'white' }} />}
                  onClick={onClose}
                  style={{ color: 'white' }}
                />
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{ padding: '20px' }}>
          <div
            style={{
              background: `${riskLevel.color}10`,
              borderLeft: `3px solid ${riskLevel.color}`,
              padding: '8px 12px',
              borderRadius: 8,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <AlertOutlined style={{ color: riskLevel.color, fontSize: 14 }} />
            <Text style={{ fontSize: 12, color: riskLevel.color, margin: 0 }}>
              {riskLevel.text}
            </Text>
          </div>

          {/* Métriques principales */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                background: '#f5f5f5',
                borderRadius: 12,
                padding: '12px',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
            >
              <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
                Vitesse
              </Text>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: isMoving ? '#1890ff' : '#8c8c8c' }}>
                  {vehicle.speed}
                </Text>
                <Text style={{ fontSize: 12, color: '#8c8c8c' }}>km/h</Text>
              </div>
              {isMoving && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                  <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 10 }} />
                  <Text style={{ fontSize: 10, color: '#52c41a' }}>En accélération</Text>
                </div>
              )}
            </div>

            <div
              style={{
                background: '#f5f5f5',
                borderRadius: 12,
                padding: '12px',
                textAlign: 'center'
              }}
            >
              <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
                Direction
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <Text style={{ fontSize: 14, fontWeight: 500 }}>{label}</Text>
              </div>
              <Text style={{ fontSize: 10, color: '#8c8c8c', display: 'block', marginTop: 4 }}>
                {vehicle.course}°
              </Text>
            </div>
          </div>

          {/* Informations détaillées */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text strong style={{ fontSize: 13 }}>Informations détaillées</Text>
              <Tooltip title="Copier les coordonnées">
                <Button
                  type="text"
                  size="small"
                  icon={copied ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                  onClick={copyCoordinates}
                  style={{ fontSize: 12 }}
                >
                  {copied ? 'Copié !' : 'Copier position'}
                </Button>
              </Tooltip>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                  <Text style={{ fontSize: 12 }}>Position</Text>
                </div>
                <Tooltip title={`${vehicle.lat}, ${vehicle.lng}`}>
                  <Text style={{ fontSize: 11, fontFamily: 'monospace', color: '#666' }}>
                    {vehicle.lat.toFixed(4)}°, {vehicle.lng.toFixed(4)}°
                  </Text>
                </Tooltip>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <ThunderboltOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                  <Text style={{ fontSize: 12 }}>Contact</Text>
                </div>
                <Tag color={isEngineOn ? 'green' : 'default'} style={{ margin: 0 }}>
                  {isEngineOn ? 'ON' : 'OFF'}
                </Tag>
              </div>

              {door && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12 }}>{door.val ? '🚪' : '🔒'}</span>
                    <Text style={{ fontSize: 12 }}>Portière</Text>
                  </div>
                  <Tag color={door.val ? 'orange' : 'green'} style={{ margin: 0 }}>
                    {door.value}
                  </Tag>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <ClockCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                  <Text style={{ fontSize: 12 }}>Dernière mise à jour</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text style={{ fontSize: 11, color: isDataStale ? '#faad14' : '#666' }}>
                    {formatDate(vehicle.time)}
                  </Text>
                  {isDataStale && (
                    <div>
                      <Text style={{ fontSize: 10, color: '#faad14' }}>
                        {minutesSinceUpdate} min
                      </Text>
                    </div>
                  )}
                </div>
              </div>

              {odometer && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <HistoryOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                    <Text style={{ fontSize: 12 }}>Odomètre</Text>
                  </div>
                  <Text strong style={{ fontSize: 13 }}>
                    {odometer.value}
                  </Text>
                </div>
              )}

              {fuel && fuel.value !== '-' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <DashboardOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                    <Text style={{ fontSize: 12 }}>Carburant</Text>
                  </div>
                  <div style={{ width: 100 }}>
                    <Progress 
                      percent={parseInt(fuel.value) || 0} 
                      size="small" 
                      status={parseInt(fuel.value) < 20 ? 'exception' : 'active'}
                      format={(percent) => `${percent}%`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section expansion */}
          {isExpanded && (
            <div style={{ marginTop: 16 }}>
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                  Informations techniques
                </Text>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>ID véhicule</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{vehicle.id}</Text>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>Altitude</Text>
                    <Text style={{ fontSize: 12 }}>{vehicle.altitude} m</Text>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12 }}>Batterie</Text>
                    <Progress 
                      percent={batteryLevel} 
                      size="small" 
                      width={80}
                      format={(percent) => `${percent}%`}
                    />
                  </div>

                  {vehicle.device_data?.plate_number && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 12 }}>Plaque</Text>
                      <Text strong style={{ fontSize: 12 }}>{vehicle.device_data.plate_number}</Text>
                    </div>
                  )}

                  {vehicle.device_data?.device_model && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 12 }}>Modèle</Text>
                      <Text style={{ fontSize: 12 }}>{vehicle.device_data.device_model}</Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <Divider style={{ margin: '16px 0 12px 0' }} />
          
          <Button
            type="primary"
            block
            size="large"
            onClick={onShowDetails}
            style={{
              height: 44,
              borderRadius: 12,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            Voir le rapport détaillé
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VehicleInfoPanel;