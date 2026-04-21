import React from 'react';
import { FILTER_OPTIONS } from '../constants/map.constants';

export const ControlPanel = ({ stats, filterStatus, onFilterChange, showTrajectories, onToggleTrajectories }) => {
  return (
    <div className="control-panel">
      <div className="stats-container">
        <div className="stat-item">
          <strong>🚗 {stats.total}</strong> véhicules
        </div>
        <div className="stat-item moving">
          🟢 {stats.moving} en marche
        </div>
        <div className="stat-item stopped">
          🟡 {stats.stopped} arrêtés
        </div>
        <div className="stat-item">
          📊 {stats.avgEfficiency}% efficacité
        </div>
        <div className="stat-item">
          📏 {stats.totalDistance} km
        </div>
      </div>
      
      <div className="filter-container">
        {FILTER_OPTIONS.map(option => (
          <button
            key={option.id}
            className={`filter-btn ${filterStatus === option.id ? 'active' : ''}`}
            onClick={() => onFilterChange(option.id)}
          >
            {option.icon} {option.label} ({stats[option.id === 'all' ? 'total' : option.id]})
          </button>
        ))}
        
        <button
          className={`filter-btn ${showTrajectories ? 'active' : ''}`}
          onClick={onToggleTrajectories}
        >
          {showTrajectories ? '📌 Masquer' : '📍 Afficher'} trajectoires
        </button>
      </div>
      
      <style jsx>{`
        .control-panel {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          z-index: 1000;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          pointer-events: auto;
        }
        
        .stats-container {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        
        .stat-item {
          font-size: 13px;
        }
        
        .stat-item.moving {
          color: #22c55e;
        }
        
        .stat-item.stopped {
          color: #eab308;
        }
        
        .filter-container {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 6px 12px;
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        
        .filter-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .filter-btn.active {
          background: #3b82f6;
          color: white;
        }
      `}</style>
    </div>
  );
};
