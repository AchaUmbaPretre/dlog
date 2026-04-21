import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { VehicleMarker } from './VehicleMarker';
import { VEHICLE_STATUS } from '../constants/map.constants';

// Création de l'icône du cluster
const createClusterIcon = (vehicles) => {
  const count = vehicles.length;
  const hasMoving = vehicles.some(v => v.status === VEHICLE_STATUS.MOVING);
  const hasStopped = vehicles.some(v => v.status === VEHICLE_STATUS.STOPPED);
  
  let color = '#6b7280'; // gris par défaut
  let borderColor = '#ffffff';
  
  if (hasMoving && hasStopped) {
    color = '#8b5cf6'; // violet pour mixte
  } else if (hasMoving) {
    color = '#10b981'; // vert pour en mouvement
  } else if (hasStopped) {
    color = '#f59e0b'; // orange pour arrêtés
  }
  
  // Taille du cluster en fonction du nombre
  let size = 46;
  let fontSize = 18;
  if (count > 10) {
    size = 56;
    fontSize = 22;
  } else if (count > 5) {
    size = 50;
    fontSize = 20;
  }
  
  return L.divIcon({
    html: `
      <div class="position-cluster" style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        border: 3px solid ${borderColor};
        cursor: pointer;
        transition: all 0.3s;
      ">
        <span style="font-size: ${fontSize}px; font-weight: bold; color: white;">${count}</span>
        <span style="font-size: 9px; color: white; opacity: 0.9; margin-top: 2px;">
          ${hasMoving ? '🚚' : ''}${hasStopped ? '🚛' : ''}
        </span>
      </div>
    `,
    className: 'position-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

// Composant pour afficher les véhicules du cluster en cercle
const ExpandedVehicles = ({ vehicles, center, onCollapse }) => {
  const radius = 0.0012; // Rayon du cercle (~120 mètres)
  const [hoveredVehicle, setHoveredVehicle] = useState(null);
  
  return (
    <>
      {/* Afficher les véhicules en cercle */}
      {vehicles.map((vehicle, idx) => {
        const angle = (idx * 360 / vehicles.length) * Math.PI / 180;
        const lat = center[0] + Math.cos(angle) * radius;
        const lng = center[1] + Math.sin(angle) * radius;
        
        // Petit offset supplémentaire pour éviter la superposition parfaite
        const finalLat = lat + (Math.sin(angle) * 0.00005);
        const finalLng = lng + (Math.cos(angle) * 0.00005);
        
        return (
          <VehicleMarker
            key={vehicle.id}
            vehicle={{ ...vehicle, lat: finalLat, lng: finalLng }}
            rawData={vehicle.rawData}
            hasMultipleVehicles={true}
            vehicleCount={vehicles.length}
            onHover={setHoveredVehicle}
            isHovered={hoveredVehicle === vehicle.id}
          />
        );
      })}
      
      {/* Bouton pour regrouper */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: 24,
        display: 'flex',
        gap: 12,
        pointerEvents: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={onCollapse}
          style={{
            background: '#3b82f6',
            border: 'none',
            color: 'white',
            padding: '6px 12px',
            borderRadius: 20,
            cursor: 'pointer',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => e.target.style.background = '#2563eb'}
          onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
        >
          📦 Regrouper les {vehicles.length} véhicules
        </button>
      </div>
    </>
  );
};

// Composant principal PositionCluster
export const PositionCluster = ({ vehicles, position, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleExpand = () => {
    setIsExpanded(true);
    onExpand?.(vehicles);
  };
  
  const handleCollapse = () => {
    setIsExpanded(false);
  };
  
  if (isExpanded) {
    return (
      <ExpandedVehicles 
        vehicles={vehicles} 
        center={position} 
        onCollapse={handleCollapse}
      />
    );
  }
  
  return (
    <Marker
      position={position}
      icon={createClusterIcon(vehicles)}
      eventHandlers={{
        click: handleExpand
      }}
    >
      <Popup className="cluster-popup">
        <div style={{ 
          textAlign: 'center', 
          padding: '8px 4px',
          minWidth: 240
        }}>
          {/* Icônes représentatives */}
          <div style={{ 
            fontSize: 40, 
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'center',
            gap: 8
          }}>
            {vehicles.slice(0, 4).map((v, i) => (
              <span key={i} style={{ fontSize: 28 }}>
                {v.status === VEHICLE_STATUS.MOVING ? '🚚' : '🚛'}
              </span>
            ))}
            {vehicles.length > 4 && (
              <span style={{ fontSize: 20, alignSelf: 'center' }}>+{vehicles.length - 4}</span>
            )}
          </div>
          
          {/* Compteur */}
          <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            {vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''}
          </div>
          
          {/* Statistiques rapides */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 16,
            marginBottom: 12,
            fontSize: 12
          }}>
            <div style={{ color: '#10b981' }}>
              🚀 {vehicles.filter(v => v.status === VEHICLE_STATUS.MOVING).length} en route
            </div>
            <div style={{ color: '#f59e0b' }}>
              ⏸️ {vehicles.filter(v => v.status === VEHICLE_STATUS.STOPPED).length} arrêtés
            </div>
          </div>
          
          {/* Liste des véhicules */}
          <div style={{ 
            maxHeight: 180, 
            overflowY: 'auto', 
            marginBottom: 12,
            borderTop: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb',
            fontSize: 11
          }}>
            {vehicles.map(v => (
              <div key={v.id} style={{ 
                padding: 8, 
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 500 }}>{v.name}</div>
                  <div style={{ fontSize: 9, color: '#6b7280' }}>{v.registration}</div>
                </div>
                <div style={{ 
                  color: v.status === VEHICLE_STATUS.MOVING ? '#10b981' : '#f59e0b',
                  fontSize: 11,
                  fontWeight: 500
                }}>
                  {v.status === VEHICLE_STATUS.MOVING ? `${v.speed} km/h` : 'Arrêté'}
                </div>
              </div>
            ))}
          </div>
          
          {/* Bouton d'expansion */}
          <button
            onClick={handleExpand}
            style={{
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            🔍 Voir les {vehicles.length} véhicules
          </button>
        </div>
      </Popup>
    </Marker>
  );
};