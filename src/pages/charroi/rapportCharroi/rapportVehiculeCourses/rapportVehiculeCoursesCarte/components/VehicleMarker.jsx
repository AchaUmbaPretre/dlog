// components/VehicleMarker.jsx - Version corrigée

import React, { useState, useRef, useEffect } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { VEHICLE_STATUS, STATUS_COLORS, STATUS_ICONS, STATUS_LABELS } from '../constants/map.constants';
import { PremiumVehiclePopup } from './PremiumVehiclePopup';

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

// Calcul ETA
const calculateETA = (currentLat, currentLng, destLat, destLng, speed) => {
  if (!destLat || !destLng || speed <= 0) return null;
  const distance = calculateDistance(currentLat, currentLng, destLat, destLng);
  const timeHours = distance / speed;
  const eta = new Date(Date.now() + timeHours * 3600000);
  return { distance: distance.toFixed(1), etaFormatted: eta.toLocaleTimeString() };
};

// Création de l'icône avec rotation - CORRIGÉE
const createVehicleIcon = (vehicle, isHovered, hasMultipleVehicles, vehicleCount, isMoving, direction) => {
  const { status, speed, stopDurationFormatted, isSignalLost, batteryLevel, isEngineCut } = vehicle;
  let color = STATUS_COLORS[status];
  if (isSignalLost) color = '#dc2626';
  
  const size = isHovered ? 48 : 40;
  
  // ✅ CORRECTION: Ne pas soustraire 90° si la flèche pointe déjà vers le Nord
  // Si ta flèche pointe vers le haut (Nord), utilise direction directement
  // Si elle pointe vers la droite (Est), alors utiliser direction - 90
  const rotation = direction || 0;
  // const rotation = (direction || 0) - 90; // Décommente si ta flèche pointe vers la droite
  
  const getVehicleShape = () => `
    <g transform="rotate(${rotation}, 14, 14)">
      <path d="M14 2L3 24L14 19L25 24L14 2Z" fill="${color}" stroke="#1f2937" stroke-width="1.5"/>
      <circle cx="8" cy="22" r="2.5" fill="#1f2937"/>
      <circle cx="20" cy="22" r="2.5" fill="#1f2937"/>
      <path d="M11 14L14 9L17 14H11Z" fill="white" opacity="0.6"/>
    </g>
  `;
  
  return L.divIcon({
    html: `
      <div class="premium-vehicle-marker ${isHovered ? 'hovered' : ''}">
        <div class="marker-glow" style="position:absolute;width:${size+12}px;height:${size+12}px;left:-${size/2+6}px;top:-${size/2+6}px;background:radial-gradient(circle,${color}40 0%,transparent 70%);border-radius:50%;animation:pulse 2s infinite"></div>
        <svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="none" style="filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3))">
          ${getVehicleShape()}
        </svg>
        <div class="status-indicator" style="position:absolute;top:-12px;left:-12px;background:${color};width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)">
          ${isSignalLost ? '📡' : isEngineCut ? '🔌' : (status === VEHICLE_STATUS.MOVING ? '🚀' : '🅿️')}
        </div>
        ${batteryLevel !== undefined && batteryLevel <= 20 && !isSignalLost ? `
          <div style="position:absolute;bottom:-32px;left:50%;transform:translateX(-50%);background:${batteryLevel <= 10 ? '#ef4444' : '#f59e0b'};color:white;padding:2px 6px;border-radius:10px;font-size:8px;font-weight:bold;white-space:nowrap">🔋 ${batteryLevel}%</div>
        ` : ''}
        <div class="duration-badge" style="position:absolute;bottom:-55px;left:50%;transform:translateX(-50%);background:${color};color:white;padding:4px 10px;border-radius:16px;font-size:10px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.2)">
          ${isMoving ? `${Math.round(speed)} km/h` : `🕐 ${stopDurationFormatted || '0s'}`}
        </div>
        ${hasMultipleVehicles ? `<div style="position:absolute;top:-8px;right:-8px;background:#8b5cf6;color:white;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)">${vehicleCount}</div>` : ''}
      </div>
    `,
    className: 'premium-vehicle-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

export const VehicleMarker = ({ vehicle, rawData, onHover, isHovered, hasMultipleVehicles = false, vehicleCount = 1 }) => {
  const markerRef = useRef(null);
  const previousPosRef = useRef(null);
  const animationRef = useRef(null);
  const [currentPos, setCurrentPos] = useState([vehicle.lat, vehicle.lng]);
  const [isVehicleMoving, setIsVehicleMoving] = useState(vehicle.speed > 5);
  const [currentDirection, setCurrentDirection] = useState(vehicle.course || 0);
  
  // Animation du déplacement
  useEffect(() => {
    const newPos = [vehicle.lat, vehicle.lng];
    const oldPos = previousPosRef.current || currentPos;
    const distance = calculateDistance(oldPos[0], oldPos[1], newPos[0], newPos[1]);
    
    // Si distance trop grande (> 5km), téléporter sans animation
    if (distance > 5) {
      setCurrentPos(newPos);
      previousPosRef.current = newPos;
      if (markerRef.current) markerRef.current.setLatLng(newPos);
      return;
    }
    
    // Animation pour les petits déplacements
    if (distance > 0.01 && vehicle.speed > 5) {
      const duration = 1500;
      const startTime = performance.now();
      
      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const lat = oldPos[0] + (newPos[0] - oldPos[0]) * easeProgress;
        const lng = oldPos[1] + (newPos[1] - oldPos[1]) * easeProgress;
        
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        setCurrentPos([lat, lng]);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          previousPosRef.current = newPos;
        }
      };
      
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setCurrentPos(newPos);
      previousPosRef.current = newPos;
    }
    
    return () => { 
      if (animationRef.current) cancelAnimationFrame(animationRef.current); 
    };
  }, [vehicle.lat, vehicle.lng, vehicle.speed]);
  
  // Mise à jour de la direction
  useEffect(() => {
    // Garder la direction même à l'arrêt (dernière direction connue)
    if (vehicle.course) {
      setCurrentDirection(vehicle.course);
    }
    // Si le véhicule roule, priorité à la course actuelle
    if (vehicle.speed > 5 && vehicle.course) {
      setCurrentDirection(vehicle.course);
    }
  }, [vehicle.course, vehicle.speed]);
  
  useEffect(() => {
    setIsVehicleMoving(vehicle.speed > 5);
  }, [vehicle.speed]);
  
  // ETA si destination connue
  const eta = vehicle.destinationLat && vehicle.destinationLng && vehicle.speed > 5
    ? calculateETA(currentPos[0], currentPos[1], vehicle.destinationLat, vehicle.destinationLng, vehicle.speed)
    : null;
  
  const addressRecord = {
    capteurInfo: {
      address: vehicle.address || rawData?.capteurInfo?.address,
      time: vehicle.lastUpdate || rawData?.capteurInfo?.time,
      lat: vehicle.lat,
      lng: vehicle.lng
    },
    lat: vehicle.lat,
    lng: vehicle.lng
  };
  
  const tooltipContent = (
    <div className="premium-tooltip-card-white">
      <div className="tooltip-card-header-white" style={{ borderBottomColor: `${STATUS_COLORS[vehicle.status]}20` }}>
        <div className="header-icon-white" style={{ background: vehicle.isSignalLost ? '#dc2626' : STATUS_COLORS[vehicle.status] }}>
          {vehicle.isSignalLost ? '📡' : vehicle.isEngineCut ? '🔌' : '🚗'}
        </div>
        <div className="header-info-white">
          <div className="vehicle-title-white">{vehicle.name}</div>
          <div className="vehicle-subtitle-white">{vehicle.registration}</div>
        </div>
      </div>
      <div className="tooltip-card-body-white">
        <div className="info-row-white">
          <span>📌 Statut</span>
          <span style={{ color: vehicle.isSignalLost ? '#dc2626' : STATUS_COLORS[vehicle.status] }}>
            {vehicle.isSignalLost ? '📡 Signal perdu' : STATUS_LABELS[vehicle.status]}
          </span>
        </div>
        {isVehicleMoving ? (
          <>
            <div className="info-row-white">
              <span>⚡ Vitesse</span>
              <span>{vehicle.speed} km/h</span>
            </div>
            <div className="info-row-white">
              <span>🧭 Direction</span>
              <span>{Math.round(currentDirection)}°</span>
            </div>
          </>
        ) : (
          <div className="info-row-white">
            <span>⏱️ Stationnement</span>
            <span>{vehicle.stopDurationFull || vehicle.stopDurationFormatted}</span>
          </div>
        )}
        {eta && vehicle.destination && (
          <div className="eta-section-premium">
            <div className="eta-title">📊 ETA {vehicle.destination}</div>
            <div className="eta-details">📍 {eta.distance} km • ⏰ {eta.etaFormatted}</div>
          </div>
        )}
        <div className="info-row-white">
          <span>🕒 Mise à jour</span>
          <span>{vehicle.lastUpdate || 'Récente'}</span>
        </div>
      </div>
    </div>
  );
  
  return (
    <Marker
      ref={markerRef}
      position={currentPos}
      icon={createVehicleIcon(
        { ...vehicle, isVehicleMoving, currentDirection }, 
        isHovered, 
        hasMultipleVehicles, 
        vehicleCount, 
        isVehicleMoving, 
        currentDirection
      )}
      eventHandlers={{ 
        mouseover: () => onHover?.(vehicle.id), 
        mouseout: () => onHover?.(null) 
      }}
    >
      <Tooltip sticky className="premium-tooltip-white" offset={[0, -45]} direction="top">
        {tooltipContent}
      </Tooltip>
      <Popup className="premium-popup-white">
        <PremiumVehiclePopup vehicle={vehicle} addressRecord={addressRecord} />
      </Popup>
    </Marker>
  );
};