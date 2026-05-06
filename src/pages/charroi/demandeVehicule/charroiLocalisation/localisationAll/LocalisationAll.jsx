import { useRef, useEffect, useCallback } from 'react';
import { useFleetData } from './hooks/useFleetData';
import { useTabNavigation } from './hooks/useTabNavigation';
import { useVehicleSelection } from './hooks/useVehicleSelection';
import { useMapControls } from './hooks/useMapControls';
import { useDrawer } from './hooks/useDrawer';
import './styles/mapStyles.css';
import FleetSidebar from './components/FleetSidebar';
import VehicleDetailDrawer from './components/VehicleDetailDrawer';
import TabNavigation from './components/TabNavigation';
import ContentRenderer from './components/ContentRenderer';
import Loader from './components/Loader';

const LocalisationAll = () => {
  const mapRef = useRef();
  const { vehicles, loading, stats } = useFleetData();
  
  const { activeSection, hoveredTab, handleTabChange, handleTabHover, handleTabLeave } = useTabNavigation('map');
  const { 
    selectedVehicle, 
    selectedVehiclesIds, 
    vehicleHistories,  // Ajouté
    loadingHistory,   
    handleVehicleSelect, 
    handleVehicleDeselect, 
    handleFilterChange,
    initializeAllVehicles 
  } = useVehicleSelection();
  const { showTrails, showHeatmap, currentStyle, toggleTrails, toggleHeatmap, handleStyleChange } = useMapControls();
  const { drawerVisible, openDrawer, closeDrawer } = useDrawer();

  const filteredVehicles = vehicles.filter(v => selectedVehiclesIds.includes(v.id));

  const handleHistoryLoad = useCallback((vehicleId, history) => {
  console.log(`🎯 Historique reçu pour ${vehicleId}: ${history?.length} points`);
  
  if (history && history.length > 0) {
      window.dispatchEvent(new CustomEvent('vehicle-history-loaded', { 
        detail: { vehicleId, history } 
      }));
    }
  }, []);

  // Initialisation
  useEffect(() => {
    initializeAllVehicles(vehicles);
  }, [vehicles, initializeAllVehicles]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="fleet-dashboard">
      <FleetSidebar
        stats={stats}
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onVehicleSelect={handleVehicleSelect}
        onStyleChange={(style) => handleStyleChange(style, mapRef)}
        onToggleTrails={toggleTrails}
        onToggleHeatmap={toggleHeatmap}
        showTrails={showTrails}
        showHeatmap={showHeatmap}
        currentStyle={currentStyle}
        onFilterChange={handleFilterChange}
        selectedVehiclesIds={selectedVehiclesIds}
        onHistoryLoad={handleHistoryLoad}
      />
      
      <div className="main-content">
        <TabNavigation
          activeSection={activeSection}
          onTabChange={handleTabChange}
          onTabHover={handleTabHover}
          onTabLeave={handleTabLeave}
          stats={stats}
          filteredCount={filteredVehicles.length}
        />

        <ContentRenderer
          activeSection={activeSection}
          vehicles={vehicles}
          filteredVehicles={filteredVehicles}
          showTrails={showTrails}
          showHeatmap={showHeatmap}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={(vehicle) => handleVehicleSelect(vehicle, mapRef)}
          onVehicleDeselect={handleVehicleDeselect}
          onShowDetails={openDrawer}
          mapRef={mapRef}
          vehicleHistories={vehicleHistories}  // Ajouté
        />
      </div>
      
      <VehicleDetailDrawer
        vehicle={selectedVehicle}
        visible={drawerVisible}
        onClose={closeDrawer}
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
          padding: 20px 24px;
        }
        
        /* Premium Tabs */
        .premium-tabs {
          background: white;
          border-radius: 16px;
          margin-bottom: 20px;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .tabs-container {
          display: flex;
          gap: 12px;
          flex: 1;
        }
        
        .premium-tab {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        .premium-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px;
          z-index: 0;
        }
        
        .premium-tab:hover::before {
          opacity: 0.08;
        }
        
        .premium-tab.active::before {
          opacity: 0.12;
        }
        
        .premium-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .tab-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          z-index: 1;
        }
        
        .tab-icon {
          font-size: 18px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        
        .premium-tab:not(.active) .tab-icon {
          color: #666;
        }
        
        .premium-tab:hover:not(.active) .tab-icon {
          color: #667eea;
          transform: scale(1.05);
        }
        
        .premium-tab.active .tab-icon {
          color: white;
        }
        
        .tab-label {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: all 0.3s ease;
          z-index: 1;
          position: relative;
        }
        
        .premium-tab:not(.active) .tab-label {
          color: #666;
        }
        
        .premium-tab:hover:not(.active) .tab-label {
          color: #667eea;
        }
        
        .premium-tab.active .tab-label {
          color: white;
        }
        
        .tab-underline {
          position: absolute;
          bottom: -2px;
          left: 20%;
          width: 60%;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 3px;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        .premium-tab.active .tab-underline {
          transform: scaleX(1);
        }
        
        /* Statut en temps réel */
        .realtime-status {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 16px;
          background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
          border-radius: 40px;
          margin-left: 12px;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: #52c41a;
          border-radius: 50%;
          animation: pulse-green 2s infinite;
          box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.4);
        }
        
        @keyframes pulse-green {
          0% {
            box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(82, 196, 26, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
          }
        }
        
        .status-text {
          font-size: 12px;
          font-weight: 500;
          color: #1a1a1a;
        }
        
        .status-divider {
          width: 1px;
          height: 20px;
          background: #e8e8e8;
        }
        
        .status-icon {
          font-size: 12px;
          color: #faad14;
        }
        
        /* Contenu */
        .flex-content {
          flex: 1;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }
        
        .content-wrapper {
          height: 100%;
          overflow-y: auto;
          animation: fadeIn 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .map-container {
          position: relative;
          height: 100%;
          min-height: 500px;
          border-radius: 20px;
          overflow: hidden;
        }
        
        /* Scrollbar personnalisée */
        .content-wrapper::-webkit-scrollbar {
          width: 6px;
        }
        
        .content-wrapper::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .content-wrapper::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
          transition: background 0.2s;
        }
        
        .content-wrapper::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .main-content {
            padding: 12px 16px;
          }
          
          .premium-tabs {
            padding: 4px 8px;
          }
          
          .tabs-container {
            gap: 4px;
          }
          
          .premium-tab {
            padding: 6px 12px;
          }
          
          .tab-label {
            display: none;
          }
          
          .realtime-status {
            padding: 4px 10px;
            gap: 6px;
          }
          
          .status-text {
            font-size: 10px;
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