// components/ReplayMap.jsx - Version corrigée

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Modal, Slider, Button, Timeline, Tag, Progress, message } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, StopOutlined, ReloadOutlined } from '@ant-design/icons';
import 'leaflet/dist/leaflet.css';

// Icône personnalisée pour le replay
const createReplayIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(59,130,246,0.4);
        animation: replay-pulse 0.8s infinite;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
    `,
    className: 'replay-marker',
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
  const intervalRef = useRef(null);
  const mapRef = useRef(null);
  
  // Initialiser les points de replay
  useEffect(() => {
    console.log('=== REPLAY MAP DEBUG ===');
    console.log('Vehicle reçu:', vehicle);
    
    if (!vehicle) {
      console.log('Pas de véhicule');
      return;
    }
    
    // Chercher la trajectoire dans différentes sources
    let trajectory = vehicle.trajectory;
    
    // Si pas de trajectoire, chercher dans rawData.tail
    if ((!trajectory || trajectory.length === 0) && vehicle.rawData?.tail) {
      console.log('Utilisation de rawData.tail');
      trajectory = vehicle.rawData.tail
        .filter(point => point.lat && point.lng)
        .map(point => [parseFloat(point.lat), parseFloat(point.lng)]);
    }
    
    // Si toujours pas, chercher dans tail directement
    if ((!trajectory || trajectory.length === 0) && vehicle.tail) {
      console.log('Utilisation de vehicle.tail');
      trajectory = vehicle.tail
        .filter(point => point.lat && point.lng)
        .map(point => [parseFloat(point.lat), parseFloat(point.lng)]);
    }
    
    console.log('Trajectoire trouvée:', trajectory?.length);
    
    if (trajectory && trajectory.length > 0) {
      const points = trajectory.map((pos, idx) => ({
        lat: pos[0],
        lng: pos[1],
        id: idx,
        isStart: idx === 0,
        isEnd: idx === trajectory.length - 1
      }));
      
      console.log('Points générés:', points.length);
      setReplayPoints(points);
      setCurrentPosition(points[0]);
      setProgress(0);
      setCurrentIndex(0);
    } else {
      console.warn('Aucune trajectoire disponible pour ce véhicule');
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
            message.success('Replay terminé');
            clearInterval(intervalRef.current);
            return prev;
          }
          const newIndex = prev + 1;
          const newProgress = (newIndex / (replayPoints.length - 1)) * 100;
          setProgress(newProgress);
          setCurrentPosition(replayPoints[newIndex]);
          
          // Centrer la carte
          if (mapRef.current && replayPoints[newIndex]) {
            mapRef.current.setView([replayPoints[newIndex].lat, replayPoints[newIndex].lng], 15);
          }
          
          return newIndex;
        });
      }, 100);
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
    }
    setIsPlaying(true);
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
      mapRef.current.setView([replayPoints[0].lat, replayPoints[0].lng], 15);
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
  
  if (!vehicle) return null;
  
  // Si pas de points de replay, afficher un message
  if (replayPoints.length === 0) {
    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 4, height: 24, background: '#3b82f6', borderRadius: 2 }} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>Replay: {vehicle.name}</span>
            <Tag color="blue">{vehicle.registration}</Tag>
          </div>
        }
        open={true}
        onCancel={onClose}
        footer={null}
        width={500}
        className="replay-modal-premium"
      >
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Aucune trajectoire disponible</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Ce véhicule n'a pas de données de trajectoire enregistrées.
          </div>
        </div>
      </Modal>
    );
  }
  
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 4, height: 24, background: '#3b82f6', borderRadius: 2 }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>Replay: {vehicle.name}</span>
          <Tag color="blue">{vehicle.registration}</Tag>
          <Tag color="green">{replayPoints.length} points</Tag>
        </div>
      }
      open={true}
      onCancel={onClose}
      footer={null}
      width={950}
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
            zoom={13}
            style={{ height: '450px', width: '100%', borderRadius: '16px' }}
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
                opacity={0.7}
                dashArray="5, 10"
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
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <strong>{vehicle.name}</strong>
                    <br />
                    Position: {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
                    <br />
                    Progression: {Math.round(progress)}%
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Points de départ et d'arrivée */}
            {replayPoints[0] && (
              <Marker
                position={[replayPoints[0].lat, replayPoints[0].lng]}
                icon={L.divIcon({
                  html: `<div style="background: #10b981; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-size: 14px;">🏁</div>`,
                  iconSize: [28, 28],
                  iconAnchor: [14, 14]
                })}
              >
                <Popup>🚗 Départ</Popup>
              </Marker>
            )}
            
            {replayPoints[replayPoints.length - 1] && (
              <Marker
                position={[replayPoints[replayPoints.length - 1].lat, replayPoints[replayPoints.length - 1].lng]}
                icon={L.divIcon({
                  html: `<div style="background: #ef4444; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-size: 14px;">🎯</div>`,
                  iconSize: [28, 28],
                  iconAnchor: [14, 14]
                })}
              >
                <Popup>📍 Destination</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        
        {/* Contrôles */}
        <div className="replay-controls-premium">
          <div className="replay-info">
            <div className="info-card">
              <span className="info-label">Chauffeur</span>
              <span className="info-value">{vehicle.driver}</span>
            </div>
            <div className="info-card">
              <span className="info-label">Destination</span>
              <span className="info-value">{vehicle.destination || 'Non définie'}</span>
            </div>
            <div className="info-card">
              <span className="info-label">Distance totale</span>
              <span className="info-value">{vehicle.totalDistance?.toFixed(1) || 0} km</span>
            </div>
            <div className="info-card">
              <span className="info-label">Efficacité</span>
              <span className="info-value" style={{ color: vehicle.efficiency >= 70 ? '#10b981' : '#f59e0b' }}>
                {vehicle.efficiency}%
              </span>
            </div>
          </div>
          
          <div className="progress-section">
            <div className="progress-header">
              <span>Progression du trajet ({replayPoints.length} points)</span>
              <span className="progress-percent">{Math.round(progress)}%</span>
            </div>
            <Progress 
              percent={progress} 
              strokeColor="#3b82f6"
              trailColor="#e2e8f0"
              showInfo={false}
            />
            <Slider 
              value={progress} 
              onChange={handleSliderChange}
              tooltip={{ formatter: (v) => `${Math.round(v)}%` }}
            />
          </div>
          
          <div className="controls-buttons">
            <Button 
              icon={<PlayCircleOutlined />} 
              onClick={handlePlay}
              type="primary"
              disabled={isPlaying || replayPoints.length === 0}
              size="large"
            >
              Lecture
            </Button>
            <Button 
              icon={<PauseCircleOutlined />} 
              onClick={handlePause}
              disabled={!isPlaying}
              size="large"
            >
              Pause
            </Button>
            <Button 
              icon={<StopOutlined />} 
              onClick={handleStop}
              disabled={progress === 0 || replayPoints.length === 0}
              size="large"
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
              size="large"
            >
              Replay
            </Button>
          </div>
          
          <div className="timeline-section">
            <Timeline>
              <Timeline.Item color="green">
                <strong>Départ</strong>
                <div className="timeline-date">
                  {vehicle.startTime ? new Date(vehicle.startTime).toLocaleString() : 'Non défini'}
                </div>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <strong>Trajet en cours</strong>
                <div className="timeline-date">
                  Position actuelle: {currentPosition?.lat.toFixed(4)}°, {currentPosition?.lng.toFixed(4)}°
                </div>
              </Timeline.Item>
              <Timeline.Item color="gray">
                <strong>Destination</strong>
                <div className="timeline-date">
                  {vehicle.destination || 'Non définie'}
                </div>
              </Timeline.Item>
            </Timeline>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .replay-premium-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .replay-map-container {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .replay-controls-premium {
          background: #f8fafc;
          border-radius: 16px;
          padding: 20px;
        }
        
        .replay-info {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .info-card {
          background: white;
          padding: 12px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        
        .info-label {
          display: block;
          font-size: 10px;
          color: #64748b;
          margin-bottom: 4px;
        }
        
        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }
        
        .progress-section {
          margin-bottom: 20px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
        }
        
        .progress-percent {
          font-weight: 600;
          color: #3b82f6;
        }
        
        .controls-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .controls-buttons button {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 30px;
          padding: 8px 24px;
        }
        
        .timeline-section {
          background: white;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .timeline-date {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
        }
        
        @keyframes replay-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
      `}</style>
    </Modal>
  );
};