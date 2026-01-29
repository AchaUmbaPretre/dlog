import React from 'react';
import {
  CheckOutlined,
  ClockCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import './dashboardStats.scss';

const DashboardStats = () => {
  return (
    <div className="dashboard-stats">
      
      <div className="stat-item">
        <div className="stat-value">80<span>/100</span></div>
        <div className="stat-label">
          <CheckOutlined  style={{color:'green'}}/>
          Présents aujourd’hui
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-value">50</div>
        <div className="stat-label">
          <ClockCircleOutlined />
          Retards
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-value">40</div>
        <div className="stat-label">
          <StopOutlined />
          Absences
        </div>
      </div>

    </div>
  );
};

export default DashboardStats;
