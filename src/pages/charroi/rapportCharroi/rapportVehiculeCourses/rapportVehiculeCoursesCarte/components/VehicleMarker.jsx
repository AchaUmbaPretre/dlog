import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { VehiclePopupContent } from './VehiclePopupContent';

const createVehicleIcon = (status, speed) => {
  const color = status === 'moving' ? '#22c55e' : '#eab308';
  
  return L.divIcon({
    html: `<div class="vehicle-marker">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M5 13L3 17H21L19 13H5Z" fill="${color}" stroke="#1f2937" stroke-width="1.5"/>
        <circle cx="7.5" cy="16.5" r="1.5" fill="#1f2937"/>
        <circle cx="16.5" cy="16.5" r="1.5" fill="#1f2937"/>
        <rect x="6" y="8" width="12" height="5" rx="1" fill="#3b82f6" stroke="#1f2937" stroke-width="1"/>
      </svg>
      <div class="vehicle-speed">${Math.round(speed || 0)}</div>
    </div>`,
    className: 'custom-vehicle-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export const VehicleMarker = ({ vehicle, rawData }) => {
  return (
    <Marker
      position={[vehicle.lat, vehicle.lng]}
      icon={createVehicleIcon(vehicle.status, vehicle.speed)}
    >
      <Popup className="vehicle-popup">
        <VehiclePopupContent vehicle={vehicle} rawData={rawData} />
      </Popup>
    </Marker>
  );
};
