// RapportVehiculeCoursesCarte.jsx - Version finale corrigée

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, ScaleControl, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  CompassOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CarOutlined,
  DashboardOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  BellOutlined
} from '@ant-design/icons';
import "./style/premium.css";
import { useMonitoring } from '../../../monitoring/hooks/useMonitoring';
import { useVehicleData } from './hooks/useVehicleData';
import { useGroupedVehicles } from './hooks/useGroupedVehicles';
import { useVehicleStats } from './hooks/useVehicleStats';
import { EmptyState, LoadingState } from './components/LoadingState';
import { ControlPanel } from './components/ControlPanel';
import { PositionCluster } from './components/PositionCluster';
import { VehicleMarker } from './components/VehicleMarker';
import { MAP_CONFIG, MAP_THEMES } from './constants/map.constants';
import { ThemeControl } from './components/ThemeControl';
import { ExportButton } from './components/ExportButton';
import { ReplayMap } from './components/ReplayMap';

const RapportVehiculeCoursesCarte = () => {
  const { mergedCourses } = useMonitoring();
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTrajectories, setShowTrajectories] = useState(true);
  const [expandAllClusters, setExpandAllClusters] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(MAP_THEMES.LIGHT);
  const [replayVehicle, setReplayVehicle] = useState(null);
  const mapRef = useRef();

  const vehicles = useVehicleData(mergedCourses);
  const groupedVehicles = useGroupedVehicles(vehicles);
  const stats = useVehicleStats(vehicles);

  // Alertes actives
  const activeAlerts = vehicles.filter(v => 
    v.isSignalLost || (v.batteryLevel && v.batteryLevel <= 20) || v.isEngineCut
  );

  const filteredGroups = groupedVehicles.filter(group => 
    filterStatus === 'all' || group.vehicles.some(v => v.status === filterStatus)
  );

  const handleExpandCluster = useCallback((vehicles) => {
    console.log(`📌 Expansion du cluster avec ${vehicles.length} véhicules`);
  }, []);

  const handleFitBounds = useCallback(() => {
    if (vehicles.length > 0 && mapRef.current) {
      const allPoints = vehicles.map(v => [v.lat, v.lng]);
      const bounds = L.latLngBounds(allPoints);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles]);

  useEffect(() => {
    handleFitBounds();
  }, [vehicles, handleFitBounds]);

  if (!mergedCourses) return <LoadingState />;
  if (vehicles.length === 0) {
    return <EmptyState onDebug={() => console.log('Données brutes:', mergedCourses)} />;
  }

  return (
    <div className="fleet-dashboard">
      {/* Sidebar gauche */}
      <div className={`fleet-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-area">
            <div className="logo-icon">
              <DashboardOutlined />
            </div>
            <div className="logo-text">
              <span className="logo-title"><span className="logo-highlight">flotte</span></span>
              <span className="logo-subtitle">Real-time Monitoring</span>
            </div>
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </button>
        </div>

        <ControlPanel
          stats={stats}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          showTrajectories={showTrajectories}
          onToggleTrajectories={() => setShowTrajectories(!showTrajectories)}
        />

        {/* Liste des véhicules */}
        <div className="vehicles-list-panel">
          <div className="panel-title">
            <CarOutlined />
            <span>Flotte active</span>
            <span className="vehicle-count-badge">{stats.total}</span>
          </div>
          <div className="vehicles-scroll">
            {vehicles.map(vehicle => (
              <div
                key={vehicle.id}
                className={`vehicle-list-item ${selectedVehicleId === vehicle.id ? 'active' : ''} ${vehicle.isSignalLost ? 'signal-lost' : ''}`}
                onClick={() => {
                  setSelectedVehicleId(vehicle.id);
                  mapRef.current?.flyTo([vehicle.lat, vehicle.lng], 15, { duration: 1 });
                }}
              >
                <div className="vehicle-status-dot" style={{ background: vehicle.isSignalLost ? '#dc2626' : vehicle.speed > 0 ? '#10b981' : '#f59e0b' }} />
                <div className="vehicle-list-info">
                  <div className="vehicle-list-name">{vehicle.name}</div>
                  <div className="vehicle-list-plate">{vehicle.registration}</div>
                </div>
                <div className="vehicle-list-speed">
                  {vehicle.speed > 0 ? `${vehicle.speed} km/h` : 'Stationné'}
                </div>
                {vehicle.isSignalLost && <div className="signal-badge">📡</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Stats rapides */}
        <div className="quick-stats">
          <div className="quick-stat">
            <LineChartOutlined />
            <div>
              <span>{stats.totalDistance}</span>
              <label>km parcourus</label>
            </div>
          </div>
          <div className="quick-stat">
            <ClockCircleOutlined />
            <div>
              <span>{stats.avgEfficiency}%</span>
              <label>efficacité</label>
            </div>
          </div>
          {activeAlerts.length > 0 && (
            <div className="quick-stat alert" onClick={() => setShowAlertPanel(!showAlertPanel)}>
              <BellOutlined />
              <div>
                <span>{activeAlerts.length}</span>
                <label>alertes</label>
              </div>
            </div>
          )}
        </div>

        {/* Panneau d'alertes */}
        {showAlertPanel && activeAlerts.length > 0 && (
          <div className="alerts-panel-premium">
            <div className="alerts-header">
              <span>🚨 Alertes actives</span>
              <button onClick={() => setShowAlertPanel(false)}>✕</button>
            </div>
            {activeAlerts.map(alert => (
              <div key={alert.id} className="alert-item-premium">
                <div className="alert-icon">
                  {alert.isSignalLost ? '📡' : alert.isEngineCut ? '🔌' : '🔋'}
                </div>
                <div className="alert-content">
                  <div className="alert-title">{alert.name}</div>
                  <div className="alert-message">
                    {alert.isSignalLost ? 'Signal perdu' : 
                     alert.isEngineCut ? 'Coupe-batterie activée' : 
                     `Batterie ${alert.batteryLevel}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Carte principale */}
      <div className="fleet-map-container">
        {/* Header flottant */}
        <div className="map-header-floating">
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span>MONITORING EN DIRECT</span>
          </div>
          
          {/* Barre d'outils flottante */}
          <div className="tools-bar">
            <ThemeControl currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            <ExportButton vehicles={vehicles} stats={stats} />
            
            {/* Sélecteur de véhicule pour le replay */}
            <select 
              className="vehicle-replay-select"
              onChange={(e) => {
                const vehicle = vehicles.find(v => v.id === e.target.value);
                if (vehicle) setReplayVehicle(vehicle);
              }}
              defaultValue=""
            >
              <option value="" disabled>Replay trajet</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} - {v.registration}
                </option>
              ))}
            </select>
          </div>
          
          <div className="zoom-controls-floating">
            <button onClick={() => mapRef.current?.zoomIn()} className="zoom-btn">
              <ZoomInOutlined />
            </button>
            <button onClick={() => mapRef.current?.zoomOut()} className="zoom-btn">
              <ZoomOutOutlined />
            </button>
            <button onClick={handleFitBounds} className="zoom-btn primary">
              <CompassOutlined />
            </button>
          </div>
        </div>

        <MapContainer
          ref={mapRef}
          center={[-4.358313, 15.348934]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <ScaleControl position="bottomleft" />
          
          <TileLayer
            url={MAP_CONFIG.TILE_LAYERS[currentTheme].url}
            attribution={MAP_CONFIG.TILE_LAYERS[currentTheme].attribution}
          />
          
          {/* Zones de destination */}
{/*           {vehicles.map(vehicle => {
            if (vehicle.destinationPolygon && vehicle.destinationPolygon.length > 0) {
              const polygonPoints = vehicle.destinationPolygon.map(p => [p.lat, p.lng]);
              return (
                <Polygon
                  key={`geofence-${vehicle.id}`}
                  positions={polygonPoints}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.08,
                    weight: 1.5,
                    dashArray: '6, 6'
                  }}
                />
              );
            }
            return null;
          })} */}
          
          {/* Marqueurs et clusters */}
          {filteredGroups.map(group => {
            if (group.isCluster && !expandAllClusters) {
              return (
                <PositionCluster
                  key={`cluster-${group.center[0]}-${group.center[1]}`}
                  vehicles={group.vehicles}
                  position={group.center}
                  onExpand={handleExpandCluster}
                />
              );
            } else {
              return group.vehicles.map((vehicle, idx) => {
                let lat = vehicle.lat;
                let lng = vehicle.lng;
                
                if (group.isCluster && expandAllClusters) {
                  const angle = (idx * 360 / group.vehicles.length) * Math.PI / 180;
                  const offset = 0.0008;
                  lat = group.center[0] + Math.cos(angle) * offset;
                  lng = group.center[1] + Math.sin(angle) * offset;
                }
                
                return (
                  <VehicleMarker
                    key={vehicle.id}
                    vehicle={{ ...vehicle, lat, lng }}
                    rawData={vehicle.rawData}
                    isSelected={selectedVehicleId === vehicle.id}
                  />
                );
              });
            }
          })}
        </MapContainer>

        {/* Indicateur de clusters */}
        {groupedVehicles.some(g => g.isCluster) && !expandAllClusters && (
          <div className="cluster-indicator">
            <div className="cluster-icon">📍</div>
            <div className="cluster-info">
              <strong>{groupedVehicles.filter(g => g.isCluster).reduce((acc, g) => acc + g.count, 0)} véhicules</strong> superposés
            </div>
            <button onClick={() => setExpandAllClusters(true)}>
              Voir tout
            </button>
          </div>
        )}

        {/* Bouton toggle sidebar pour mobile */}
        {!isSidebarOpen && (
          <button className="mobile-sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
            <MenuUnfoldOutlined />
          </button>
        )}
      </div>

      {/* Modal de replay avec sa propre carte */}
      {replayVehicle && (
        <ReplayMap
          vehicle={replayVehicle}
          onClose={() => setReplayVehicle(null)}
        />
      )}
    </div>
  );
};

export default RapportVehiculeCoursesCarte;