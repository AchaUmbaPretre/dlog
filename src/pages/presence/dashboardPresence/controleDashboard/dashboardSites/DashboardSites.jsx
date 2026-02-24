import React from 'react';
import { FileTextOutlined, TeamOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './dashboardSites.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardSites = () => {
  const data = {
    labels: ['Cobra', 'Goma', 'Lubumbashi', 'Matadi'],
    datasets: [
      {
        data: [68, 45, 82, 32],
        backgroundColor: [
          '#4CAF50', // Vert pour Cobra
          '#2196F3', // Bleu pour Goma
          '#FF9800', // Orange pour Lubumbashi
          '#F44336'  // Rouge pour Matadi
        ],
        borderColor: 'white',
        borderWidth: 3,
        hoverOffset: 8,
        borderRadius: 8,
        spacing: 8,
      }
    ]
  };

  const options = {
    cutout: '65%',
    radius: '80%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10
      }
    }
  };

  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
  
  const sites = [
    { name: 'Cobra', value: 68, color: '#4CAF50', percentage: Math.round((68 / total) * 100) },
    { name: 'Goma', value: 45, color: '#2196F3', percentage: Math.round((45 / total) * 100) },
    { name: 'Lubumbashi', value: 82, color: '#FF9800', percentage: Math.round((82 / total) * 100) },
    { name: 'Matadi', value: 32, color: '#F44336', percentage: Math.round((32 / total) * 100) }
  ];

  // Statistiques globales
  const globalStats = {
    presents: 145,
    retards: 23,
    absents: 18,
    total: 186
  };

  return (
    <div className="dashboard-section sites-section">
      <div className="section-header">
        <FileTextOutlined />
        <span>Présence par Site</span>
      </div>

      {/* Mini légende des couleurs */}
      <div className="color-hint">
        <div className="hint-item">
          <span className="hint-dot present-dot"></span>
          <span className="hint-text">Présent</span>
        </div>
        <div className="hint-item">
          <span className="hint-dot retard-dot"></span>
          <span className="hint-text">Retard</span>
        </div>
        <div className="hint-item">
          <span className="hint-dot absent-dot"></span>
          <span className="hint-text">Absent</span>
        </div>
      </div>
      
      <div className="sites-content">
        {/* Graphique Donut */}
        <div className="chart-wrapper">
          <Doughnut data={data} options={options} />
          <div className="chart-center">
            <span className="total-value">{total}</span>
            <span className="total-label">Total<br/>présences</span>
          </div>
        </div>

        {/* Légende des sites */}
        <div className="sites-legend">
          {sites.map((site) => (
            <div key={site.name} className="legend-item">
              <div className="legend-info">
                <div className="legend-color" style={{ backgroundColor: site.color }} />
                <span className="site-name">{site.name}</span>
              </div>
              <div className="legend-values">
                <span className="site-value">{site.value}</span>
                <span className="site-percentage">({site.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="sites-footer">
        <div className="stat-card">
          <span className="stat-label">Site le plus actif</span>
          <span className="stat-value" style={{ color: '#FF9800' }}>Lubumbashi</span>
          <span className="stat-detail">82 présences</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Présence moyenne</span>
          <span className="stat-value">57</span>
          <span className="stat-detail">par site</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Taux de présence</span>
          <span className="stat-value" style={{ color: '#52c41a' }}>
            {Math.round((globalStats.presents / globalStats.total) * 100)}%
          </span>
          <span className="stat-detail">global</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSites;