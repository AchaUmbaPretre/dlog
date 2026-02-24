import { LineChartOutlined, DownloadOutlined, WarningOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './dashboardActivite.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardActivite = () => {
  // Données pour les retards et absents par heure
  const data = {
    labels: ['06h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '17h', '17h'],
    datasets: [
      {
        label: 'Retards',
        data: [8, 15, 22, 18, 25, 30, 28, 20, 15, 10],
        borderColor: '#fa8c16',
        backgroundColor: 'rgba(250, 140, 22, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fa8c16',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Absents',
        data: [12, 18, 25, 30, 28, 22, 18, 15, 12, 8],
        borderColor: '#f5222d',
        backgroundColor: 'rgba(245, 34, 45, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#f5222d',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} événements`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
        },
        ticks: {
          stepSize: 10,
          color: '#8c8c8c',
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Nombre d\'événements',
          color: '#8c8c8c',
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#8c8c8c',
          font: {
            size: 11,
            weight: '500'
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hoverBorderWidth: 2,
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  // Statistiques récapitulatives
  const stats = {
    totalRetards: data.datasets[0].data.reduce((a, b) => a + b, 0),
    totalAbsents: data.datasets[1].data.reduce((a, b) => a + b, 0),
    picRetards: Math.max(...data.datasets[0].data),
    picAbsents: Math.max(...data.datasets[1].data),
    heurePic: '15h'
  };

  return (
    <div className="dashboard-section activite-section">
      <div className="section-header">
        <LineChartOutlined />
        <span>Événements par Heure</span>
      </div>

      <div className="activity-summary">
        <div className="summary-card retards">
          <div className="summary-icon">
            <span className="dot retard-dot"></span>
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Retards</span>
            <span className="summary-value">{stats.totalRetards}</span>
          </div>
          <div className="summary-trend">
            Pic: {stats.picRetards} à {stats.heurePic}
          </div>
        </div>

        <div className="summary-card absents">
          <div className="summary-icon">
            <span className="dot absent-dot"></span>
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Absents</span>
            <span className="summary-value">{stats.totalAbsents}</span>
          </div>
          <div className="summary-trend">
            Pic: {stats.picAbsents} à {stats.heurePic}
          </div>
        </div>
      </div>

      {/* Graphique */}
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>

      {/* Légende des heures (comme dans l'image) */}
      <div className="time-legend">
        {data.labels.map((time, index) => (
          <div key={index} className="time-marker">
            {time}
            {index === data.labels.length - 1 && (
              <span className="time-indicator">(heure actuelle)</span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default DashboardActivite;