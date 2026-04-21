import React, { useState } from 'react';
import {
  CarOutlined,
  RocketOutlined,
  PauseCircleOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DashboardOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { Badge, Tag, Space } from 'antd';

export const ControlPanel = ({ stats, filterStatus, onFilterChange, showTrajectories, onToggleTrajectories }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className={`premium-control-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="panel-header-premium" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-left">
          <DashboardOutlined className="logo" style={{ fontSize: 20, color: '#3b82f6' }} />
          <span className="title">Fleet Command Center</span>
          <div className="live-badge">
            <span className="pulse-dot"></span>
            LIVE
          </div>
        </div>
        <button className="toggle-btn">
          {isExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="stats-grid-premium">
            <div className="stat-premium">
              <CarOutlined className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Véhicules</span>
              </div>
            </div>
            
            <div className="stat-premium moving">
              <RocketOutlined className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.moving}</span>
                <span className="stat-label">En marche</span>
              </div>
            </div>
            
            <div className="stat-premium stopped">
              <PauseCircleOutlined className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.stopped}</span>
                <span className="stat-label">Arrêtés</span>
              </div>
            </div>
            
            <div className="stat-premium efficiency">
              <BarChartOutlined className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.avgEfficiency}%</span>
                <span className="stat-label">Efficacité</span>
              </div>
            </div>
            
            <div className="stat-premium distance">
              <LineChartOutlined className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.totalDistance}</span>
                <span className="stat-label">km parcourus</span>
              </div>
            </div>
          </div>
          
          <div className="filter-bar-premium">
            <button
              className={`filter-premium ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => onFilterChange('all')}
            >
              <GlobalOutlined />
              Tous
              <Badge count={stats.total} style={{ backgroundColor: '#3b82f6' }} />
            </button>
            
            <button
              className={`filter-premium moving ${filterStatus === 'moving' ? 'active' : ''}`}
              onClick={() => onFilterChange('moving')}
            >
              <RocketOutlined />
              En marche
              <Badge count={stats.moving} style={{ backgroundColor: '#10b981' }} />
            </button>
            
            <button
              className={`filter-premium stopped ${filterStatus === 'stopped' ? 'active' : ''}`}
              onClick={() => onFilterChange('stopped')}
            >
              <PauseCircleOutlined />
              Arrêtés
              <Badge count={stats.stopped} style={{ backgroundColor: '#f59e0b' }} />
            </button>
            
            <button
              className={`filter-premium trajectory ${showTrajectories ? 'active' : ''}`}
              onClick={onToggleTrajectories}
            >
              {showTrajectories ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              Trajectoires
            </button>
          </div>

          {/* Informations supplémentaires */}
          <div className="additional-info">
            <Space split={<span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>}>
              <Tag icon={<ThunderboltOutlined />} color="success">
                Efficacité {stats.avgEfficiency}%
              </Tag>
              <Tag icon={<ClockCircleOutlined />} color="processing">
                Temps réel
              </Tag>
            </Space>
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
          min-width: 320px;
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
          transition: background 0.2s;
        }
        
        .panel-header-premium:hover {
          background: rgba(255,255,255,0.05);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo {
          font-size: 20px;
          color: #3b82f6;
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
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .toggle-btn:hover {
          background: rgba(255,255,255,0.2);
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
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .stat-premium:hover {
          background: rgba(255,255,255,0.05);
        }
        
        .stat-icon {
          font-size: 20px;
          color: #94a3b8;
        }
        
        .stat-premium.moving .stat-icon {
          color: #10b981;
        }
        
        .stat-premium.stopped .stat-icon {
          color: #f59e0b;
        }
        
        .stat-premium.efficiency .stat-icon {
          color: #8b5cf6;
        }
        
        .stat-premium.distance .stat-icon {
          color: #3b82f6;
        }
        
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: white;
          line-height: 1.2;
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
        
        .filter-premium.moving.active {
          background: #10b981;
        }
        
        .filter-premium.stopped.active {
          background: #f59e0b;
        }
        
        .filter-premium.trajectory.active {
          background: #8b5cf6;
        }
        
        .filter-premium :global(.ant-badge) {
          margin-left: 4px;
        }
        
        .filter-premium :global(.ant-badge-count) {
          font-size: 10px;
          height: 16px;
          line-height: 16px;
          padding: 0 4px;
          min-width: 16px;
        }
        
        .additional-info {
          padding: 12px 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .additional-info :global(.ant-tag) {
          margin: 0;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};