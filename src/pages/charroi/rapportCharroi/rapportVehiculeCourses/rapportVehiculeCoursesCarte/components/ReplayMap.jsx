import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Modal, Slider, Button, Timeline, Tag, Progress, message, Badge, Card, Statistic, Row, Col, Divider } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  StopOutlined, 
  ReloadOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CarOutlined,
  UserOutlined,
  FlagOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  LineChartOutlined,
  AimOutlined
} from '@ant-design/icons';
import 'leaflet/dist/leaflet.css';
import { VehicleAddress } from '../../../../../../utils/vehicleAddress';


const createReplayIcon = () => {
  return L.divIcon({
    html: `
      <div class="replay-marker-premium">
        <div class="replay-marker-inner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
      </div>
    `,
    className: 'replay-marker-wrapper',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

const createStartIcon = () => {
  return L.divIcon({
    html: `<div class="marker-start">📍🏁</div>`,
    className: 'marker-start-wrapper',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const createEndIcon = () => {
  return L.divIcon({
    html: `<div class="marker-end">📍🎯</div>`,
    className: 'marker-end-wrapper',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export const ReplayMap = ({ vehicle, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [replayPoints, setReplayPoints] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const intervalRef = useRef(null);
  const mapRef = useRef(null);
  
  // Préparer l'adresse record pour VehicleAddress - SANS time pour éviter l'erreur
  const getAddressRecord = (lat, lng) => ({
    lat: lat,
    lng: lng,
    capteurInfo: {
      lat: lat,
      lng: lng,
      address: null
    }
  });
  
  // Initialiser les points de replay
  useEffect(() => {
    if (!vehicle) return;
    
    let trajectory = vehicle.trajectory;
    
    if ((!trajectory || trajectory.length === 0) && vehicle.rawData?.tail) {
      trajectory = vehicle.rawData.tail
        .filter(point => point.lat && point.lng)
        .map(point => [parseFloat(point.lat), parseFloat(point.lng)]);
    }
    
    if ((!trajectory || trajectory.length === 0) && vehicle.tail) {
      trajectory = vehicle.tail
        .filter(point => point.lat && point.lng)
        .map(point => [parseFloat(point.lat), parseFloat(point.lng)]);
    }
    
    if (trajectory && trajectory.length > 0) {
      const points = trajectory.map((pos, idx) => ({
        lat: pos[0],
        lng: pos[1],
        id: idx,
        isStart: idx === 0,
        isEnd: idx === trajectory.length - 1
      }));
      
      setReplayPoints(points);
      setCurrentPosition(points[0]);
      setProgress(0);
      setCurrentIndex(0);
      setTotalDuration(points.length * 0.1);
    } else {
      message.warning('Ce véhicule n\'a pas de données de trajectoire');
    }
  }, [vehicle]);
  
  // Animation du replay
  useEffect(() => {
    if (isPlaying && replayPoints.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= replayPoints.length - 1) {
            setIsPlaying(false);
            message.success('Replay terminé 🎬');
            clearInterval(intervalRef.current);
            return prev;
          }
          const newIndex = prev + 1;
          const newProgress = (newIndex / (replayPoints.length - 1)) * 100;
          setProgress(newProgress);
          setCurrentPosition(replayPoints[newIndex]);
          
          if (mapRef.current && replayPoints[newIndex]) {
            mapRef.current.setView([replayPoints[newIndex].lat, replayPoints[newIndex].lng], 15, {
              animate: true,
              duration: 0.3
            });
          }
          
          return newIndex;
        });
      }, 80);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, replayPoints]);
  
  const handlePlay = () => {
    if (replayPoints.length === 0) {
      message.warning('Aucune trajectoire à afficher');
      return;
    }
    
    if (progress >= 100) {
      setProgress(0);
      setCurrentIndex(0);
      setCurrentPosition(replayPoints[0]);
      if (mapRef.current && replayPoints[0]) {
        mapRef.current.setView([replayPoints[0].lat, replayPoints[0].lng], 15);
      }
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(true);
    }
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handleStop = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentIndex(0);
    setCurrentPosition(replayPoints[0]);
    if (mapRef.current && replayPoints[0]) {
      mapRef.current.setView([replayPoints[0].lat, replayPoints[0].lng], 13);
    }
  };
  
  const handleSliderChange = (value) => {
    if (replayPoints.length === 0) return;
    
    setIsPlaying(false);
    const newIndex = Math.floor((value / 100) * (replayPoints.length - 1));
    setCurrentIndex(newIndex);
    setProgress(value);
    setCurrentPosition(replayPoints[newIndex]);
    if (mapRef.current && replayPoints[newIndex]) {
      mapRef.current.setView([replayPoints[newIndex].lat, replayPoints[newIndex].lng], 15);
    }
  };
  
  const totalDistance = vehicle.totalDistance || 0;
  const avgSpeed = totalDistance > 0 ? (totalDistance / (totalDuration / 3600)).toFixed(1) : 0;
  const remainingDistance = totalDistance * (1 - progress / 100);
  
  if (!vehicle) return null;
  
  if (replayPoints.length === 0) {
    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="modal-title-accent" />
            <span className="modal-title-text">Replay Trajet</span>
            <Tag color="blue">{vehicle.registration}</Tag>
          </div>
        }
        open={true}
        onCancel={onClose}
        footer={null}
        width={500}
        className="replay-modal-premium"
      >
        <div className="empty-state-replay">
          <div className="empty-icon">🗺️</div>
          <div className="empty-title">Aucune trajectoire disponible</div>
          <div className="empty-description">
            Ce véhicule n'a pas de données de trajectoire enregistrées.
          </div>
        </div>
      </Modal>
    );
  }
  
  return (
    <Modal
      title={
        <div className="modal-header-premium">
          <div className="modal-title">
            <div className="modal-title-accent" />
            <span className="modal-title-text">Replay Trajet</span>
            <div className="vehicle-badge">
              <CarOutlined />
              <span>{vehicle.name}</span>
            </div>
            <Tag color="blue">{vehicle.registration}</Tag>
            <Tag color="cyan">{replayPoints.length} points</Tag>
          </div>
        </div>
      }
      open={true}
      onCancel={onClose}
      footer={null}
      width={1100}
      className="replay-modal-premium"
      destroyOnClose
      maskClosable={false}
    >
      <div className="replay-premium-container">
        {/* Carte dédiée */}
        <div className="replay-map-container">
          <MapContainer
            ref={mapRef}
            center={[replayPoints[0]?.lat || 0, replayPoints[0]?.lng || 0]}
            zoom={20}
            style={{ height: '480px', width: '100%', borderRadius: '20px' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            />
            
            {/* Trajectoire complète */}
            {replayPoints.length > 1 && (
              <Polyline
                positions={replayPoints.map(p => [p.lat, p.lng])}
                color="#3b82f6"
                weight={3}
                opacity={0.6}
                dashArray="8, 8"
              />
            )}
            
            {/* Trajectoire parcourue */}
            {currentIndex > 0 && (
              <Polyline
                positions={replayPoints.slice(0, currentIndex + 1).map(p => [p.lat, p.lng])}
                color="#10b981"
                weight={4}
                opacity={0.9}
              />
            )}
            
            {/* Position actuelle */}
            {currentPosition && (
              <Marker
                position={[currentPosition.lat, currentPosition.lng]}
                icon={createReplayIcon()}
              >
                <Popup className="replay-popup">
                  <div className="popup-content">
                    <div className="popup-title">
                      <CarOutlined /> {vehicle.name}
                    </div>
                    <div className="popup-position">
                      <VehicleAddress record={getAddressRecord(currentPosition.lat, currentPosition.lng)} />
                    </div>
                    <div className="popup-progress">
                      <Progress 
                        percent={Math.round(progress)} 
                        size="small" 
                        strokeColor="#3b82f6"
                        showInfo={false}
                      />
                      <span>{Math.round(progress)}%</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Point de départ */}
            {replayPoints[0] && (
              <Marker
                position={[replayPoints[0].lat, replayPoints[0].lng]}
                icon={createStartIcon()}
              >
                <Popup className="replay-popup">
                  <div className="popup-content">
                    <div className="popup-title">🏁 Départ</div>
                    <div className="popup-position">
                      <VehicleAddress record={getAddressRecord(replayPoints[0].lat, replayPoints[0].lng)} />
                    </div>
                    <div className="popup-time">
                      {vehicle.startTime ? new Date(vehicle.startTime).toLocaleString() : 'Non défini'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Point d'arrivée */}
            {replayPoints[replayPoints.length - 1] && (
              <Marker
                position={[replayPoints[replayPoints.length - 1].lat, replayPoints[replayPoints.length - 1].lng]}
                icon={createEndIcon()}
              >
                <Popup className="replay-popup">
                  <div className="popup-content">
                    <div className="popup-title">🎯 Destination</div>
                    <div className="popup-position">
                      <VehicleAddress record={getAddressRecord(replayPoints[replayPoints.length - 1].lat, replayPoints[replayPoints.length - 1].lng)} />
                    </div>
                    <div className="popup-destination">
                      {vehicle.destination || 'Non définie'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        
        {/* Panneau de contrôle premium */}
        <div className="replay-controls-premium">
          {/* Statistiques avancées */}
          <Row gutter={16} className="stats-row">
            <Col span={6}>
              <Card className="stat-card" size="small">
                <Statistic
                  title={<span className="stat-title"><EnvironmentOutlined /> Distance</span>}
                  value={totalDistance}
                  precision={1}
                  suffix="km"
                  valueStyle={{ color: '#3b82f6', fontSize: 20 }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card" size="small">
                <Statistic
                  title={<span className="stat-title"><ClockCircleOutlined /> Points</span>}
                  value={replayPoints.length}
                  valueStyle={{ color: '#8b5cf6', fontSize: 20 }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card" size="small">
                <Statistic
                  title={<span className="stat-title"><LineChartOutlined /> Progression</span>}
                  value={progress}
                  precision={0}
                  suffix="%"
                  valueStyle={{ color: '#10b981', fontSize: 20 }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card" size="small">
                <Statistic
                  title={<span className="stat-title"><AimOutlined /> Restant</span>}
                  value={remainingDistance}
                  precision={1}
                  suffix="km"
                  valueStyle={{ color: '#f59e0b', fontSize: 20 }}
                />
              </Card>
            </Col>
          </Row>
          
          <Divider style={{ margin: '12px 0' }} />
          
          {/* Info véhicule */}
          <div className="vehicle-info-premium">
            <div className="info-grid">
              <div className="info-item">
                <UserOutlined className="info-icon" />
                <div>
                  <span className="info-label">Chauffeur</span>
                  <span className="info-value">{vehicle.driver}</span>
                </div>
              </div>
              <div className="info-item">
                <FlagOutlined className="info-icon" />
                <div>
                  <span className="info-label">Destination</span>
                  <span className="info-value">{vehicle.destination || 'Non définie'}</span>
                </div>
              </div>
              <div className="info-item">
                <ThunderboltOutlined className="info-icon" />
                <div>
                  <span className="info-label">Efficacité</span>
                  <span className="info-value" style={{ color: vehicle.efficiency >= 70 ? '#10b981' : '#f59e0b' }}>
                    {vehicle.efficiency}%
                  </span>
                </div>
              </div>
              <div className="info-item">
                <DashboardOutlined className="info-icon" />
                <div>
                  <span className="info-label">Vitesse moy.</span>
                  <span className="info-value">{avgSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progression */}
          <div className="progress-section-premium">
            <div className="progress-header">
              <span>Progression du trajet</span>
              <Badge count={`${Math.round(progress)}%`} style={{ backgroundColor: '#3b82f6' }} />
            </div>
            <Progress 
              percent={progress} 
              strokeColor={{
                '0%': '#3b82f6',
                '100%': '#10b981',
              }}
              trailColor="#e2e8f0"
              showInfo={false}
              className="premium-progress"
            />
            <Slider 
              value={progress} 
              onChange={handleSliderChange}
              tooltip={{ formatter: (v) => `${Math.round(v)}%` }}
              className="premium-slider"
            />
          </div>
          
          {/* Boutons de contrôle */}
          <div className="controls-buttons-premium">
            <Button 
              icon={<PlayCircleOutlined />} 
              onClick={handlePlay}
              type="primary"
              disabled={isPlaying || replayPoints.length === 0}
              className="control-btn play-btn"
            >
              Lecture
            </Button>
            <Button 
              icon={<PauseCircleOutlined />} 
              onClick={handlePause}
              disabled={!isPlaying}
              className="control-btn pause-btn"
            >
              Pause
            </Button>
            <Button 
              icon={<StopOutlined />} 
              onClick={handleStop}
              disabled={progress === 0 || replayPoints.length === 0}
              className="control-btn stop-btn"
            >
              Arrêt
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                handleStop();
                setTimeout(() => handlePlay(), 100);
              }}
              disabled={replayPoints.length === 0}
              className="control-btn replay-btn"
            >
              Replay
            </Button>
          </div>
          
          {/* Timeline avec adresses */}
          <div className="timeline-section-premium">
            <Timeline>
              <Timeline.Item color="#10b981" dot={<CarOutlined />}>
                <strong>Départ</strong>
                <div className="timeline-date">
                  {vehicle.startTime ? new Date(vehicle.startTime).toLocaleString() : 'Non défini'}
                </div>
                <div className="timeline-address">
                  <VehicleAddress record={getAddressRecord(replayPoints[0]?.lat, replayPoints[0]?.lng)} />
                </div>
              </Timeline.Item>
              <Timeline.Item color="#3b82f6" dot={<EnvironmentOutlined />}>
                <strong>Position actuelle</strong>
                <div className="timeline-address">
                  <VehicleAddress record={getAddressRecord(currentPosition?.lat || 0, currentPosition?.lng || 0)} />
                </div>
                <div className="timeline-coords">
                  {currentPosition?.lat.toFixed(4)}°, {currentPosition?.lng.toFixed(4)}°
                </div>
              </Timeline.Item>
              <Timeline.Item color="#ef4444" dot={<FlagOutlined />}>
                <strong>Destination</strong>
                <div className="timeline-address">
                  <VehicleAddress record={getAddressRecord(replayPoints[replayPoints.length - 1]?.lat, replayPoints[replayPoints.length - 1]?.lng)} />
                </div>
                <div className="timeline-destination">
                  {vehicle.destination || 'Non définie'}
                </div>
              </Timeline.Item>
            </Timeline>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .modal-header-premium {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .modal-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .modal-title-accent {
          width: 4px;
          height: 24px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 2px;
        }
        
        .modal-title-text {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }
        
        .vehicle-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: #f8fafc;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          color: #0f172a;
        }
        
        .replay-premium-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .replay-map-container {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .replay-controls-premium {
          background: white;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }
        
        .stats-row {
          margin-bottom: 0;
        }
        
        .stat-card {
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        
        .stat-title {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .vehicle-info-premium {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          margin: 8px 0;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .info-icon {
          font-size: 18px;
          color: #3b82f6;
        }
        
        .info-label {
          display: block;
          font-size: 10px;
          color: #64748b;
          margin-bottom: 2px;
        }
        
        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }
        
        .current-position-card {
          background: linear-gradient(135deg, #eff6ff, #ffffff);
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 12px 16px;
          margin: 8px 0;
        }
        
        .card-title {
          font-size: 11px;
          font-weight: 600;
          color: #3b82f6;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .card-content {
          font-size: 13px;
          font-weight: 500;
          color: #0f172a;
          margin-bottom: 4px;
        }
        
        .card-coords {
          font-size: 10px;
          color: #64748b;
          font-family: monospace;
        }
        
        .progress-section-premium {
          margin: 16px 0;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
        }
        
        .controls-buttons-premium {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        
        .control-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 40px;
          padding: 8px 28px;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .play-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
        }
        
        .play-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .timeline-section-premium {
          background: #fafbfc;
          border-radius: 16px;
          padding: 16px;
          max-height: 240px;
          overflow-y: auto;
        }
        
        .timeline-address {
          font-size: 11px;
          color: #3b82f6;
          margin-top: 4px;
        }
        
        .timeline-coords {
          font-size: 10px;
          color: #94a3b8;
          font-family: monospace;
          margin-top: 2px;
        }
        
        .timeline-destination {
          font-size: 11px;
          color: #ef4444;
          margin-top: 4px;
        }
        
        .empty-state-replay {
          text-align: center;
          padding: 60px 20px;
        }
        
        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        
        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
        }
        
        .empty-description {
          font-size: 13px;
          color: #64748b;
        }
        
        .popup-content {
          padding: 12px;
          min-width: 220px;
        }
        
        .popup-title {
          font-weight: 600;
          margin-bottom: 8px;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .popup-position {
          font-size: 11px;
          color: #3b82f6;
          margin-bottom: 8px;
        }
        
        .popup-progress {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .popup-time, .popup-destination {
          font-size: 10px;
          color: #64748b;
          margin-top: 4px;
        }
        
        :global(.replay-marker-inner) {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          animation: replayPulse 0.8s infinite;
        }
        
        :global(.marker-start) {
          background: #10b981;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          font-size: 16px;
        }
        
        :global(.marker-end) {
          background: #ef4444;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          font-size: 16px;
        }
        
        @keyframes replayPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
      `}</style>
    </Modal>
  );
};