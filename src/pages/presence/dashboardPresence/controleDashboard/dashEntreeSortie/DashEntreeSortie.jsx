import React from 'react';
import './dashEntreeSortie.scss';
import { BarChartOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';

const DashEntreeSortie = ({ data = [] }) => {
  // Données par défaut si aucune donnée
  const chartData = {
    labels: data.map(item => item.heure) || ['06:00', '07:00', '08:00', '10:00', '11:00', '12:00'],
    datasets: [
      {
        label: 'Entrées',
        data: data.map(item => item.entrees) || [2, 6, 14, 16, 12, 8],
        backgroundColor: '#4CAF50',
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: 'Sorties',
        data: data.map(item => item.sorties) || [1, 4, 8, 12, 14, 10],
        backgroundColor: '#F44336',
        borderRadius: 6,
        barPercentage: 0.6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} personnes`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2 }
      }
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <BarChartOutlined />
        Entrées / Sorties dernières heures
      </div>
      
      <div className="chart-wrapper" style={{ height: '250px' }}>
        <Bar data={chartData} options={options} />
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color entries-color"></span>
          <span>Entrées</span>
        </div>
        <div className="legend-item">
          <span className="legend-color exits-color"></span>
          <span>Sorties</span>
        </div>
      </div>
    </div>
  );
};

export default DashEntreeSortie;