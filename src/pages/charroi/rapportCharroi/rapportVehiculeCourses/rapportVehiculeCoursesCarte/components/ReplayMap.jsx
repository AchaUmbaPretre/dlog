// components/ReplayMap.jsx - Version avec overlay transparent premium

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Modal, Button, Tag, Progress, message, Slider } from 'antd';
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
  LineChartOutlined,
  AimOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  CompassOutlined,
  CloseOutlined
} from '@ant-design/icons';
import 'leaflet/dist/leaflet.css';
import { VehicleAddress } from '../../../../../../utils/vehicleAddress';

// Icônes simples et fiables
const createReplayIcon = () => {
  return L.divIcon({
    html: `<div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"><span style="color:white; font-size:14px;">▶</span></div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const createStartIcon = () => {
  return L.divIcon({
    html: `<div style="background: #10b981; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-size: 16px;">🏁</div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const createEndIcon = () => {
  return L.divIcon({
    html: `<div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-size: 16px;">🎯</div>`,
    className: 'custom-marker',
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
  
  const getAddressRecord = (lat, lng) => ({ 
    lat, 
    lng, 
    capteurInfo: { lat, lng, address: null } 
  });
  
  // Initialisation des points de trajectoire
  useEffect(() => {
    if (!vehicle) return;
    
    console.log('=== REPLAY MAP ===');
    console.log('Véhicule:', vehicle.name);
    
    let trajectory = [];
    
    if (vehicle.trajectory && vehicle.trajectory.length > 0) {
      trajectory = vehicle.trajectory;
      console.log('Trajectoire trouvée dans vehicle.trajectory:', trajectory.length);
    } 
    else if (vehicle.rawData?.tail && vehicle.rawData.tail.length > 0) {
      trajectory = vehicle.rawData.tail
        .filter(point => point.lat && point.lng)
        .map(point => [parseFloat(point.lat), parseFloat(point.lng)]);
      console.log('Trajectoire trouvée dans rawData.tail:', trajectory.length);
    }
    else if (vehicle.tail && vehicle.tail.length > 0) {
      trajectory = vehicle.tail
        .filter(point => point.lat && point.lng)
        .map(point => [parseFloat(point.lat), parseFloat(point.lng)]);
      console.log('Trajectoire trouvée dans vehicle.tail:', trajectory.length);
    }
    
    if (trajectory.length > 0) {
      const points = trajectory.map((pos, idx) => ({ 
        lat: pos[0], 
        lng: pos[1], 
        id: idx 
      }));
      setReplayPoints(points);
      setCurrentPosition(points[0]);
      setProgress(0);
      setCurrentIndex(0);
    } else {
      console.warn('Aucune trajectoire trouvée pour ce véhicule');
      message.warning('Ce véhicule n\'a pas de données de trajectoire');
    }
  }, [vehicle]);
  
  // Centrage automatique de la carte
  useEffect(() => {
    if (mapRef.current && replayPoints.length > 0) {
      setTimeout(() => {
        const bounds = L.latLngBounds(replayPoints.map(p => [p.lat, p.lng]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }, 200);
    }
  }, [replayPoints]);
  
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
        mapRef.current.setView([replayPoints[0].lat, replayPoints[0].lng], 14);
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
      const bounds = L.latLngBounds(replayPoints.map(p => [p.lat, p.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
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
  
  // Calcul des statistiques
  const stats = useMemo(() => {
    if (replayPoints.length === 0) return { totalDistance: 0, totalPoints: 0 };
    
    let totalDistance = 0;
    for (let i = 1; i < replayPoints.length; i++) {
      const prev = replayPoints[i - 1];
      const curr = replayPoints[i];
      const R = 6371;
      const dLat = (curr.lat - prev.lat) * Math.PI / 180;
      const dLon = (curr.lng - prev.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(prev.lat * Math.PI/180) * Math.cos(curr.lat * Math.PI/180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      totalDistance += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    
    return {
      totalDistance: totalDistance.toFixed(1),
      totalPoints: replayPoints.length
    };
  }, [replayPoints]);
  
  if (!vehicle) return null;
  
  if (replayPoints.length === 0) {
    return (
      <Modal
        open={true}
        onCancel={onClose}
        footer={null}
        width={500}
        closable={false}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Aucune trajectoire disponible</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Ce véhicule n'a pas de données de trajectoire enregistrées.
          </div>
        </div>
      </Modal>
    );
  }
  
  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      width={1100}
      destroyOnClose
      closable={false}
      className="replay-modal-fixed"
      bodyStyle={{ padding: 0 }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 20px', 
        background: '#f8fafc', 
        borderBottom: '1px solid #e2e8f0' 
      }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 600 }}>{vehicle.name}</h2>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Tag icon={<CarOutlined />}>{vehicle.registration}</Tag>
            <Tag icon={<UserOutlined />}>{vehicle.driver?.split(' ')[0]}</Tag>
            <Tag icon={<FlagOutlined />}>{vehicle.destination?.split(',')[0] || 'Trajet'}</Tag>
          </div>
        </div>
        <button 
          onClick={onClose} 
          style={{ 
            width: 32, 
            height: 32, 
            background: 'white', 
            border: '1px solid #e2e8f0', 
            borderRadius: '50%', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CloseOutlined />
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: 24, padding: 24 }}>
        {/* Carte */}
        <div style={{ flex: 2, position: 'relative' }}>
          {/* Toolbar */}
          <div style={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            zIndex: 1000, 
            display: 'flex', 
            gap: 6, 
            background: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)',
            padding: '6px 10px', 
            borderRadius: 30, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }}>
            <button 
              onClick={() => mapRef.current?.zoomIn()} 
              style={{ width: 28, height: 28, background: '#f8fafc', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
            >
              <ZoomInOutlined />
            </button>
            <button 
              onClick={() => mapRef.current?.zoomOut()} 
              style={{ width: 28, height: 28, background: '#f8fafc', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
            >
              <ZoomOutOutlined />
            </button>
            <button 
              onClick={() => { 
                if (replayPoints.length) { 
                  const bounds = L.latLngBounds(replayPoints.map(p => [p.lat, p.lng])); 
                  mapRef.current?.fitBounds(bounds, { padding: [50, 50] }); 
                } 
              }} 
              style={{ width: 28, height: 28, background: '#f8fafc', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
            >
              <CompassOutlined />
            </button>
          </div>
          
          {/* Map Container */}
          <div style={{ height: 450, width: '100%', borderRadius: 16, overflow: 'hidden', background: '#f1f5f9' }}>
            <MapContainer
              ref={mapRef}
              center={[-4.358313, 15.348934]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              
              {replayPoints.length > 1 && (
                <>
                  <Polyline
                    positions={replayPoints.map(p => [p.lat, p.lng])}
                    color="#cbd5e1"
                    weight={3}
                    opacity={0.6}
                    dashArray="8, 8"
                  />
                  {currentIndex > 0 && (
                    <Polyline
                      positions={replayPoints.slice(0, currentIndex + 1).map(p => [p.lat, p.lng])}
                      color="#3b82f6"
                      weight={4}
                      opacity={0.9}
                    />
                  )}
                </>
              )}
              
              {currentPosition && <Marker position={[currentPosition.lat, currentPosition.lng]} icon={createReplayIcon()} />}
              {replayPoints[0] && <Marker position={[replayPoints[0].lat, replayPoints[0].lng]} icon={createStartIcon()} />}
              {replayPoints[replayPoints.length - 1] && <Marker position={[replayPoints[replayPoints.length - 1].lat, replayPoints[replayPoints.length - 1].lng]} icon={createEndIcon()} />}
            </MapContainer>
          </div>
          
          {/* Progression overlay - VERSION TRANSPARENTE PREMIUM */}
          <div style={{ 
            position: 'absolute', 
            bottom: 16, 
            left: 16, 
            right: 16, 
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: 16, 
            padding: '12px 18px', 
            zIndex: 1000,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'white', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LineChartOutlined style={{ fontSize: 12 }} />
                </div>
                {stats.totalDistance} km
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AimOutlined style={{ fontSize: 12 }} />
                </div>
                {stats.totalPoints} pts
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClockCircleOutlined style={{ fontSize: 12 }} />
                </div>
                {Math.round(progress)}%
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: 4, transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
        
        {/* Panneau de contrôle */}
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stats cards */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              padding: 14, 
              background: '#f8fafc', 
              borderRadius: 16, 
              border: '1px solid #eef2ff',
              transition: 'all 0.2s'
            }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 14, 
                background: '#eff6ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#3b82f6', 
                fontSize: 20 
              }}>
                <LineChartOutlined />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>Distance</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{stats.totalDistance} km</span>
              </div>
            </div>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              padding: 14, 
              background: '#f8fafc', 
              borderRadius: 16, 
              border: '1px solid #eef2ff',
              transition: 'all 0.2s'
            }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 14, 
                background: '#f5f3ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#8b5cf6', 
                fontSize: 20 
              }}>
                <ClockCircleOutlined />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>Points</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{stats.totalPoints}</span>
              </div>
            </div>
          </div>
          
          {/* Positions */}
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 16, border: '1px solid #eef2ff' }}>
            <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #eef2ff' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏁</div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 10, color: '#64748b', marginBottom: 2 }}>Départ</label>
                <VehicleAddress record={getAddressRecord(replayPoints[0]?.lat, replayPoints[0]?.lng)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #eef2ff' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📍</div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 10, color: '#64748b', marginBottom: 2 }}>Position actuelle</label>
                <VehicleAddress record={getAddressRecord(currentPosition?.lat || 0, currentPosition?.lng || 0)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: '10px 0' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎯</div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 10, color: '#64748b', marginBottom: 2 }}>Destination</label>
                <VehicleAddress record={getAddressRecord(replayPoints[replayPoints.length - 1]?.lat, replayPoints[replayPoints.length - 1]?.lng)} />
              </div>
            </div>
          </div>
          
          {/* Contrôles */}
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 16, border: '1px solid #eef2ff' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <Button icon={<PlayCircleOutlined />} onClick={handlePlay} type="primary" disabled={isPlaying} style={{ flex: 1, height: 40 }}>Lecture</Button>
              <Button icon={<PauseCircleOutlined />} onClick={handlePause} disabled={!isPlaying} style={{ flex: 1, height: 40 }}>Pause</Button>
              <Button icon={<StopOutlined />} onClick={handleStop} style={{ flex: 1, height: 40 }}>Arrêt</Button>
              <Button icon={<ReloadOutlined />} onClick={() => { handleStop(); setTimeout(() => handlePlay(), 100); }} style={{ flex: 1, height: 40 }}>Replay</Button>
            </div>
            <Slider 
              value={progress} 
              onChange={handleSliderChange}
              tooltip={{ formatter: (v) => `${Math.round(v)}%` }}
            />
          </div>
        </div>
      </div>
      
      <style>{`
        .replay-modal-fixed .ant-modal-content {
          background: #ffffff;
          border-radius: 24px;
          padding: 0;
          overflow: hidden;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          background: #f1f5f9;
          width: 100%;
          height: 100%;
        }
        .ant-slider-track {
          background-color: #3b82f6;
        }
        .ant-slider-handle {
          border-color: #3b82f6;
        }
        .ant-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
        }
        .ant-btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transform: translateY(-1px);
        }
        .ant-btn {
          transition: all 0.2s;
        }
        .ant-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </Modal>
  );
};