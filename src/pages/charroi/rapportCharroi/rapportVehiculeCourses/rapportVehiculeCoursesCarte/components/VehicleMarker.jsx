// components/VehicleMarker.jsx
import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { VEHICLE_STATUS, STATUS_COLORS, STATUS_LABELS } from '../constants/map.constants';
import { PremiumVehiclePopup } from './PremiumVehiclePopup';

// Création de l'icône premium
const createPremiumVehicleIcon = (vehicle, isHovered, hasMultipleVehicles, vehicleCount) => {
  const { status, speed, course, stopDurationFormatted, parkingScore } = vehicle;
  const color = STATUS_COLORS[status];
  const size = isHovered ? 48 : 40;
  
  const getHealthStatus = () => {
    if (parkingScore >= 80) return { text: 'Sain', color: '#10b981' };
    if (parkingScore >= 50) return { text: 'Attention', color: '#f59e0b' };
    return { text: 'Critique', color: '#ef4444' };
  };
  
  const health = getHealthStatus();
  
  const getVehicleShape = () => {
    if (status === VEHICLE_STATUS.MOVING) {
      return `
        <g transform="rotate(${course || 0}, 14, 14)">
          <path d="M14 2L3 24L14 19L25 24L14 2Z" fill="${color}" stroke="#1f2937" stroke-width="1.5"/>
          <circle cx="14" cy="18" r="2.5" fill="#1f2937"/>
          <circle cx="8" cy="22" r="2" fill="#1f2937"/>
          <circle cx="20" cy="22" r="2" fill="#1f2937"/>
        </g>
      `;
    } else {
      return `
        <rect x="5" y="8" width="18" height="12" rx="2" fill="${color}" stroke="#1f2937" stroke-width="1.5"/>
        <circle cx="9" cy="18" r="2.5" fill="#1f2937"/>
        <circle cx="19" cy="18" r="2.5" fill="#1f2937"/>
        <rect x="8" y="4" width="8" height="4" rx="1" fill="#3b82f6" stroke="#1f2937" stroke-width="1"/>
      `;
    }
  };
  
  return L.divIcon({
    html: `
      <div class="premium-vehicle-marker ${isHovered ? 'hovered' : ''}" data-status="${status}">
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
        
        <svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="none" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
          ${getVehicleShape()}
        </svg>
        
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
          ${status === VEHICLE_STATUS.MOVING ? '🚀' : '🅿️'}
        </div>
        
        <div class="health-indicator" style="
          position: absolute;
          bottom: -32px;
          left: 50%;
          transform: translateX(-50%);
          background: ${health.color};
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 8px;
          font-weight: bold;
          white-space: nowrap;
        ">
          ${health.text}
        </div>
        
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
          border: 1px solid rgba(255,255,255,0.2);
        ">
          ${status === VEHICLE_STATUS.MOVING ? `${Math.round(speed)} km/h` : `🕐 ${stopDurationFormatted || '0s'}`}
        </div>
        
        ${hasMultipleVehicles ? `
          <div class="multiple-badge" style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ef4444;
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
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            +${vehicleCount - 1}
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

// Tooltip Premium avec ICÔNES ANT DESIGN
const getPremiumTooltipContent = (vehicle) => {
  const statusLabel = STATUS_LABELS[vehicle.status];
  const statusColor = STATUS_COLORS[vehicle.status];
  
  const getScoreColor = () => {
    const score = vehicle.parkingScore || 100;
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    if (score >= 25) return '#f97316';
    return '#ef4444';
  };
  
  const getScoreIcon = () => {
    const score = vehicle.parkingScore || 100;
    if (score >= 80) return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.5 5H14L9.5 8L11 13L7 10L3 13L4.5 8L0 5H5.5L7 0Z" fill="#10b981"/></svg>';
    if (score >= 50) return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.5 5H14L9.5 8L11 13L7 10L3 13L4.5 8L0 5H5.5L7 0Z" fill="#f59e0b"/></svg>';
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.5 5H14L9.5 8L11 13L7 10L3 13L4.5 8L0 5H5.5L7 0Z" fill="#ef4444"/></svg>';
  };
  
  const scoreColor = getScoreColor();
  const scoreValue = vehicle.parkingScore || 100;
  const scoreIcon = getScoreIcon();
  
  let recommendationBadge = '';
  if (vehicle.recommendation && vehicle.status !== VEHICLE_STATUS.MOVING) {
    const isCritical = vehicle.recommendation.level === 'critical';
    recommendationBadge = `
      <div class="tooltip-badge ${isCritical ? 'critical' : 'warning'}">
        <span class="badge-icon">${isCritical ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>'}</span>
        <span class="badge-text">${isCritical ? 'Action requise' : 'À surveiller'}</span>
      </div>
    `;
  }
  
  return `
    <div class="premium-tooltip-card-white">
      <!-- Header -->
      <div class="tooltip-card-header-white" style="border-bottom-color: ${statusColor}20">
        <div class="header-icon-white" style="background: ${statusColor}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
            <rect x="4" y="8" width="16" height="12" rx="2"/>
            <circle cx="8" cy="17" r="2"/>
            <circle cx="16" cy="17" r="2"/>
            <rect x="7" y="4" width="10" height="4" rx="1"/>
          </svg>
        </div>
        <div class="header-info-white">
          <div class="vehicle-title-white">
            <span class="anticon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280"><rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></svg></span>
            ${vehicle.name}
          </div>
          <div class="vehicle-subtitle-white">
            <span class="anticon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280"><path d="M4 4h16v16H4z"/><path d="M8 8h8v8H8z"/></svg></span>
            ${vehicle.registration}
          </div>
        </div>
        ${recommendationBadge}
      </div>
      
      <!-- Corps -->
      <div class="tooltip-card-body-white">
        <!-- Status -->
        <div class="info-row-white">
          <div class="info-label-white">
            <span class="anticon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></span>
            <span>Statut</span>
          </div>
          <div class="info-value-white" style="color: ${statusColor}">
            <span class="status-dot-white" style="background: ${statusColor}"></span>
            ${statusLabel}
          </div>
        </div>
        
        ${vehicle.status !== VEHICLE_STATUS.MOVING ? `
          <div class="info-row-white">
            <div class="info-label-white">
              <span class="anticon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
              <span>Stationnement</span>
            </div>
            <div class="info-value-white">
              <span class="duration-highlight-white">
                <span class="anticon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
                ${vehicle.stopDurationFull || vehicle.stopDurationFormatted}
              </span>
            </div>
          </div>
        ` : `
          <div class="info-row-white">
            <div class="info-label-white">
              <span class="anticon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"/></svg></span>
              <span>Vitesse</span>
            </div>
            <div class="info-value-white">
              <span class="speed-value-white">
                <span class="anticon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></span>
                ${vehicle.speed} km/h
              </span>
            </div>
          </div>
        `}
        
        <!-- Distance -->
        <div class="info-row-white">
          <div class="info-label-white">
            <span class="anticon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 12h20M12 2v20"/><circle cx="12" cy="12" r="10"/></svg></span>
            <span>Distance totale</span>
          </div>
          <div class="info-value-white">
            <span class="distance-value">
              <span class="anticon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
              ${vehicle.totalDistance?.toFixed(1) || 0} km
            </span>
          </div>
        </div>
        
        <!-- Score -->
        <div class="score-row-white">
          <div class="score-header-white">
            <span class="score-label-white">
              <span class="score-icon">${scoreIcon}</span>
              Score performance
            </span>
            <span class="score-percent-white">${scoreValue}%</span>
          </div>
          <div class="score-bar-container-white">
            <div class="score-bar-fill-white" style="width: ${scoreValue}%; background: ${scoreColor}"></div>
          </div>
        </div>
        
        ${vehicle.recommendation && vehicle.status !== VEHICLE_STATUS.MOVING ? `
          <div class="recommendation-message-white">
            <div class="rec-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
            <div class="rec-text-white">${vehicle.recommendation.message}</div>
          </div>
        ` : ''}
      </div>
      
      <!-- Footer -->
      <div class="tooltip-card-footer-white">
        <span class="footer-icon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
        <span class="footer-text-white">
          <span class="update-icon"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 12.5A7.5 7.5 0 0 1 8 15m0 0l4-4m-4 4l4 4"/><path d="M4 11.5A7.5 7.5 0 0 1 16 9m0 0l-4 4m4-4l-4-4"/></svg></span>
          ${vehicle.lastUpdate || 'Mise à jour récente'}
        </span>
      </div>
    </div>
  `;
};

export const VehicleMarker = ({ vehicle, rawData, onHover, isHovered, hasMultipleVehicles = false, vehicleCount = 1 }) => {
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
  
  return (
    <Marker
      position={[vehicle.lat, vehicle.lng]}
      icon={createPremiumVehicleIcon(vehicle, isHovered, hasMultipleVehicles, vehicleCount)}
      eventHandlers={{
        mouseover: (e) => onHover?.(vehicle.id),
        mouseout: (e) => onHover?.(null)
      }}
    >
      <Tooltip 
        sticky 
        className="premium-tooltip-white" 
        offset={[0, -45]}
        direction="top"
      >
        <div dangerouslySetInnerHTML={{ __html: getPremiumTooltipContent(vehicle) }} />
      </Tooltip>
      
      <Popup className="premium-popup-white">
        <PremiumVehiclePopup vehicle={vehicle} addressRecord={addressRecord} />
      </Popup>
    </Marker>
  );
};