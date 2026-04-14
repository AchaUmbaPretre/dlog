import { useState, useRef, useCallback } from 'react';
import { Spin } from 'antd';
import { useFleetData } from './hooks/useFleetData';
import './styles/mapStyles.css';
import FleetMap from './components/FleetMap';
import VehicleInfoPanel from './components/VehicleInfoPanel';
import FleetSidebar from './components/FleetSidebar';
import VehicleDetailDrawer from './components/VehicleDetailDrawer';
import DailyActivityReport from './components/DailyActivityReport';
import DrivingBehaviorAnalysis from './components/DrivingBehaviorAnalysis';
import MaintenancePredictor from './components/MaintenancePredictor';

const LocalisationAll = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showTrails, setShowTrails] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentStyle, setCurrentStyle] = useState('streets');
  const [activeSection, setActiveSection] = useState('map');
  
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

  const sections = [
    { id: 'map', label: 'Carte interactive', icon: '🗺️' },
    { id: 'driving', label: 'Analyse conduite', icon: '🚗' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'reports', label: 'Rapport activité', icon: '📊' }
  ];

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
      
      <div className="main-content">
        {/* Navigation Flex */}
        <div className="flex-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Contenu Flex */}
        <div className="flex-content">
          {activeSection === 'map' && (
            <div className="map-container">
              <FleetMap
                ref={mapRef}
                vehicles={vehicles}
                showTrails={showTrails}
                showHeatmap={showHeatmap}
                onVehicleClick={handleVehicleSelect}
                onMapReady={(mapControls) => {
                  console.log('Carte prête');
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
          )}
          
          {activeSection === 'driving' && (
            <DrivingBehaviorAnalysis vehicles={vehicles} />
          )}
          
          {activeSection === 'maintenance' && (
            <MaintenancePredictor vehicles={vehicles} />
          )}
          
          {activeSection === 'reports' && (
            <DailyActivityReport vehicles={vehicles} />
          )}
        </div>
      </div>
      
      <VehicleDetailDrawer
        vehicle={selectedVehicle}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      <style jsx>{`
        .fleet-dashboard {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #f0f2f5;
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 16px;
        }
        
        /* Navigation Flex */
        .flex-nav {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          background: white;
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .nav-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          color: #666;
        }
        
        .nav-btn:hover {
          background: #f5f5f5;
          color: #1890ff;
        }
        
        .nav-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .nav-icon {
          font-size: 18px;
        }
        
        .nav-label {
          font-weight: 500;
        }
        
        /* Contenu Flex */
        .flex-content {
          flex: 1;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        
        .map-container {
          position: relative;
          height: 100%;
          min-height: 500px;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .flex-content > div:not(.map-container) {
          padding: 16px;
          height: 100%;
          overflow-y: auto;
        }
        
        .loading-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        /* Scrollbar */
        .flex-content > div::-webkit-scrollbar {
          width: 6px;
        }
        
        .flex-content > div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .flex-content > div::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .main-content {
            padding: 8px;
          }
          
          .nav-label {
            display: none;
          }
          
          .nav-btn {
            padding: 10px;
          }
          
          .nav-icon {
            font-size: 20px;
          }
          
          .map-container {
            min-height: 350px;
          }
        }
      `}</style>
    </div>
  );
};

export default LocalisationAll;