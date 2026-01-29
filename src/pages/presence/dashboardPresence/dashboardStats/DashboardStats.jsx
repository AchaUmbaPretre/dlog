import React from 'react';
import {
  CheckOutlined,
  ClockCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import './dashboardStats.scss';

const DashboardStats = ({ kpi }) => {
  if (!kpi) return null; // Sécurité si kpi n'est pas encore chargé

  const { total, presents, absents, retards } = kpi;

  return (
    <div className="dashboard-stats">
      
      {/* Présents */}
      <div className="stat-item">
        <div className="stat-value">
          {presents ?? 0}<span>/{total}</span>
        </div>
        <div className="stat-label">
          <CheckOutlined style={{ color: 'green', marginRight: 6 }} />
          Présents aujourd’hui
        </div>
      </div>

      {/* Retards */}
      <div className="stat-item">
        <div className="stat-value">{retards ?? 0}</div>
        <div className="stat-label">
          <ClockCircleOutlined style={{ color: '#faad14', marginRight: 6 }} />
          Retards
        </div>
      </div>

      {/* Absences */}
      <div className="stat-item">
        <div className="stat-value">{absents ?? 0}</div>
        <div className="stat-label">
          <StopOutlined style={{ color: 'red', marginRight: 6 }} />
          Absences
        </div>
      </div>

    </div>
  );
};

export default DashboardStats;
