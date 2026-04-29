// components/HistoryReplay.jsx

import React, { useState, useEffect, useRef } from 'react';
import { PlayCircleOutlined, PauseCircleOutlined, StopOutlined, HistoryOutlined, ReloadOutlined } from '@ant-design/icons';
import { Modal, Slider, Button, Timeline, Tag, message, Progress } from 'antd';
import L from 'leaflet';

// Stockage global pour les éléments de replay
let replayElements = {
  polyline: null,
  marker: null,
  interval: null
};

export const HistoryReplay = ({ vehicles, onReplay, onClose, mapInstance }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [replayData, setReplayData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  
  // Nettoyer les éléments de replay
  const cleanupReplay = () => {
    if (replayElements.polyline) {
      replayElements.polyline.remove();
      replayElements.polyline = null;
    }
    if (replayElements.marker) {
      replayElements.marker.remove();
      replayElements.marker = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Initialiser le replay quand un véhicule est sélectionné
  useEffect(() => {
    if (!selectedVehicle || !mapInstance || !selectedVehicle.trajectory?.length) return;
    
    // Nettoyer l'ancien replay
    cleanupReplay();
    
    const trajectory = selectedVehicle.trajectory;
    const points = trajectory.map((pos, idx) => ({
      lat: pos[0],
      lng: pos[1],
      speed: selectedVehicle.speed || 50
    }));
    setReplayData(points);
    setProgress(0);
    setCurrentIndex(0);
    
    // Créer la trajectoire sur la carte
    const trajectoryPoints = points.map(p => [p.lat, p.lng]);
    replayElements.polyline = L.polyline(trajectoryPoints, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.8,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(mapInstance);
    
    // Créer le marqueur animé
    const markerIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(59,130,246,0.4);
          animation: replayPulse 0.8s infinite;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
      `,
      className: 'replay-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    
    replayElements.marker = L.marker([points[0].lat, points[0].lng], { icon: markerIcon }).addTo(mapInstance);
    
    // Centrer la carte sur la trajectoire
    const bounds = L.latLngBounds(trajectoryPoints);
    mapInstance.fitBounds(bounds, { padding: [50, 50] });
    
  }, [selectedVehicle, mapInstance]);
  
  // Animation du replay
  useEffect(() => {
    if (isPlaying && replayData.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= replayData.length - 1) {
            setIsPlaying(false);
            message.success('Replay terminé');
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          const newIndex = prev + 1;
          const progressPercent = (newIndex / (replayData.length - 1)) * 100;
          setProgress(progressPercent);
          
          // Mettre à jour le marqueur
          if (replayElements.marker && replayData[newIndex]) {
            replayElements.marker.setLatLng([replayData[newIndex].lat, replayData[newIndex].lng]);
            
            // Centrer sur la position
            mapInstance?.panTo([replayData[newIndex].lat, replayData[newIndex].lng], { animate: true, duration: 0.3 });
            
            onReplay?.(replayData[newIndex], progressPercent);
          }
          
          return newIndex;
        });
      }, 80);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, replayData, onReplay, mapInstance]);
  
  const handleProgressChange = (value) => {
    setProgress(value);
    const targetIndex = Math.floor((value / 100) * (replayData.length - 1));
    setCurrentIndex(targetIndex);
    
    if (replayElements.marker && replayData[targetIndex]) {
      replayElements.marker.setLatLng([replayData[targetIndex].lat, replayData[targetIndex].lng]);
      mapInstance?.panTo([replayData[targetIndex].lat, replayData[targetIndex].lng], { animate: true, duration: 0.3 });
      onReplay?.(replayData[targetIndex], value);
    }
  };
  
  const handleStop = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentIndex(0);
    if (replayElements.marker && replayData[0]) {
      replayElements.marker.setLatLng([replayData[0].lat, replayData[0].lng]);
      mapInstance?.panTo([replayData[0].lat, replayData[0].lng], { animate: true, duration: 0.3 });
    }
  };
  
  const handleClose = () => {
    cleanupReplay();
    onClose();
  };
  
  const getStatutIcon = (status) => {
    if (status === 'moving') return <Tag color="success">En marche</Tag>;
    if (status === 'stopped') return <Tag color="warning">Arrêté</Tag>;
    return <Tag color="default">Stationné</Tag>;
  };
  
  const getProgressStatus = () => {
    if (progress >= 100) return 'success';
    if (isPlaying) return 'active';
    return 'normal';
  };
  
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HistoryOutlined style={{ color: '#3b82f6' }} />
          <span>Replay Historique des trajets</span>
        </div>
      }
      open={true}
      onCancel={handleClose}
      footer={null}
      width={720}
      className="replay-modal"
      destroyOnClose
      maskClosable={false}
    >
      <div className="replay-container">
        {/* Sélection du véhicule */}
        <div className="replay-vehicle-select">
          <label>Sélectionner un véhicule</label>
          <select 
            className="vehicle-select"
            value={selectedVehicle?.id || ''}
            onChange={(e) => {
              cleanupReplay();
              const vehicle = vehicles.find(v => v.id === e.target.value);
              setSelectedVehicle(vehicle);
              setProgress(0);
              setCurrentIndex(0);
              setIsPlaying(false);
            }}
          >
            <option value="">Choisir un véhicule</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} - {v.registration}
              </option>
            ))}
          </select>
        </div>
        
        {selectedVehicle && replayData.length > 0 && (
          <>
            {/* Infos véhicule */}
            <div className="replay-vehicle-info">
              <div className="info-row">
                <div className="info-icon">🚗</div>
                <div className="info-content">
                  <div className="info-label">Véhicule</div>
                  <div className="info-value">{selectedVehicle.name}</div>
                </div>
                <div className="info-icon">📝</div>
                <div className="info-content">
                  <div className="info-label">Immatriculation</div>
                  <div className="info-value">{selectedVehicle.registration}</div>
                </div>
                {getStatutIcon(selectedVehicle.status)}
              </div>
              <div className="info-row">
                <div className="info-icon">👤</div>
                <div className="info-content">
                  <div className="info-label">Chauffeur</div>
                  <div className="info-value">{selectedVehicle.driver}</div>
                </div>
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <div className="info-label">Destination</div>
                  <div className="info-value">{selectedVehicle.destination || 'Non définie'}</div>
                </div>
              </div>
            </div>
            
            {/* Progression */}
            <div className="replay-progress-section">
              <div className="progress-header">
                <span>Progression du trajet</span>
                <span className="progress-percent">{Math.round(progress)}%</span>
              </div>
              <Progress 
                percent={progress} 
                status={getProgressStatus()}
                strokeColor="#3b82f6"
                trailColor="#e2e8f0"
              />
              <Slider 
                value={progress} 
                onChange={handleProgressChange}
                tooltip={{ formatter: (v) => `${Math.round(v)}%` }}
              />
            </div>
            
            {/* Timeline */}
            <div className="replay-timeline">
              <Timeline>
                <Timeline.Item color="green">
                  <strong>Départ</strong>
                  <div className="timeline-date">
                    {selectedVehicle.startTime ? new Date(selectedVehicle.startTime).toLocaleString() : 'Non défini'}
                  </div>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <strong>Position actuelle</strong>
                  <div className="timeline-date">
                    {replayData[currentIndex]?.lat.toFixed(4)}°, {replayData[currentIndex]?.lng.toFixed(4)}°
                  </div>
                  <div className="timeline-speed">
                    Vitesse: {Math.round(replayData[currentIndex]?.speed || 0)} km/h
                  </div>
                </Timeline.Item>
                <Timeline.Item color="gray">
                  <strong>Destination</strong>
                  <div className="timeline-date">
                    {selectedVehicle.destination || 'Non définie'}
                  </div>
                </Timeline.Item>
              </Timeline>
            </div>
            
            {/* Contrôles */}
            <div className="replay-controls">
              <Button 
                icon={<PlayCircleOutlined />} 
                onClick={() => setIsPlaying(true)}
                type="primary"
                disabled={isPlaying || progress >= 100}
                size="large"
              >
                Lecture
              </Button>
              <Button 
                icon={<PauseCircleOutlined />} 
                onClick={() => setIsPlaying(false)}
                disabled={!isPlaying}
                size="large"
              >
                Pause
              </Button>
              <Button 
                icon={<StopOutlined />} 
                onClick={handleStop}
                disabled={progress === 0}
                size="large"
              >
                Arrêt
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => {
                  handleStop();
                  setTimeout(() => setIsPlaying(true), 100);
                }}
                size="large"
              >
                Replay
              </Button>
            </div>
            
            {/* Stats */}
            <div className="replay-stats">
              <div className="stat">
                <span>📏 Distance totale</span>
                <strong>{selectedVehicle.totalDistance?.toFixed(1) || 0} km</strong>
              </div>
              <div className="stat">
                <span>⏱️ Temps estimé</span>
                <strong>{Math.floor(selectedVehicle.duree_moyenne_min / 60)}h {selectedVehicle.duree_moyenne_min % 60}min</strong>
              </div>
              <div className="stat">
                <span>📊 Efficacité</span>
                <strong style={{ color: selectedVehicle.efficiency >= 70 ? '#10b981' : '#f59e0b' }}>
                  {selectedVehicle.efficiency}%
                </strong>
              </div>
            </div>
          </>
        )}
        
        {selectedVehicle && replayData.length === 0 && (
          <div className="replay-empty">
            <span>📍 Aucune donnée de trajectoire disponible</span>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .replay-container { padding: 8px; }
        .replay-vehicle-select { margin-bottom: 20px; }
        .replay-vehicle-select label { display: block; font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 8px; }
        .vehicle-select { width: 100%; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; background: white; cursor: pointer; }
        .vehicle-select:hover { border-color: #3b82f6; }
        .replay-vehicle-info { background: #f8fafc; border-radius: 16px; padding: 16px; margin-bottom: 20px; }
        .info-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
        .info-icon { font-size: 18px; width: 32px; text-align: center; }
        .info-content { flex: 1; min-width: 120px; }
        .info-label { font-size: 10px; color: #64748b; margin-bottom: 2px; }
        .info-value { font-size: 13px; font-weight: 500; color: #0f172a; }
        .replay-progress-section { margin-bottom: 20px; }
        .progress-header { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 8px; }
        .progress-percent { font-weight: 600; color: #3b82f6; }
        .replay-timeline { margin-bottom: 20px; max-height: 220px; overflow-y: auto; padding-right: 12px; }
        .timeline-date { font-size: 11px; color: #64748b; margin-top: 2px; }
        .timeline-speed { font-size: 11px; color: #10b981; margin-top: 4px; }
        .replay-controls { display: flex; gap: 12px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap; }
        .replay-controls button { display: flex; align-items: center; gap: 8px; border-radius: 30px; padding: 8px 20px; }
        .replay-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px; background: linear-gradient(135deg, #f8fafc, #ffffff); border-radius: 16px; border: 1px solid #e2e8f0; }
        .stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .stat span { font-size: 10px; color: #64748b; }
        .stat strong { font-size: 16px; font-weight: 700; color: #0f172a; }
        .replay-empty { text-align: center; padding: 60px 20px; color: #64748b; }
        
        @keyframes replayPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
      `}</style>
    </Modal>
  );
};