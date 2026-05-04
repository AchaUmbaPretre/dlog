import { useState, useRef, useCallback, useEffect } from 'react';
import { Badge, Tooltip } from 'antd';
import { 
  EnvironmentOutlined, 
  CarOutlined, 
  ToolOutlined, 
  BarChartOutlined,
  ThunderboltOutlined,
  RocketOutlined
} from '@ant-design/icons';
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
  const [selectedVehiclesIds, setSelectedVehiclesIds] = useState([]);
  const [hoveredTab, setHoveredTab] = useState(null);

  const mapRef = useRef();
  const { vehicles, loading, stats } = useFleetData();

  const filteredVehicles = vehicles.filter(v => selectedVehiclesIds.includes(v.id));

  const handleVehicleSelect = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    if (mapRef.current) {
      mapRef.current.flyToVehicle(vehicle.lat, vehicle.lng);
    }
  }, []);

  const handleShowDetails = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  useEffect(() => {
    if (vehicles.length > 0 && selectedVehiclesIds.length === 0) {
      const allIds = vehicles.map(v => v.id);
      setSelectedVehiclesIds(allIds);
    }
  }, [vehicles]);

  const handleStyleChange = useCallback((style) => {
    setCurrentStyle(style);
    if (mapRef.current) {
      mapRef.current.changeStyle(style);
    }
  }, []);

  const handleFilterChange = useCallback((selectedIds) => {
    setSelectedVehiclesIds(selectedIds);
    if (selectedVehicle && !selectedIds.includes(selectedVehicle.id)) {
      setSelectedVehicle(null);
    }
  }, [selectedVehicle]);

  // Statistiques pour les badges
  const activeVehiclesCount = vehicles.filter(v => v.online === 'online').length;
  const movingCount = vehicles.filter(v => v.speed > 0).length;
  const alertCount = vehicles.filter(v => v.alarm === 1).length;

  const sections = [
    { 
      id: 'map', 
      label: 'Carte', 
      icon: <EnvironmentOutlined />, 
      description: 'Visualisation géographique',
      badge: filteredVehicles.length,
      badgeColor: '#1890ff'
    },
    { 
      id: 'driving', 
      label: 'Conduite', 
      icon: <CarOutlined />, 
      description: 'Analyse comportementale',
      badge: null,
      badgeColor: '#52c41a'
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance', 
      icon: <ToolOutlined />, 
      description: 'Suivi préventif',
      badge: alertCount,
      badgeColor: '#faad14'
    },
    { 
      id: 'reports', 
      label: 'Rapports', 
      icon: <BarChartOutlined />, 
      description: 'Statistiques avancées',
      badge: null,
      badgeColor: null
    }
  ];

  const getSectionContent = () => {
    switch(activeSection) {
      case 'map':
        return (
          <div className="map-container">
            <FleetMap
              ref={mapRef}
              vehicles={filteredVehicles}
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="premium-loader">
          <RocketOutlined className="loader-icon" />
          <div className="loader-text">Chargement de votre flotte...</div>
          <div className="loader-progress">
            <div className="loader-progress-bar"></div>
          </div>
        </div>
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
        onFilterChange={handleFilterChange}
        selectedVehiclesIds={selectedVehiclesIds}
      />
      
      <div className="main-content">
        <div className="premium-tabs">
          <div className="tabs-container">
            {sections.map(section => (
              <Tooltip 
                key={section.id} 
                title={section.description}
                placement="bottom"
                mouseEnterDelay={0.3}
              >
                <button
                  className={`premium-tab ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                  onMouseEnter={() => setHoveredTab(section.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  <div className="tab-icon-wrapper">
                    <span className="tab-icon">{section.icon}</span>
                    {section.badge !== null && section.badge > 0 && (
                      <Badge 
                        count={section.badge} 
                        size="small"
                        style={{ 
                          backgroundColor: section.badgeColor,
                          position: 'absolute',
                          top: -8,
                          right: -12,
                          fontSize: 10,
                          height: 18,
                          minWidth: 18,
                          lineHeight: '18px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }} 
                      />
                    )}
                  </div>
                  <span className="tab-label">{section.label}</span>
                  <div className="tab-underline"></div>
                </button>
              </Tooltip>
            ))}
          </div>
          
          {/* Indicateur de statut en temps réel */}
          <div className="realtime-status">
            <div className="status-dot"></div>
            <span className="status-text">
              {activeVehiclesCount} véhicule(s) actif(s)
            </span>
            <div className="status-divider"></div>
            <ThunderboltOutlined className="status-icon" />
            <span className="status-text">Temps réel</span>
          </div>
        </div>

        {/* Contenu avec animation */}
        <div className="flex-content">
          <div className="content-wrapper fade-in">
            {getSectionContent()}
          </div>
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
        
        /* Premium Loader */
        .premium-loader {
          text-align: center;
          padding: 60px;
        }
        
        .loader-icon {
          font-size: 48px;
          color: #667eea;
          animation: spin 2s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .loader-text {
          font-size: 16px;
          color: #666;
          margin-bottom: 20px;
        }
        
        .loader-progress {
          width: 200px;
          height: 4px;
          background: #e8e8e8;
          border-radius: 4px;
          overflow: hidden;
          margin: 0 auto;
        }
        
        .loader-progress-bar {
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 4px;
          animation: loading 1.5s ease-in-out infinite;
        }
        
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .loading-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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