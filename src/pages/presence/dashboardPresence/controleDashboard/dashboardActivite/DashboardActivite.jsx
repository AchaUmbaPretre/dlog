import React from 'react';
import { LineChartOutlined, DownloadOutlined, WarningOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import './dashboardActivite.scss';

const DashboardActivite = ({ data = [], globalStats = {} }) => {
  // Données pour le graphique
  const chartData = {
    labels: data.map(item => item.heure) || ['06h', '11h', '12h', '13h', '14h', '15h', '16h', '17h'],
    datasets: [
      {
        label: 'Retards',
        data: data.map(item => item.retards) || [8, 15, 22, 18, 25, 30, 28, 20],
        borderColor: '#fa8c16',
        backgroundColor: 'rgba(250, 140, 22, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Absents',
        data: data.map(item => item.absents) || [12, 18, 25, 30, 28, 22, 18, 15],
        borderColor: '#f5222d',
        backgroundColor: 'rgba(245, 34, 45, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  return (
    <div className="dashboard-section activite-section">
      <div className="section-header">
        <LineChartOutlined />
        <span>Activité - Événements par Heure</span>
      </div>

      {/* Mini cartes récapitulatives */}
      <div className="activity-summary">
        <div className="summary-card retards">
          <div className="summary-content">
            <span className="summary-label">Total Retards</span>
            <span className="summary-value">{globalStats.retards || 0}</span>
          </div>
        </div>

        <div className="summary-card absents">
          <div className="summary-content">
            <span className="summary-label">Total Absents</span>
            <span className="summary-value">{globalStats.absents || 0}</span>
          </div>
        </div>
      </div>

      {/* Graphique */}
      <div className="chart-container" style={{ height: '250px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DashboardActivite;