import React, { useState } from 'react';
import {
  CarOutlined,
  RocketOutlined,
  PauseCircleOutlined,
  BarChartOutlined,
  DashboardOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Badge, Tag, Space, Progress } from 'antd';

export const ControlPanel = ({ stats, filterStatus, onFilterChange, showTrajectories, onToggleTrajectories }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getEfficiencyColor = () => {
    if (stats.avgEfficiency >= 80) return '#10b981';
    if (stats.avgEfficiency >= 60) return '#f59e0b';
    return '#ef4444';
  };
  
  return (
    <div className={`premium-control-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="panel-header-premium" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-left">
          <DashboardOutlined className="logo" />
          <span className="title">Fleet Command Center</span>
          <div className="live-badge">
            <span className="pulse-dot"></span>
            <span>LIVE</span>
          </div>
        </div>
        <button className="toggle-btn">
          {isExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </button>
      </div>
      
      {isExpanded && (
        <>
          {/* Indicateur de performance globale */}
          <div className="global-efficiency-indicator">
            <div className="efficiency-header">
              <ThunderboltOutlined />
              <span>Performance globale</span>
            </div>
            <Progress 
              percent={stats.avgEfficiency} 
              strokeColor={getEfficiencyColor()}
              trailColor="#f1f5f9"
              status={stats.avgEfficiency >= 60 ? 'active' : 'exception'}
            />
          </div>
          
          <div className="filter-bar-premium">
            <button
              className={`filter-premium ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => onFilterChange('all')}
            >
              <GlobalOutlined />
              Tous
              <Badge count={stats.total} />
            </button>
            
            <button
              className={`filter-premium moving ${filterStatus === 'moving' ? 'active' : ''}`}
              onClick={() => onFilterChange('moving')}
            >
              <RocketOutlined />
              En marche
              <Badge count={stats.moving} />
            </button>
            
            <button
              className={`filter-premium stopped ${filterStatus === 'stopped' ? 'active' : ''}`}
              onClick={() => onFilterChange('stopped')}
            >
              <PauseCircleOutlined />
              Arrêtés
              <Badge count={stats.stopped} />
            </button>
            
            <button
              className={`filter-premium trajectory ${showTrajectories ? 'active' : ''}`}
              onClick={onToggleTrajectories}
            >
              {showTrajectories ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              Trajectoires
            </button>
          </div>

          <div className="additional-info">
            <Space size={12} wrap>
              <Tag icon={<CheckCircleOutlined />} color="success">
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
        .global-efficiency-indicator {
          padding: 16px 20px 0 20px;
        }
        
        .efficiency-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        
        .premium-control-panel {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
          margin: 16px;
        }
        
        .panel-header-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
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
          color: #0f172a;
          font-size: 14px;
        }
        
        .live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2px 10px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 30px;
          font-size: 10px;
          font-weight: 600;
          color: #ef4444;
        }
        
        .stats-grid-premium {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .stat-premium {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 12px;
        }
        
        .stat-icon {
          font-size: 20px;
          color: #94a3b8;
        }
        
        .stat-premium.moving .stat-icon { color: #10b981; }
        .stat-premium.stopped .stat-icon { color: #f59e0b; }
        .stat-premium.efficiency .stat-icon { color: #8b5cf6; }
        .stat-premium.distance .stat-icon { color: #3b82f6; }
        
        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 10px;
          color: #64748b;
        }
        
        .filter-bar-premium {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          flex-wrap: wrap;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .filter-premium {
          padding: 7px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #0f172a;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        
        .filter-premium:hover {
          background: #f1f5f9;
          transform: translateY(-1px);
        }
        
        .filter-premium.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }
        
        .filter-premium.moving.active { background: #10b981; }
        .filter-premium.stopped.active { background: #f59e0b; }
        .filter-premium.trajectory.active { background: #8b5cf6; }
        
        .filter-premium :global(.ant-badge-count) {
          font-size: 10px;
          height: 18px;
          line-height: 18px;
          padding: 0 6px;
          min-width: 18px;
          background: rgba(0, 0, 0, 0.15);
          box-shadow: none;
        }
        
        .filter-premium.active :global(.ant-badge-count) {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .additional-info {
          padding: 12px 20px;
        }
        
        .additional-info :global(.ant-tag) {
          margin: 0;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11px;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};