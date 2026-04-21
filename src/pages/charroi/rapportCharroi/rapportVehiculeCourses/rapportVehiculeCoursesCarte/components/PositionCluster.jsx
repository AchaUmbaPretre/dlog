import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { VehicleMarker } from './VehicleMarker';

const createClusterIcon = (vehicles) => {
  const count = vehicles.length;
  const statuses = vehicles.map(v => v.status);
  const hasMoving = statuses.includes('moving');
  const color = hasMoving ? '#22c55e' : '#eab308';
  
  return L.divIcon({
    html: `
      <div class="position-cluster" style="
        background: ${color};
        width: 46px;
        height: 46px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 2px solid white;
        cursor: pointer;
      ">
        <span style="font-size: 18px; font-weight: bold;">${count}</span>
        <span style="font-size: 10px;">véhicules</span>
      </div>
    `,
    className: 'position-cluster-icon',
    iconSize: [46, 46],
    iconAnchor: [23, 23]
  });
};

export const PositionCluster = ({ vehicles, position, onExpand }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!expanded) {
    return (
      <Marker
        position={position}
        icon={createClusterIcon(vehicles)}
        eventHandlers={{
          click: () => {
            setExpanded(true);
            onExpand?.(vehicles);
          }
        }}
      >
        <Popup>
          <div style={{ textAlign: 'center', padding: 8 }}>
            <strong>{vehicles.length} véhicules à cet emplacement</strong>
            <button 
              onClick={() => setExpanded(true)}
              style={{ marginTop: 8, padding: '4px 12px', cursor: 'pointer' }}
            >
              Voir détails
            </button>
          </div>
        </Popup>
      </Marker>
    );
  }
  
  // Afficher les véhicules avec décalage
  return (
    <>
      {vehicles.map((vehicle, idx) => {
        const angle = (idx * 360 / vehicles.length) * Math.PI / 180;
        const offset = 0.0008;
        const lat = position[0] + Math.cos(angle) * offset;
        const lng = position[1] + Math.sin(angle) * offset;
        
        return (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            rawData={vehicle.rawData}
            position={[lat, lng]}
          />
        );
      })}
    </>
  );
};
