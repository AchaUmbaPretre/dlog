import React, { useState } from 'react';
import { VEHICLE_STATUS, STATUS_ICONS, STATUS_COLORS } from '../constants/map.constants';
import { VehicleAddress } from '../../../../../../utils/vehicleAddress';
import { IntelligentETA } from './IntelligentETA';

export const PremiumVehiclePopup = ({ vehicle, addressRecord }) => {
  const [activeTab, setActiveTab] = useState('info');
  
  const tabs = [
    { id: 'info', label: '📋 Infos', icon: '📋' },
    { id: 'stats', label: '📊 Stats', icon: '📊' },
    { id: 'history', label: '📜 Historique', icon: '📜' }
  ];
  
  return (
    <div className="premium-popup-content">
      {/* Header avec gradient */}
      <div className="popup-header-premium" style={{
        background: `linear-gradient(135deg, ${STATUS_COLORS[vehicle.status]}20, transparent)`,
        borderBottom: `2px solid ${STATUS_COLORS[vehicle.status]}`
      }}>
        <div className="vehicle-title">
          <span className="status-badge-premium" style={{ background: STATUS_COLORS[vehicle.status] }}>
            {STATUS_ICONS[vehicle.status]} {vehicle.status === VEHICLE_STATUS.MOVING ? 'En route' : 'Stationné'}
          </span>
          <h3>{vehicle.name}</h3>
          <span className="registration">{vehicle.registration}</span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="popup-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Contenu des tabs */}
      <div className="popup-tab-content">
        {activeTab === 'info' && (
          <div className="info-tab">
            <div className="info-row">
              <span className="info-icon">📍</span>
              <div className="info-content">
                <label>Position actuelle</label>
                <VehicleAddress record={addressRecord} />
              </div>
            </div>
            
            <div className="info-row">
              <span className="info-icon">👤</span>
              <div className="info-content">
                <label>Chauffeur</label>
                <span className="info-value">{vehicle.driver}</span>
              </div>
            </div>
            
            <div className="info-row">
              <span className="info-icon">📍</span>
              <div className="info-content">
                <label>Destination</label>
                <span className="info-value">{vehicle.destination || 'Non définie'}</span>
              </div>
            </div>
            
            <div className="info-row">
              <span className="info-icon">🏢</span>
              <div className="info-content">
                <label>Service</label>
                <span className="info-value">{vehicle.service}</span>
              </div>
            </div>
            
            {vehicle.comment && (
              <div className="info-row comment">
                <span className="info-icon">💬</span>
                <div className="info-content">
                  <label>Commentaire</label>
                  <span className="info-value">{vehicle.comment}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="stats-tab">
            <div className="stat-card-premium">
              <div className="stat-label">Efficacité</div>
              <div className="stat-value-large">{vehicle.efficiency}%</div>
              <div className="progress-bar-large">
                <div className="progress-fill" style={{ width: `${vehicle.efficiency}%`, background: `linear-gradient(90deg, ${STATUS_COLORS[vehicle.status]}, #3b82f6)` }} />
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat-item-premium">
                <span className="stat-icon">⚡</span>
                <div>
                  <div className="stat-label">Vitesse</div>
                  <div className="stat-value">{vehicle.speed} <span className="stat-unit">km/h</span></div>
                </div>
              </div>
              
              <div className="stat-item-premium">
                <span className="stat-icon">📏</span>
                <div>
                  <div className="stat-label">Distance totale</div>
                  <div className="stat-value">{vehicle.totalDistance.toFixed(1)} <span className="stat-unit">km</span></div>
                </div>
              </div>
              
              <div className="stat-item-premium">
                <span className="stat-icon">⏸️</span>
                <div>
                  <div className="stat-label">Temps d'arrêt</div>
                  <div className="stat-value">{vehicle.stopDurationFormatted}</div>
                </div>
              </div>
              
              <div className="stat-item-premium">
                <span className="stat-icon">🕐</span>
                <div>
                  <div className="stat-label">Dernière mise à jour</div>
                  <div className="stat-value-small">{vehicle.lastUpdate}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eta' && (
      <div className="eta-tab">
        <IntelligentETA vehicle={vehicle} />
        
        {vehicle.destinationPolygon && (
          <div className="geofence-preview">
            <div className="geofence-title">🗺️ Zone de livraison</div>
            <div className="geofence-coords">
              {vehicle.destinationPolygon.length} points de géofencing
            </div>
          </div>
        )}
      </div>
    )}
        
        {activeTab === 'history' && (
          <div className="history-tab">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot moving" />
                <div className="timeline-content">
                  <div className="timeline-title">Départ</div>
                  <div className="timeline-date">{vehicle.startTime ? new Date(vehicle.startTime).toLocaleString() : 'Non défini'}</div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-dot stopped" />
                <div className="timeline-content">
                  <div className="timeline-title">Retour prévu</div>
                  <div className="timeline-date">{vehicle.expectedReturn ? new Date(vehicle.expectedReturn).toLocaleString() : 'Non défini'}</div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-dot info" />
                <div className="timeline-content">
                  <div className="timeline-title">Statut actuel</div>
                  <div className="timeline-date">{vehicle.status === VEHICLE_STATUS.MOVING ? 'En déplacement' : 'À l\'arrêt'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .premium-popup-content {
          min-width: 320px;
          max-width: 380px;
        }
        
        .popup-header-premium {
          padding: 16px;
          border-radius: 12px 12px 0 0;
        }
        
        .vehicle-title h3 {
          margin: 8px 0 4px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .status-badge-premium {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          color: white;
        }
        
        .registration {
          font-size: 11px;
          color: #6b7280;
        }
        
        .popup-tabs {
          display: flex;
          gap: 4px;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .tab-btn {
          flex: 1;
          padding: 8px;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        
        .tab-btn:hover {
          background: #f3f4f6;
        }
        
        .tab-btn.active {
          background: #3b82f6;
          color: white;
        }
        
        .popup-tab-content {
          padding: 12px 0;
        }
        
        .info-row {
          display: flex;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .info-icon {
          width: 24px;
          font-size: 16px;
        }
        
        .info-content {
          flex: 1;
        }
        
        .info-content label {
          display: block;
          font-size: 10px;
          color: #9ca3af;
          margin-bottom: 2px;
        }
        
        .info-value {
          font-size: 13px;
          color: #1f2937;
        }
        
        .stat-card-premium {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          color: white;
          text-align: center;
        }
        
        .stat-value-large {
          font-size: 32px;
          font-weight: bold;
          margin: 8px 0;
        }
        
        .progress-bar-large {
          height: 6px;
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        .stat-item-premium {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .stat-icon {
          font-size: 24px;
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
        }
        
        .stat-value-small {
          font-size: 11px;
          color: #6b7280;
        }
        
        .stat-unit {
          font-size: 10px;
          font-weight: normal;
        }
        
        .timeline {
          position: relative;
          padding-left: 20px;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e5e7eb;
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 16px;
        }
        
        .timeline-dot {
          position: absolute;
          left: -20px;
          top: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .timeline-dot.moving { background: #10b981; }
        .timeline-dot.stopped { background: #f59e0b; }
        .timeline-dot.info { background: #3b82f6; }
        
        .timeline-content {
          padding-left: 12px;
        }
        
        .timeline-title {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }
        
        .timeline-date {
          font-size: 10px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};