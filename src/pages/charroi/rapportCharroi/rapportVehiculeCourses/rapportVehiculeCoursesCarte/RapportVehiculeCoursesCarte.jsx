import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, ScaleControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

import { useMonitoring } from '../../../monitoring/hooks/useMonitoring';
import { MAP_CONFIG } from './constants/map.constants';
import { useVehicleData } from './hooks/useVehicleData';
import { useMapBounds } from './hooks/useMapBounds';
import { useVehicleStats } from './hooks/useVehicleStats';
import { EmptyState, LoadingState } from './components/LoadingState';
import { ControlPanel } from './components/ControlPanel';
import { VehicleTrajectory } from './components/VehicleTrajectory';
import { VehicleMarker } from './components/VehicleMarker';

const RapportVehiculeCoursesCarte = () => {
  const { mergedCourses } = useMonitoring();
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTrajectories, setShowTrajectories] = useState(true);
  const mapRef = useRef();

  const vehicles = useVehicleData(mergedCourses);
  const stats = useVehicleStats(vehicles);
  const mapBounds = useMapBounds(vehicles);

  const filteredVehicles = vehicles.filter(vehicle => 
    filterStatus === 'all' || vehicle.status === filterStatus
  );

  if (!mergedCourses) return <LoadingState />;
  if (vehicles.length === 0) {
    return (
      <EmptyState 
        onDebug={() => {
          console.log('Données brutes:', mergedCourses);
          alert('Vérifiez la console pour voir la structure des données');
        }}
      />
    );
  }

  return (
    <div className="rapport-container">
      <ControlPanel
        stats={stats}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        showTrajectories={showTrajectories}
        onToggleTrajectories={() => setShowTrajectories(!showTrajectories)}
      />

      <MapContainer
        ref={mapRef}
        center={MAP_CONFIG.DEFAULT_CENTER}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenReady={() => {
          if (mapBounds && mapRef.current) {
            mapRef.current.fitBounds(mapBounds);
          }
        }}
      >
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" />
        
        <TileLayer
          url={MAP_CONFIG.TILE_LAYER.URL}
          attribution={MAP_CONFIG.TILE_LAYER.ATTRIBUTION}
        />
        
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={MAP_CONFIG.MAX_CLUSTER_RADIUS}
          spiderfyOnMaxZoom
          showCoverageOnHover
        >
          {filteredVehicles.map(vehicle => (
            <React.Fragment key={vehicle.id}>
              {showTrajectories && vehicle.trajectory.length > 1 && (
                <VehicleTrajectory 
                  trajectory={vehicle.trajectory} 
                  status={vehicle.status} 
                />
              )}
              <VehicleMarker vehicle={vehicle} rawData={vehicle.rawData} />
            </React.Fragment>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <style jsx>{`
        .rapport-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        
        :global(.custom-vehicle-icon) {
          background: transparent;
          border: none;
        }
        
        :global(.vehicle-marker) {
          position: relative;
          animation: pulse 2s infinite;
        }
        
        :global(.vehicle-speed) {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        :global(.leaflet-popup-content-wrapper) {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        :global(.leaflet-popup-content) {
          margin: 12px;
        }
      `}</style>
    </div>
  );
};

export default RapportVehiculeCoursesCarte;