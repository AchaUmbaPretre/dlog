import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, ScaleControl } from 'react-leaflet';
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
  BellOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { Checkbox, Tooltip, Badge } from 'antd';
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
  const [selectedVehicles, setSelectedVehicles] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const mapRef = useRef();

  const vehicles = useVehicleData(mergedCourses);
  const groupedVehicles = useGroupedVehicles(vehicles);
  const stats = useVehicleStats(vehicles);

  // Alertes actives
  const activeAlerts = vehicles.filter(v => 
    v.isSignalLost || (v.batteryLevel && v.batteryLevel <= 20) || v.isEngineCut
  );

  // Filtrer les groupes en fonction des véhicules sélectionnés
  const filteredGroups = React.useMemo(() => {
    let groups = groupedVehicles;
    
    if (filterStatus !== 'all') {
      groups = groups.filter(group => 
        group.vehicles.some(v => v.status === filterStatus)
      );
    }
    
    if (selectedVehicles.size > 0 && !selectAll) {
      groups = groups
        .map(group => ({
          ...group,
          vehicles: group.vehicles.filter(v => selectedVehicles.has(v.id))
        }))
        .filter(group => group.vehicles.length > 0);
    }
    
    return groups;
  }, [groupedVehicles, filterStatus, selectedVehicles, selectAll]);

  useEffect(() => {
    if (vehicles.length > 0 && mapRef.current && isInitialLoad) {
      setTimeout(() => {
        const allPoints = vehicles.map(v => [v.lat, v.lng]);
        const bounds = L.latLngBounds(allPoints);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        setIsInitialLoad(false);
        console.log('📍 Carte centrée initialement sur tous les véhicules');
      }, 500);
    }
  }, [vehicles, isInitialLoad]);

  // ✅ Fonction manuelle pour recentrer (appelée par le bouton)
  const handleFitBounds = useCallback(() => {
    if (vehicles.length > 0 && mapRef.current) {
      const allPoints = vehicles.map(v => [v.lat, v.lng]);
      const bounds = L.latLngBounds(allPoints);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles]);

  // Gérer la sélection
  const handleSelectVehicle = (vehicleId, checked) => {
    setSelectedVehicles(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(vehicleId);
      } else {
        newSet.delete(vehicleId);
        setSelectAll(false);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      const allIds = vehicles.map(v => v.id);
      setSelectedVehicles(new Set(allIds));
    } else {
      setSelectedVehicles(new Set());
    }
  };

  const handleClearSelection = () => {
    setSelectedVehicles(new Set());
    setSelectAll(false);
  };

  const handleCenterOnSelected = () => {
    if (selectedVehicles.size === 0) return;
    
    const selectedVehiclesList = vehicles.filter(v => selectedVehicles.has(v.id));
    if (selectedVehiclesList.length > 0 && mapRef.current) {
      const allPoints = selectedVehiclesList.map(v => [v.lat, v.lng]);
      const bounds = L.latLngBounds(allPoints);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleExpandCluster = useCallback((vehicles) => {
    console.log(`📌 Expansion du cluster avec ${vehicles.length} véhicules`);
  }, []);

  if (!mergedCourses) return <LoadingState />;
  if (vehicles.length === 0) {
    return <EmptyState onDebug={() => console.log('Données brutes:', mergedCourses)} />;
  }

  const selectedCount = selectedVehicles.size;
  const totalCount = vehicles.length;

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

        {/* Barre d'action de sélection */}
        <div className="selection-bar">
          <div className="selection-info">
            <Checkbox 
              checked={selectAll || (selectedCount > 0 && selectedCount === totalCount)}
              indeterminate={selectedCount > 0 && selectedCount < totalCount}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              Tous les véhicules
            </Checkbox>
            {selectedCount > 0 && (
              <Badge count={selectedCount} style={{ backgroundColor: '#3b82f6' }} />
            )}
          </div>
          <div className="selection-actions">
            {selectedCount > 0 && (
              <>
                <Tooltip title="Centrer sur la sélection">
                  <button className="selection-btn" onClick={handleCenterOnSelected}>
                    <CompassOutlined />
                  </button>
                </Tooltip>
                <Tooltip title="Effacer la sélection">
                  <button className="selection-btn" onClick={handleClearSelection}>
                    <CloseOutlined />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        </div>

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
              >
                <Checkbox 
                  checked={selectedVehicles.has(vehicle.id)}
                  onChange={(e) => handleSelectVehicle(vehicle.id, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div 
                  className="vehicle-list-content"
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
            {/* ✅ Bouton "Voir tout" pour recentrer manuellement */}
            <button onClick={handleFitBounds} className="zoom-btn primary">
              <CompassOutlined />
            </button>
          </div>
        </div>

        {/* Indicateur de filtrage */}
        {selectedVehicles.size > 0 && selectedVehicles.size < totalCount && (
          <div className="filter-indicator">
            <span>📌 {selectedVehicles.size} véhicule(s) sélectionné(s) sur {totalCount}</span>
            <button onClick={handleClearSelection}>Afficher tout</button>
          </div>
        )}

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

        {!isSidebarOpen && (
          <button className="mobile-sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
            <MenuUnfoldOutlined />
          </button>
        )}
      </div>

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