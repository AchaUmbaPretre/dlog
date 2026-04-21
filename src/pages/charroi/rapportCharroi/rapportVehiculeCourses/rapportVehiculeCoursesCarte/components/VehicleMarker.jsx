import React, { useState } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { VEHICLE_STATUS, STATUS_COLORS, STATUS_ICONS } from '../constants/map.constants';
import 'leaflet-rotatedmarker';
import { VehicleAddress } from '../../../../../../utils/vehicleAddress';

// Fonction pour créer l'icône avancée
const createAdvancedVehicleIcon = (status, speed, course, isHovered = false, hasMultipleVehicles = false, vehicleCount = 1) => {
  const color = STATUS_COLORS[status] || STATUS_COLORS[VEHICLE_STATUS.STOPPED];
  const size = isHovered ? 44 : 36;
  
  // Déterminer l'icône en fonction du statut
  const getVehicleShape = () => {
    if (status === VEHICLE_STATUS.MOVING) {
      // Flèche directionnelle pour véhicule en mouvement
      return `
        <g transform="rotate(${course || 0}, 12, 12)">
          <path d="M12 2L2 22L12 18L22 22L12 2Z" fill="${color}" stroke="#1f2937" stroke-width="1.5"/>
          <circle cx="12" cy="16" r="2" fill="#1f2937"/>
        </g>
      `;
    } else {
      // Icône standard pour véhicule à l'arrêt
      return `
        <path d="M5 13L3 17H21L19 13H5Z" fill="${color}" stroke="#1f2937" stroke-width="1.5"/>
        <circle cx="7.5" cy="16.5" r="1.5" fill="#1f2937"/>
        <circle cx="16.5" cy="16.5" r="1.5" fill="#1f2937"/>
        <rect x="6" y="8" width="12" height="5" rx="1" fill="#3b82f6" stroke="#1f2937" stroke-width="1"/>
      `;
    }
  };
  
  return L.divIcon({
    html: `
      <div class="premium-vehicle-marker ${isHovered ? 'hovered' : ''}" data-status="${status}">
        <div class="marker-glow" style="
          position: absolute;
          width: ${size + 8}px;
          height: ${size + 8}px;
          left: -${size/2 + 4}px;
          top: -${size/2 + 4}px;
          background: radial-gradient(circle, ${color}40 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
          ${getVehicleShape()}
        </svg>
        <div class="vehicle-speed-badge" style="
          position: absolute;
          bottom: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: ${status === VEHICLE_STATUS.MOVING ? '#10b981' : '#1f2937'};
          color: white;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          ${speed > 0 ? `${Math.round(speed)} km/h` : 'Arrêté'}
        </div>
        ${hasMultipleVehicles ? `
          <div class="multiple-badge" style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ef4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            border: 2px solid white;
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

// Composant Popup Premium
const PremiumVehiclePopup = ({ vehicle, addressRecord }) => {
  const [activeTab, setActiveTab] = useState('info');
  
  const tabs = [
    { id: 'info', label: '📋 Infos' },
    { id: 'stats', label: '📊 Stats' }
  ];
  
  return (
    <div className="premium-popup-content" style={{ minWidth: 280 }}>
      <div style={{
        padding: '12px',
        borderBottom: `2px solid ${STATUS_COLORS[vehicle.status]}`,
        marginBottom: 8
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>{vehicle.name}</h3>
          <span style={{
            padding: '2px 8px',
            borderRadius: 12,
            fontSize: 10,
            background: STATUS_COLORS[vehicle.status],
            color: 'white'
          }}>
            {STATUS_ICONS[vehicle.status]} {vehicle.status === VEHICLE_STATUS.MOVING ? 'En route' : 'Stationné'}
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{vehicle.registration}</div>
      </div>
      
      <div style={{ display: 'flex', gap: 4, padding: '0 12px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '6px',
              background: activeTab === tab.id ? '#3b82f6' : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 11,
              color: activeTab === tab.id ? 'white' : '#6b7280'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div style={{ padding: '12px' }}>
        {activeTab === 'info' && (
          <>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: '#6b7280' }}>📍 Position</div>
              <VehicleAddress record={addressRecord} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: '#6b7280' }}>👤 Chauffeur</div>
              <div style={{ fontSize: 12 }}>{vehicle.driver}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: '#6b7280' }}>📍 Destination</div>
              <div style={{ fontSize: 12 }}>{vehicle.destination || 'Non définie'}</div>
            </div>
            {vehicle.comment && (
              <div>
                <div style={{ fontSize: 10, color: '#6b7280' }}>💬 Commentaire</div>
                <div style={{ fontSize: 11 }}>{vehicle.comment}</div>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'stats' && (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#6b7280' }}>⚡ Vitesse</div>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>{vehicle.speed} <span style={{ fontSize: 11 }}>km/h</span></div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#6b7280' }}>📊 Efficacité</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${vehicle.efficiency}%`, height: '100%', background: '#10b981' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 'bold' }}>{vehicle.efficiency}%</span>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#6b7280' }}>⏸️ Temps d'arrêt</div>
              <div style={{ fontSize: 12 }}>{vehicle.stopDurationFormatted}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#6b7280' }}>📏 Distance totale</div>
              <div style={{ fontSize: 12 }}>{vehicle.totalDistance.toFixed(1)} km</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Composant VehicleMarker principal
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
      icon={createAdvancedVehicleIcon(vehicle.status, vehicle.speed, vehicle.course, isHovered, hasMultipleVehicles, vehicleCount)}
      eventHandlers={{
        mouseover: () => onHover?.(vehicle.id),
        mouseout: () => onHover?.(null)
      }}
    >
      <Tooltip sticky className="premium-tooltip">
        <div style={{ padding: '4px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <strong>{vehicle.name}</strong>
            <span style={{ fontSize: 10, color: '#6b7280' }}>{vehicle.registration}</span>
          </div>
          <div style={{ fontSize: 11, color: '#10b981' }}>⚡ {vehicle.speed} km/h</div>
        </div>
      </Tooltip>
      
      <Popup className="premium-popup">
        <PremiumVehiclePopup vehicle={vehicle} addressRecord={addressRecord} />
      </Popup>
    </Marker>
  );
};