import React, { useState, useRef, useCallback } from 'react';
import { Spin } from 'antd';
import { useFleetData } from './hooks/useFleetData';
import './styles/mapStyles.css';
import FleetMap from './components/FleetMap';
import VehicleInfoPanel from './components/VehicleInfoPanel';
import FleetSidebar from './components/FleetSidebar';
import VehicleDetailDrawer from './components/VehicleDetailDrawer';

const LocalisationAll = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showTrails, setShowTrails] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentStyle, setCurrentStyle] = useState('streets');
  
  const mapRef = useRef();
  const { vehicles, loading, stats } = useFleetData();

  const handleVehicleSelect = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    if (mapRef.current) {
      mapRef.current.flyToVehicle(vehicle.lat, vehicle.lng);
    }
  }, []);

  const handleShowDetails = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  const handleStyleChange = useCallback((style) => {
    setCurrentStyle(style);
    if (mapRef.current) {
      mapRef.current.changeStyle(style);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Chargement des véhicules..." />
      </div>
    );
  }

  return (
    <div className="fleet-dashboard">
      <FleetSidebar
        stats={stats}
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onVehicleSelect={handleVehicleSelect}
        onStyleChange={handleStyleChange}
        onToggleTrails={() => setShowTrails(!showTrails)}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        showTrails={showTrails}
        showHeatmap={showHeatmap}
        currentStyle={currentStyle}
      />
      
      <div className="map-container">
        <FleetMap
          ref={mapRef}
          vehicles={vehicles}
          showTrails={showTrails}
          showHeatmap={showHeatmap}
          onVehicleClick={handleVehicleSelect}
          onMapReady={(mapControls) => {
            // Map ready callback
          }}
        />
        
        {selectedVehicle && (
          <VehicleInfoPanel
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
            onShowDetails={handleShowDetails}
          />
        )}
      </div>
      
      <VehicleDetailDrawer
        vehicle={selectedVehicle}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </div>
  );
};

export default LocalisationAll;