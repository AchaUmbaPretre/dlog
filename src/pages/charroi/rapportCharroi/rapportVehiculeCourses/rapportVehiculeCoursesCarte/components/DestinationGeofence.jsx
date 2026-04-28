// components/DestinationGeofence.jsx

import React from 'react';
import { Polygon, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Icône de destination
const destinationIcon = L.divIcon({
  html: `
    <div style="
      background: #ef4444;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M12 2L12 22M12 2L22 12M12 2L2 12"/>
        <circle cx="12" cy="12" r="3" fill="white"/>
      </svg>
    </div>
  `,
  className: 'destination-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

export const DestinationGeofence = ({ destinationPolygon, destinationCenter, destinationName }) => {
  if (!destinationPolygon || destinationPolygon.length === 0) return null;
  
  // Convertir les points pour Leaflet
  const polygonPoints = destinationPolygon.map(point => [point.lat, point.lng]);
  const center = destinationCenter || polygonPoints[0];
  
  // Calculer le centre du polygone si non fourni
  const getCenter = () => {
    if (destinationCenter) return destinationCenter;
    const sumLat = polygonPoints.reduce((sum, p) => sum + p[0], 0);
    const sumLng = polygonPoints.reduce((sum, p) => sum + p[1], 0);
    return [sumLat / polygonPoints.length, sumLng / polygonPoints.length];
  };
  
  return (
    <>
      {/* Polygone de la zone de destination */}
      <Polygon
        positions={polygonPoints}
        pathOptions={{
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '5, 5'
        }}
      >
        <Tooltip sticky>
          <div style={{ textAlign: 'center' }}>
            <strong>📍 Zone de livraison</strong>
            <div>{destinationName || 'Destination'}</div>
          </div>
        </Tooltip>
      </Polygon>
      
      {/* Marqueur de destination */}
      <Marker
        position={getCenter()}
        icon={destinationIcon}
      >
        <Popup>
          <div style={{ textAlign: 'center', padding: '4px' }}>
            <div style={{ fontWeight: 'bold', color: '#ef4444' }}>🎯 Destination</div>
            <div>{destinationName || 'Zone de livraison'}</div>
            <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
              🚚 Zone de géofencing
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};