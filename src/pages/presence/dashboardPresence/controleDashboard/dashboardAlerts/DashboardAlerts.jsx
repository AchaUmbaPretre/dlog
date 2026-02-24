import React from 'react';
import { AlertOutlined, EnvironmentOutlined, UserOutlined, WifiOutlined } from '@ant-design/icons';
import './dashboardAlerts.scss';

const DashboardAlerts = () => {
  const alerts = [
    {
      id: 1,
      title: "Pointage hors géofence",
      location: "Cobra",
      time: "08:12",
      description: "GPS hors zone",
      action: "Ouvrir",
      icon: <EnvironmentOutlined />,
      type: "critical"
    },
    {
      id: 2,
      title: "Absence non signalée",
      location: "Lubumbashi",
      time: "08:20",
      description: "Non notifié",
      action: "Examiner",
      icon: <UserOutlined />,
      type: "warning"
    },
    {
      id: 3,
      title: "Queue offline détectée",
      location: "Goma",
      time: "07:58",
      description: "12 événements en attente",
      action: "Voir",
      icon: <WifiOutlined />,
      type: "info"
    }
  ];

  return (
    <div className="dashboard-section alerts-section">
      <div className="section-header">
        <AlertOutlined />
        <span>Alerte</span>
      </div>
      
      <div className="alerts-container">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.type}`}>
            <div className="alert-icon">
              {alert.icon}
            </div>
            
            <div className="alert-content">
              <div className="alert-header">
                <span className="alert-title">{alert.title}</span>
                <span className="alert-time">{alert.time}</span>
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