import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { VehicleMarker } from './VehicleMarker';

// Création de l'icône du cluster
const createClusterIcon = (vehicles, isExpanded = false) => {
  const count = vehicles.length;
  const hasMoving = vehicles.some(v => v.status === 'moving');
  const color = hasMoving ? '#22c55e' : '#eab308';
  
  if (isExpanded) return null;
  
  return L.divIcon({
    html: `
      <div class="position-cluster" style="
        background: ${color};
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        border: 3px solid white;
        cursor: pointer;
        transition: all 0.3s;
        animation: pulse 2s infinite;
      ">
        <span style="font-size: 20px; font-weight: bold; color: white;">${count}</span>
        <span style="font-size: 9px; color: white; opacity: 0.9;">véhicules</span>
      </div>
    `,
    className: 'position-cluster-icon',
    iconSize: [56, 56],
    iconAnchor: [28, 28]
  });
};

// Composant pour afficher les véhicules en cercle
const ExpandedVehicles = ({ vehicles, center, onClose }) => {
  const radius = 0.0015; // Rayon du cercle (~150 mètres)
  
  return (
    <>
      {/* Cercle de guidage */}
      <div className="cluster-guide-circle" style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 999
      }} />
      
      {vehicles.map((vehicle, idx) => {
        // Calculer la position sur le cercle
        const angle = (idx * 360 / vehicles.length) * Math.PI / 180;
        const lat = center[0] + Math.cos(angle) * radius;
        const lng = center[1] + Math.sin(angle) * radius;
        
        // Ajouter un petit offset supplémentaire pour les véhicules très proches
        const finalLat = lat + (Math.random() - 0.5) * 0.0001;
        const finalLng = lng + (Math.random() - 0.5) * 0.0001;
        
        return (
          <VehicleMarker
            key={vehicle.id}
            vehicle={{ ...vehicle, lat: finalLat, lng: finalLng }}
            rawData={vehicle.rawData}
            hasMultipleVehicles={true}
            vehicleCount={vehicles.length}
          />
        );
      })}
      
      {/* Bouton de regroupement */}
      <div className="cluster-controls" style={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: 20,
        display: 'flex',
        gap: 12,
        pointerEvents: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            background: '#3b82f6',
            border: 'none',
            color: 'white',
            padding: '6px 12px',
            borderRadius: 16,
            cursor: 'pointer',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          📦 Tout regrouper
        </button>
      </div>
    </>
  );
};

// Composant principal PositionCluster
export const PositionCluster = ({ vehicles, position, onExpand, onCollapse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleExpand = () => {
    setIsExpanded(true);
    onExpand?.(vehicles);
  };
  
  const handleCollapse = () => {
    setIsExpanded(false);
    onCollapse?.();
  };
  
  if (isExpanded) {
    return (
      <ExpandedVehicles 
        vehicles={vehicles} 
        center={position} 
        onClose={handleCollapse}
      />
    );
  }
  
  return (
    <Marker
      position={position}
      icon={createClusterIcon(vehicles, isExpanded)}
      eventHandlers={{
        click: handleExpand
      }}
    >
      <Popup>
        <div style={{ 
          textAlign: 'center', 
          padding: 16,
          minWidth: 200
        }}>
          <div style={{ 
            fontSize: 32, 
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'center',
            gap: 4
          }}>
            {vehicles.slice(0, 3).map((v, i) => (
              <span key={i}>{v.status === 'moving' ? '🚚' : '🚛'}</span>
            ))}
            {vehicles.length > 3 && <span>+{vehicles.length - 3}</span>}
          </div>
          <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
            {vehicles.length} véhicules à cet emplacement
          </div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
            {vehicles.filter(v => v.status === 'moving').length} en mouvement • {vehicles.filter(v => v.status === 'stopped').length} arrêtés
          </div>
          <div style={{ 
            maxHeight: 150, 
            overflowY: 'auto', 
            marginBottom: 12,
            borderTop: '1px solid #eee',
            borderBottom: '1px solid #eee'
          }}>
            {vehicles.map(v => (
              <div key={v.id} style={{ 
                padding: 6, 
                fontSize: 11, 
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{v.name}</span>
                <span style={{ color: v.status === 'moving' ? '#22c55e' : '#eab308' }}>
                  {v.status === 'moving' ? `${v.speed} km/h` : 'Arrêté'}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleExpand}
            style={{
              width: '100%',
              padding: '8px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 'bold'
            }}
          >
            🔍 Voir les détails
          </button>
        </div>
      </Popup>
    </Marker>
  );
};