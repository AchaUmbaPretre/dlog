import React, { useState } from 'react';

export const ControlPanel = ({ stats, filterStatus, onFilterChange, showTrajectories, onToggleTrajectories }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className={`premium-control-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="panel-header-premium" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-left">
          <span className="logo">🚀</span>
          <span className="title">Fleet Command Center</span>
          <span className="live-badge">
            <span className="pulse-dot"></span>
            LIVE
          </span>
        </div>
        <button className="toggle-btn">{isExpanded ? '▼' : '▲'}</button>
      </div>
      
      {isExpanded && (
        <>
          <div className="stats-grid-premium">
            <div className="stat-premium">
              <span className="stat-icon">🚗</span>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Véhicules</span>
              </div>
            </div>
            
            <div className="stat-premium moving">
              <span className="stat-icon">🚀</span>
              <div className="stat-info">
                <span className="stat-value">{stats.moving}</span>
                <span className="stat-label">En marche</span>
              </div>
            </div>
            
            <div className="stat-premium stopped">
              <span className="stat-icon">⏸️</span>
              <div className="stat-info">
                <span className="stat-value">{stats.stopped}</span>
                <span className="stat-label">Arrêtés</span>
              </div>
            </div>
            
            <div className="stat-premium efficiency">
              <span className="stat-icon">📊</span>
              <div className="stat-info">
                <span className="stat-value">{stats.avgEfficiency}%</span>
                <span className="stat-label">Efficacité</span>
              </div>
            </div>
            
            <div className="stat-premium distance">
              <span className="stat-icon">📏</span>
              <div className="stat-info">
                <span className="stat-value">{stats.totalDistance}</span>
                <span className="stat-label">km</span>
              </div>
            </div>
          </div>
          
          <div className="filter-bar-premium">
            <button
              className={`filter-premium ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => onFilterChange('all')}
            >
              Tous
              <span className="count">{stats.total}</span>
            </button>
            <button
              className={`filter-premium moving ${filterStatus === 'moving' ? 'active' : ''}`}
              onClick={() => onFilterChange('moving')}
            >
              🚀 En marche
              <span className="count">{stats.moving}</span>
            </button>
            <button
              className={`filter-premium stopped ${filterStatus === 'stopped' ? 'active' : ''}`}
              onClick={() => onFilterChange('stopped')}
            >
              ⏸️ Arrêtés
              <span className="count">{stats.stopped}</span>
            </button>
            <button
              className={`filter-premium trajectory ${showTrajectories ? 'active' : ''}`}
              onClick={onToggleTrajectories}
            >
              {showTrajectories ? '📌' : '📍'} Trajectoires
            </button>
          </div>
        </>
      )}
      
      <style jsx>{`
        .premium-control-panel {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          transition: all 0.3s;
          min-width: 280px;
        }
        
        .premium-control-panel.collapsed {
          min-width: auto;
        }
        
        .panel-header-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo {
          font-size: 20px;
        }
        
        .title {
          font-weight: 600;
          color: white;
          font-size: 14px;
        }
        
        .live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px;
          background: rgba(239,68,68,0.2);
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          color: #ef4444;
        }
        
        .pulse-dot {
          width: 6px;
          height: 6px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        
        .toggle-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 10px;
        }
        
        .stats-grid-premium {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .stat-premium {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .stat-icon {
          font-size: 24px;
        }
        
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: white;
        }
        
        .stat-label {
          font-size: 10px;
          color: #94a3b8;
        }
        
        .filter-bar-premium {
          display: flex;
          gap: 8px;
          padding: 16px;
          flex-wrap: wrap;
        }
        
        .filter-premium {
          padding: 6px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .filter-premium:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-1px);
        }
        
        .filter-premium.active {
          background: #3b82f6;
          border-color: #3b82f6;
        }
        
        .filter-premium .count {
          background: rgba(0,0,0,0.3);
          padding: 0 4px;
          border-radius: 4px;
          font-size: 10px;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};
