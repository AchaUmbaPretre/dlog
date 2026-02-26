import { FileTextOutlined } from '@ant-design/icons';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './dashboardSites.scss';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardSites = ({ data = [], globalStats = {}, topSites = [] }) => {
  // État local pour les données formatées
  const [formattedData, setFormattedData] = useState({
    sites: [],
    total: 0,
    averagePresence: 0,
    presenceRate: 0,
    mostActiveSite: { nom_site: 'Aucun site', totalPresences: 0 }
  });

  useEffect(() => {
    // Vérifier si nous avons des données
    const hasData = data && data.length > 0;
    
    if (hasData) {
      // Calculer le total des présences
      const total = data.reduce((acc, item) => acc + (item.value || 0), 0);
      
      // Formater les sites avec pourcentages
      const sites = data.map(item => ({
        name: item.site || 'Site inconnu',
        value: item.value || 0,
        color: item.color || '#ccc',
        percentage: item.percentage || (total > 0 ? Math.round((item.value / total) * 100) : 0)
      }));

      // Site le plus actif
      const mostActive = topSites && topSites.length > 0 
        ? topSites[0] 
        : (sites.length > 0 
            ? sites.reduce((max, site) => site.value > max.value ? site : max, sites[0])
            : { name: 'Aucun site', value: 0 });

      // Calcul de la présence moyenne
      const averagePresence = sites.length > 0 ? Math.round(total / sites.length) : 0;

      // Taux de présence global
      const totalGlobal = globalStats?.total || 
                         (globalStats?.presents + globalStats?.retards + globalStats?.absents) || 
                         total || 1; // Éviter la division par zéro
      const presenceRate = globalStats?.presents 
        ? Math.round((globalStats.presents / totalGlobal) * 100)
        : (total > 0 ? 100 : 0); // Si pas de stats globales, considérer 100% de présence

      setFormattedData({
        sites,
        total,
        averagePresence,
        presenceRate,
        mostActiveSite: {
          nom_site: mostActive.nom_site || mostActive.name,
          totalPresences: mostActive.totalPresences || mostActive.value
        }
      });
    } else {
      // Données de démonstration si aucune donnée réelle
      const demoData = [
        { site: 'Lubumbashi', value: 45, color: '#4CAF50' },
        { site: 'Kinshasa', value: 38, color: '#2196F3' },
        { site: 'Kolwezi', value: 22, color: '#FF9800' },
        { site: 'Likasi', value: 15, color: '#F44336' }
      ];
      
      const total = demoData.reduce((acc, item) => acc + item.value, 0);
      
      setFormattedData({
        sites: demoData.map(item => ({
          ...item,
          percentage: Math.round((item.value / total) * 100)
        })),
        total,
        averagePresence: Math.round(total / demoData.length),
        presenceRate: 78, // Taux de démonstration
        mostActiveSite: { nom_site: 'Lubumbashi', totalPresences: 45 }
      });
    }
  }, [data, globalStats, topSites]);

  // Données pour le graphique
  const chartData = {
    labels: formattedData.sites.map(item => item.name || item.site),
    datasets: [
      {
        data: formattedData.sites.map(item => item.value),
        backgroundColor: formattedData.sites.map(item => item.color),
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
            const value = context.raw || 0;
            const percentage = formattedData.total > 0 
              ? Math.round((value / formattedData.total) * 100) 
              : 0;
            return `${context.label}: ${value} personnes (${percentage}%)`;
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
            <span className="total-value">{formattedData.total}</span>
            <span className="total-label">Total<br/>présences</span>
          </div>
        </div>

        {/* Légende des sites */}
        <div className="sites-legend">
          {formattedData.sites.map((site, index) => (
            <div key={index} className="legend-item">
              <div className="legend-info">
                <div className="legend-color" style={{ backgroundColor: site.color }} />
                <span className="site-name">{site.name || site.site}</span>
              </div>
              <div className="legend-values">
                <span className="site-value">{site.value}</span>
                <span className="site-percentage">({site.percentage ?? 0}%)</span>
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
            {formattedData.mostActiveSite.nom_site}
          </span>
          <span className="stat-detail">
            {formattedData.mostActiveSite.totalPresences} présences
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Présence moyenne</span>
          <span className="stat-value">{formattedData.averagePresence}</span>
          <span className="stat-detail">par site</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Taux de présence</span>
          <span className="stat-value" style={{ color: '#52c41a' }}>
            {formattedData.presenceRate}%
          </span>
          <span className="stat-detail">global</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSites;