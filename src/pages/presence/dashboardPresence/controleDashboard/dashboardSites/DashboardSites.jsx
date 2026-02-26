import { FileTextOutlined } from '@ant-design/icons';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './dashboardSites.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardSites = ({ data = [], globalStats = {}, topSites = [] }) => {
  // Vérifier si nous avons des données
  const hasData = data && data.length > 0;

  // Données pour le graphique (soit depuis les props, soit fallback)
  const chartData = {
    labels: hasData ? data.map(item => item.site) : ['Cobra', 'Goma', 'Lubumbashi', 'Matadi'],
    datasets: [
      {
        data: hasData ? data.map(item => item.value) : [68, 45, 82, 32],
        backgroundColor: hasData ? data.map(item => item.color) : [
          '#4CAF50',
          '#2196F3',
          '#FF9800',
          '#F44336'
        ],
        borderColor: 'white',
        borderWidth: 3,
        hoverOffset: 8,
        borderRadius: 8,
        spacing: 8,
      }
    ]
  };

  // Calcul du total
  const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);

  // Sites avec pourcentages calculés
  const sites = hasData ? data.map(item => ({
    name: item.site,
    value: item.value,
    color: item.color,
    percentage: item.percentage || Math.round((item.value / total) * 100)
  })) : [
    { name: 'Cobra', value: 68, color: '#4CAF50', percentage: Math.round((68 / total) * 100) },
    { name: 'Goma', value: 45, color: '#2196F3', percentage: Math.round((45 / total) * 100) },
    { name: 'Lubumbashi', value: 82, color: '#FF9800', percentage: Math.round((82 / total) * 100) },
    { name: 'Matadi', value: 32, color: '#F44336', percentage: Math.round((32 / total) * 100) }
  ];

  // Site le plus actif
  const mostActiveSite = topSites && topSites.length > 0 
    ? topSites[0] 
    : { nom_site: 'Lubumbashi', totalPresences: 82 };

  // Calcul de la présence moyenne
  const averagePresence = Math.round(total / (sites.length || 1));

  // Taux de présence global
  const totalGlobal = globalStats?.total || (globalStats?.presents + globalStats?.retards + globalStats?.absents) || 186;
  const presenceRate = globalStats?.presents 
    ? Math.round((globalStats.presents / totalGlobal) * 100)
    : Math.round((145 / 186) * 100);

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
            return `${context.label}: ${context.raw} personnes (${Math.round((context.raw / total) * 100)}%)`;
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
          <Doughnut data={chartData} options={options} />
          <div className="chart-center">
            <span className="total-value">{total}</span>
            <span className="total-label">Total<br/>présences</span>
          </div>
        </div>

        {/* Légende des sites */}
        <div className="sites-legend">
          {sites.map((site, index) => (
            <div key={index} className="legend-item">
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
          <span className="stat-value" style={{ color: '#FF9800' }}>
            {mostActiveSite.nom_site || mostActiveSite.site || 'N/A'}
          </span>
          <span className="stat-detail">
            {mostActiveSite.totalPresences || mostActiveSite.value || 0} présences
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Présence moyenne</span>
          <span className="stat-value">{averagePresence}</span>
          <span className="stat-detail">par site</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Taux de présence</span>
          <span className="stat-value" style={{ color: '#52c41a' }}>
            {presenceRate ?? 0}%
          </span>
          <span className="stat-detail">global</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSites;