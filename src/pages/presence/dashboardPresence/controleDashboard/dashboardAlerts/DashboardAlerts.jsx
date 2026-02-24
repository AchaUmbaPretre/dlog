import React from 'react';
import { AlertOutlined, EnvironmentOutlined, UserOutlined, WifiOutlined } from '@ant-design/icons';
import './dashboardAlerts.scss';

const DashboardAlerts = ({ data = [] }) => {
  // Données par défaut si aucune donnée
  const alerts = data.length > 0 ? data : [
    {
      id: 1,
      titre: "Pointage hors géofence",
      location: "Cobra",
      heure: "08:12",
      description: "GPS hors zone",
      action: "Ouvrir",
      type: "critical"
    },
    {
      id: 2,
      titre: "Absence non signalée",
      location: "Lubumbashi",
      heure: "08:20",
      description: "Non notifié",
      action: "Examiner",
      type: "warning"
    },
    {
      id: 3,
      titre: "Queue offline détectée",
      location: "Goma",
      heure: "07:58",
      description: "12 événements en attente",
      action: "Voir",
      type: "info"
    }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'critical': return <EnvironmentOutlined />;
      case 'warning': return <UserOutlined />;
      default: return <WifiOutlined />;
    }
  };

  return (
    <div className="dashboard-section alerts-section">
      <div className="section-header">
        <AlertOutlined />
        <span>Alertes ({alerts.length})</span>
      </div>
      
      <div className="alerts-container">
        {alerts.map((alert, index) => (
          <div key={index} className={`alert-item ${alert.type}`}>
            <div className="alert-icon">
              {getIcon(alert.type)}
            </div>
            
            <div className="alert-content">
              <div className="alert-header">
                <span className="alert-title">{alert.titre}</span>
                <span className="alert-time">{alert.heure}</span>
              </div>
              
              <div className="alert-details">
                <span className="alert-location">{alert.location}</span>
                <span className="alert-description">| {alert.description}</span>
              </div>
            </div>
            
            <button className={`alert-action ${alert.type}`}>
              {alert.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAlerts;