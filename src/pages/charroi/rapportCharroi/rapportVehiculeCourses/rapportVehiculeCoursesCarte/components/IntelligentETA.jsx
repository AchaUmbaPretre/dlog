import React, { useMemo } from 'react';
import { ClockCircleOutlined, EnvironmentOutlined, CarOutlined, WarningOutlined } from '@ant-design/icons';

// Calcul de distance (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Calcul de l'heure estimée
const calculateETA = (currentLat, currentLng, destLat, destLng, currentSpeed, plannedDurationMinutes) => {
  if (!destLat || !destLng) return null;
  
  const distance = calculateDistance(currentLat, currentLng, destLat, destLng);
  const speed = Math.max(currentSpeed, 30); // Vitesse minimale 30 km/h
  const estimatedHours = distance / speed;
  const estimatedMinutes = estimatedHours * 60;
  
  const eta = new Date(Date.now() + estimatedHours * 3600000);
  
  // Calcul du retard (si durée prévue existe)
  let delay = null;
  let delayStatus = 'on_time';
  
  if (plannedDurationMinutes && plannedDurationMinutes > 0) {
    const plannedMinutes = plannedDurationMinutes;
    const diffMinutes = estimatedMinutes - plannedMinutes;
    
    if (diffMinutes > 30) {
      delay = Math.round(diffMinutes);
      delayStatus = 'late';
    } else if (diffMinutes < -30) {
      delay = Math.abs(Math.round(diffMinutes));
      delayStatus = 'early';
    } else {
      delayStatus = 'on_time';
    }
  }
  
  return {
    distance: distance.toFixed(1),
    estimatedHours: estimatedHours.toFixed(1),
    estimatedMinutes: Math.round(estimatedMinutes),
    etaDate: eta,
    etaFormatted: eta.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    etaFull: eta.toLocaleString('fr-FR'),
    speed,
    delay,
    delayStatus,
    isArrived: distance < 0.1 // Moins de 100 mètres
  };
};

// Composant ETA principal
export const IntelligentETA = ({ vehicle }) => {
  const etaData = useMemo(() => {
    if (!vehicle.destinationLat || !vehicle.destinationLng) return null;
    if (vehicle.speed === 0 && vehicle.status !== 'moving') return null;
    
    return calculateETA(
      vehicle.lat,
      vehicle.lng,
      vehicle.destinationLat,
      vehicle.destinationLng,
      vehicle.speed,
      vehicle.plannedDuration
    );
  }, [vehicle.lat, vehicle.lng, vehicle.speed, vehicle.destinationLat, vehicle.destinationLng, vehicle.plannedDuration]);
  
  if (!etaData) return null;
  if (etaData.isArrived) {
    return (
      <div className="eta-arrived">
        <div className="eta-icon success">✅</div>
        <div className="eta-content">
          <div className="eta-title">Destination atteinte !</div>
          <div className="eta-subtitle">Véhicule arrivé à destination</div>
        </div>
      </div>
    );
  }
  
  const getDelayColor = () => {
    if (etaData.delayStatus === 'late') return '#ef4444';
    if (etaData.delayStatus === 'early') return '#10b981';
    return '#f59e0b';
  };
  
  const getDelayIcon = () => {
    if (etaData.delayStatus === 'late') return '⚠️';
    if (etaData.delayStatus === 'early') return '⚡';
    return '✅';
  };
  
  const getDelayText = () => {
    if (etaData.delayStatus === 'late') return `Retard: +${etaData.delay} min`;
    if (etaData.delayStatus === 'early') return `Avance: -${etaData.delay} min`;
    return 'À l\'heure';
  };
  
  return (
    <div className="intelligent-eta">
      <div className="eta-header">
        <span className="eta-header-icon">📍</span>
        <span className="eta-header-title">ETA Intelligent - Destination</span>
      </div>
      
      <div className="eta-destination">
        <EnvironmentOutlined className="dest-icon" />
        <span className="dest-name">{vehicle.destination || 'Destination inconnue'}</span>
      </div>
      
      <div className="eta-stats">
        <div className="eta-stat">
          <span className="stat-icon">📏</span>
          <div>
            <div className="stat-label">Distance restante</div>
            <div className="stat-value">{etaData.distance} km</div>
          </div>
        </div>
        
        <div className="eta-stat">
          <span className="stat-icon">⏱️</span>
          <div>
            <div className="stat-label">Temps estimé</div>
            <div className="stat-value">
              {etaData.estimatedHours >= 1 
                ? `${Math.floor(etaData.estimatedHours)}h ${etaData.estimatedMinutes % 60}min`
                : `${etaData.estimatedMinutes} min`}
            </div>
          </div>
        </div>
        
        <div className="eta-stat">
          <span className="stat-icon">🕐</span>
          <div>
            <div className="stat-label">Arrivée estimée</div>
            <div className="stat-value eta-time">{etaData.etaFormatted}</div>
          </div>
        </div>
        
        <div className="eta-stat">
          <span className="stat-icon">⚡</span>
          <div>
            <div className="stat-label">Vitesse moyenne</div>
            <div className="stat-value">{Math.round(etaData.speed)} km/h</div>
          </div>
        </div>
      </div>
      
      {/* Indicateur de retard/avance */}
      <div className="eta-delay" style={{ borderLeftColor: getDelayColor() }}>
        <span className="delay-icon">{getDelayIcon()}</span>
        <span className="delay-text" style={{ color: getDelayColor() }}>{getDelayText()}</span>
      </div>
      
      {/* Barre de progression */}
      <div className="eta-progress">
        <div className="progress-label">
          <span>Progression du trajet</span>
          <span>{Math.min(100, Math.round((vehicle.totalDistance / (vehicle.totalDistance + etaData.distance)) * 100))}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min(100, Math.round((vehicle.totalDistance / (vehicle.totalDistance + etaData.distance)) * 100))}%`,
              background: 'linear-gradient(90deg, #10b981, #3b82f6)'
            }}
          />
        </div>
      </div>
      
      {/* Dernière mise à jour */}
      <div className="eta-last-update">
        <ClockCircleOutlined />
        <span>Dernière mise à jour: {vehicle.lastUpdate || 'Récente'}</span>
      </div>
    </div>
  );
};