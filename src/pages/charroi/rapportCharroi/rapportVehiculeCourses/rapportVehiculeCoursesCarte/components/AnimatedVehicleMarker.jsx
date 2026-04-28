// components/AnimatedVehicleMarker.jsx

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { VEHICLE_STATUS, STATUS_COLORS, STATUS_ICONS, STATUS_LABELS } from '../constants/map.constants';
import { PremiumVehiclePopup } from './PremiumVehiclePopup';

// Calcul de distance entre deux points (formule Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Calcul de l'ETA
const calculateETA = (currentLat, currentLng, destLat, destLng, speed) => {
  if (!destLat || !destLng || speed <= 0) return null;
  
  const distance = calculateDistance(currentLat, currentLng, destLat, destLng);
  const timeHours = distance / speed;
  const eta = new Date(Date.now() + timeHours * 3600000);
  
  return {
    distance: distance.toFixed(1),
    eta: eta,
    etaFormatted: eta.toLocaleTimeString(),
    hours: Math.floor(timeHours),
    minutes: Math.floor((timeHours % 1) * 60),
    isDelayed: timeHours > (vehicle.plannedDuration || 0)
  };
};

// Création de l'icône avec rotation et indicateurs
const createAnimatedVehicleIcon = (vehicle, isHovered, hasMultipleVehicles, vehicleCount, isMoving, direction, batteryLevel, isEngineCut, isSignalLost) => {
  const { status } = vehicle;
  let color = STATUS_COLORS[status];
  
  // Si signal perdu, forcer couleur rouge
  if (isSignalLost) color = '#dc2626';
  
  const size = isHovered ? 48 : 40;
  
  // Déterminer la rotation
  let rotation = direction || 0;
  if (!isMoving) {
    rotation = vehicle.lastKnownCourse || direction || 0;
  }
  
  // Correction si l'icône pointe vers la droite par défaut
  // Si ton icône pointe vers le Nord (haut), utilise rotation
  // Si elle pointe vers l'Est (droite), utilise rotation - 90
  const finalRotation = rotation - 90; // Ajuste selon ton icône
  
  // Icône de statut
  const getStatusIcon = () => {
    if (isSignalLost) return '📡';
    if (isEngineCut) return '🔌';
    if (batteryLevel !== undefined && batteryLevel <= 10) return '🔋';
    if (status === VEHICLE_STATUS.MOVING) return '🚀';
    if (status === VEHICLE_STATUS.STOPPED) return '⏸️';
    return '🅿️';
  };
  
  const getVehicleShape = () => {
    return `
      <g transform="rotate(${finalRotation}, 14, 14)">
        <!-- Corps du véhicule -->
        <path d="M14 2L3 24L14 19L25 24L14 2Z" fill="${color}" stroke="#1f2937" stroke-width="1.5"/>
        <!-- Roues -->
        <circle cx="8" cy="22" r="2.5" fill="#1f2937"/>
        <circle cx="20" cy="22" r="2.5" fill="#1f2937"/>
        <!-- Fenêtre -->
        <path d="M11 14L14 9L17 14H11Z" fill="white" opacity="0.6"/>
      </g>
    `;
  };
  
  return L.divIcon({
    html: `
      <div class="premium-vehicle-marker ${isHovered ? 'hovered' : ''}" data-status="${status}">
        <!-- Glow effect -->
        <div class="marker-glow" style="
          position: absolute;
          width: ${size + 12}px;
          height: ${size + 12}px;
          left: -${size/2 + 6}px;
          top: -${size/2 + 6}px;
          background: radial-gradient(circle, ${color}60 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
        
        <!-- SVG du véhicule -->
        <svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="none">
          ${getVehicleShape()}
        </svg>
        
        <!-- Badge de statut -->
        <div class="status-indicator" style="
          position: absolute;
          top: -12px;
          left: -12px;
          background: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          ${getStatusIcon()}
        </div>
        
        <!-- Indicateur batterie -->
        ${batteryLevel !== undefined && batteryLevel <= 20 && !isSignalLost ? `
          <div class="battery-warning" style="
            position: absolute;
            bottom: -32px;
            left: 50%;
            transform: translateX(-50%);
            background: ${batteryLevel <= 10 ? '#ef4444' : '#f59e0b'};
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
            white-space: nowrap;
          ">
            🔋 ${batteryLevel}%
          </div>
        ` : ''}
        
        <!-- Indicateur coupure batterie -->
        ${isEngineCut && !isSignalLost ? `
          <div class="engine-cut-warning" style="
            position: absolute;
            bottom: -32px;
            left: 50%;
            transform: translateX(-50%);
            background: #dc2626;
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
            white-space: nowrap;
          ">
            🔌 Coupe-batterie
          </div>
        ` : ''}
        
        <!-- Badge vitesse/durée -->
        <div class="duration-badge" style="
          position: absolute;
          bottom: -55px;
          left: 50%;
          transform: translateX(-50%);
          background: ${color};
          color: white;
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        ">
          ${isMoving ? `${Math.round(vehicle.speed)} km/h` : `🕐 ${vehicle.stopDurationFormatted || '0s'}`}
        </div>
        
        ${hasMultipleVehicles ? `
          <div class="multiple-badge" style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #8b5cf6;
            color: white;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
            border: 2px solid white;
          ">
            ${vehicleCount}
          </div>
        ` : ''}
      </div>
    `,
    className: 'premium-vehicle-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// Composant principal avec animation
export const AnimatedVehicleMarker = ({ vehicle, rawData, onHover, isHovered, hasMultipleVehicles = false, vehicleCount = 1 }) => {
  const markerRef = useRef(null);
  const previousPosRef = useRef(null);
  const animationRef = useRef(null);
  const [currentPos, setCurrentPos] = useState([vehicle.lat, vehicle.lng]);
  const [isMoving, setIsMoving] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(vehicle.course || 0);
  
  const isVehicleMoving = vehicle.speed > 5;
  const isSignalLost = vehicle.isSignalLost || false;
  const batteryLevel = vehicle.batteryLevel;
  const isEngineCut = vehicle.isEngineCut || false;
  
  // Animation du déplacement
  useEffect(() => {
    const newPos = [vehicle.lat, vehicle.lng];
    const oldPos = previousPosRef.current || currentPos;
    
    // Calculer la distance en km
    const distance = calculateDistance(oldPos[0], oldPos[1], newPos[0], newPos[1]);
    
    // Si distance > 5km, téléporter sans animation
    if (distance > 5) {
      setCurrentPos(newPos);
      previousPosRef.current = newPos;
      if (markerRef.current) {
        markerRef.current.setLatLng(newPos);
      }
      setIsMoving(false);
      return;
    }
    
    // Animation pour les petits déplacements
    if (distance > 0.01 && isVehicleMoving) {
      setIsMoving(true);
      const duration = 1500; // 1.5 secondes
      const startTime = performance.now();
      
      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        // Easing cubic pour un mouvement fluide
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const lat = oldPos[0] + (newPos[0] - oldPos[0]) * easeProgress;
        const lng = oldPos[1] + (newPos[1] - oldPos[1]) * easeProgress;
        
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          setCurrentPos([lat, lng]);
        }
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          previousPosRef.current = newPos;
          setCurrentPos(newPos);
          setIsMoving(false);
        }
      };
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setCurrentPos(newPos);
      previousPosRef.current = newPos;
      setIsMoving(false);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [vehicle.lat, vehicle.lng, isVehicleMoving]);
  
  // Mise à jour de la direction
  useEffect(() => {
    if (isVehicleMoving && vehicle.course) {
      setCurrentDirection(vehicle.course);
    }
  }, [vehicle.course, isVehicleMoving]);
  
  // Calcul de l'ETA si destination connue
  const eta = useCallback(() => {
    if (!vehicle.destinationLat || !vehicle.destinationLng || !isVehicleMoving) return null;
    return calculateETA(currentPos[0], currentPos[1], vehicle.destinationLat, vehicle.destinationLng, vehicle.speed);
  }, [currentPos, vehicle.destinationLat, vehicle.destinationLng, vehicle.speed, isVehicleMoving]);
  
  const etaData = eta();
  
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
  
  // Tooltip premium avec ETA
  const tooltipContent = (
    <div className="premium-tooltip-card-white">
      <div className="tooltip-card-header-white" style={{ borderBottomColor: `${STATUS_COLORS[vehicle.status]}20` }}>
        <div className="header-icon-white" style={{ background: isSignalLost ? '#dc2626' : STATUS_COLORS[vehicle.status] }}>
          {isSignalLost ? '📡' : isEngineCut ? '🔌' : '🚗'}
        </div>
        <div className="header-info-white">
          <div className="vehicle-title-white">{vehicle.name}</div>
          <div className="vehicle-subtitle-white">{vehicle.registration}</div>
        </div>
      </div>
      
      <div className="tooltip-card-body-white">
        <div className="info-row-white">
          <span>📌 Statut</span>
          <span style={{ color: isSignalLost ? '#dc2626' : STATUS_COLORS[vehicle.status] }}>
            {isSignalLost ? '📡 Signal perdu' : STATUS_LABELS[vehicle.status]}
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
        
        {/* Section ETA intelligente */}
        {etaData && vehicle.destination && (
          <div className="eta-section-premium">
            <div className="eta-title">📊 ETA Destination</div>
            <div className="eta-destination">{vehicle.destination}</div>
            <div className="eta-details">
              <div>📍 Distance: {etaData.distance} km</div>
              <div>⏰ Arrivée estimée: {etaData.etaFormatted}</div>
              <div>🕐 Temps restant: {etaData.hours}h {etaData.minutes}min</div>
              {etaData.isDelayed && <div className="eta-delayed">⚠️ Retard estimé</div>}
            </div>
          </div>
        )}
        
        {/* Indicateurs techniques */}
        {(batteryLevel !== undefined || isEngineCut || isSignalLost) && (
          <div className="technical-info">
            {batteryLevel !== undefined && !isSignalLost && (
              <div className={`battery-info ${batteryLevel <= 10 ? 'critical' : batteryLevel <= 20 ? 'low' : ''}`}>
                🔋 Batterie: {batteryLevel}%
              </div>
            )}
            {isEngineCut && !isSignalLost && (
              <div className="engine-cut-info">🔌 Coupe-batterie activée</div>
            )}
            {isSignalLost && (
              <div className="signal-lost-info">
                📡 Dernier signal: {vehicle.lastUpdate || 'inconnu'}
              </div>
            )}
          </div>
        )}
        
        <div className="info-row-white">
          <span>🕒 Dernière MAJ</span>
          <span>{vehicle.lastUpdate || 'Récente'}</span>
        </div>
      </div>
    </div>
  );
  
  return (
    <Marker
      ref={markerRef}
      position={currentPos}
      icon={createAnimatedVehicleIcon(
        vehicle, isHovered, hasMultipleVehicles, vehicleCount,
        isVehicleMoving, currentDirection, batteryLevel, isEngineCut, isSignalLost
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