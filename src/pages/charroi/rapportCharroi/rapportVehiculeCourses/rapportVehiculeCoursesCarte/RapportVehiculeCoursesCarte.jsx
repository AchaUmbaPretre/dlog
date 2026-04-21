import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, ScaleControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useMonitoring } from '../../../monitoring/hooks/useMonitoring';
import { useVehicleData } from './hooks/useVehicleData';
import { useGroupedVehicles } from './hooks/useGroupedVehicles';
import { useVehicleStats } from './hooks/useVehicleStats';
import { EmptyState, LoadingState } from './components/LoadingState';
import { ControlPanel } from './components/ControlPanel';
import { PositionCluster } from './components/PositionCluster';
import { VehicleMarker } from './components/VehicleMarker';

const RapportVehiculeCoursesCarte = () => {
  const { mergedCourses } = useMonitoring();
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTrajectories, setShowTrajectories] = useState(true);
  const [expandAllClusters, setExpandAllClusters] = useState(false);
  const mapRef = useRef();

  const vehicles = useVehicleData(mergedCourses);
  const groupedVehicles = useGroupedVehicles(vehicles);
  const stats = useVehicleStats(vehicles);

  const filteredGroups = groupedVehicles.filter(group => 
    filterStatus === 'all' || group.vehicles.some(v => v.status === filterStatus)
  );

  const handleExpandCluster = useCallback((vehicles) => {
    console.log(`📌 Expansion du cluster avec ${vehicles.length} véhicules`);
  }, []);

  if (!mergedCourses) return <LoadingState />;
  if (vehicles.length === 0) {
    return <EmptyState onDebug={() => console.log('Données brutes:', mergedCourses)} />;
  }

  return (
    <div className="rapport-container-premium">
      <ControlPanel
        stats={stats}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        showTrajectories={showTrajectories}
        onToggleTrajectories={() => setShowTrajectories(!showTrajectories)}
      />

      {/* Bouton pour expand/collapse tous les clusters */}
      <button
        onClick={() => setExpandAllClusters(!expandAllClusters)}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          padding: '8px 16px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 'bold'
        }}
      >
        {expandAllClusters ? '📦 Tout regrouper' : '🔍 Tout développer'}
      </button>

      <MapContainer
        ref={mapRef}
        center={[-4.358313, 15.348934]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        
        {filteredGroups.map(group => {
          if (group.isCluster && !expandAllClusters) {
            // Afficher un cluster
            return (
              <PositionCluster
                key={`cluster-${group.center[0]}-${group.center[1]}`}
                vehicles={group.vehicles}
                position={group.center}
                onExpand={handleExpandCluster}
              />
            );
          } else {
            // Afficher les véhicules individuellement avec décalage
            return group.vehicles.map((vehicle, idx) => {
              // Décaler les positions pour les véhicules au même endroit
              const angle = (idx * 360 / group.vehicles.length) * Math.PI / 180;
              const offset = 0.0005;
              const lat = group.center[0] + Math.cos(angle) * offset;
              const lng = group.center[1] + Math.sin(angle) * offset;
              
              return (
                <VehicleMarker
                  key={vehicle.id}
                  vehicle={{ ...vehicle, lat, lng }}
                  rawData={vehicle.rawData}
                />
              );
            });
          }
        })}
      </MapContainer>

      {/* Indicateur de véhicules superposés */}
      {groupedVehicles.some(g => g.isCluster) && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.8)',
          padding: '8px 12px',
          borderRadius: 8,
          color: 'white',
          fontSize: 11
        }}>
          ⚠️ {groupedVehicles.filter(g => g.isCluster).reduce((acc, g) => acc + g.count, 0)} véhicules sont superposés
          <br />
          💡 Cliquez sur "🔍 Tout développer" pour les voir
        </div>
      )}

      <style jsx>{`
        .rapport-container-premium {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #0f172a;
        }
        
        :global(.position-cluster-icon) {
          background: transparent;
        }
        
        :global(.position-cluster) {
          transition: transform 0.2s;
          animation: pulse 2s infinite;
        }
        
        :global(.position-cluster:hover) {
          transform: scale(1.1);
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default RapportVehiculeCoursesCarte;