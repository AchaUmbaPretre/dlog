// components/ContentRenderer.jsx
import FleetMap from './FleetMap';
import VehicleInfoPanel from './VehicleInfoPanel';
import DailyActivityReport from './DailyActivityReport';
import DrivingBehaviorAnalysis from './DrivingBehaviorAnalysis';
import MaintenancePredictor from './MaintenancePredictor';

const ContentRenderer = ({ 
  activeSection, 
  vehicles, 
  filteredVehicles,
  showTrails,
  showHeatmap,
  selectedVehicle,
  onVehicleSelect,
  onVehicleDeselect,
  onShowDetails,
  mapRef,
  vehicleHistories  // Nouvelle prop
}) => {
  const renderContent = () => {
    switch(activeSection) {
      case 'map':
        return (
          <div className="map-container">
            <FleetMap
              ref={mapRef}
              vehicles={filteredVehicles}
              showTrails={showTrails}
              showHeatmap={showHeatmap}
              onVehicleClick={onVehicleSelect}
              vehicleHistories={vehicleHistories}
              onMapReady={(mapControls) => {
                console.log('Carte prête');
              }}
            />
            {selectedVehicle && (
              <VehicleInfoPanel
                vehicle={selectedVehicle}
                onClose={onVehicleDeselect}
                onShowDetails={onShowDetails}
              />
            )}
          </div>
        );
      case 'driving':
        return <DrivingBehaviorAnalysis vehicles={vehicles} />;
      case 'maintenance':
        return <MaintenancePredictor vehicles={vehicles} />;
      case 'reports':
        return <DailyActivityReport vehicles={vehicles} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-content">
      <div className="content-wrapper fade-in">
        {renderContent()}
      </div>
    </div>
  );
};

export default ContentRenderer;