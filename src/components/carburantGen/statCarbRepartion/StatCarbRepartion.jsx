// StatCarbRepartion.jsx - Version simplifiée
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  ArrowUpOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Spin, Empty } from "antd";
import "./statCarbRepartion.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatCarbRepartion = ({ data, loading }) => {
  // Normalisation des données
  const normalizedData = useMemo(() => {
    if (!data) return { repartition: [], totalLitres: 0, globalTendance: 0 };
    
    // Récupérer la répartition depuis différentes sources possibles
    let repartition = [];
    if (data.repartition && Array.isArray(data.repartition)) {
      repartition = data.repartition;
    } else if (data.data?.repartition) {
      repartition = data.data.repartition;
    }
    
    // Nettoyer et formater les données
    const validRepartition = repartition
      .filter(item => item && (item.volume || item.volume_litres || item.pourcentage))
      .map((item, index) => {
        const name = item.name || item.type_carburant || `Type ${index + 1}`;
        const volume = item.volume || item.volume_litres || 0;
        const pourcentage = item.pourcentage || item.percent || (volume > 0 ? volume / repartition.reduce((sum, i) => sum + (i.volume || i.volume_litres || 0), 0) * 100 : 0);
        const tendance = item.tendance || item.tendance_pct || 0;
        
        return {
          id: index,
          name: name,
          volume: volume,
          volume_formate: item.volume_formate || `${volume.toLocaleString('fr-FR')} L`,
          pourcentage: pourcentage,
          montant: item.montant || item.montant_usd || 0,
          montant_formate: item.montant_formate || `$ ${(item.montant || item.montant_usd || 0).toLocaleString('fr-FR')}`,
          tendance: tendance,
          tendance_formate: item.tendance_formate || `${tendance > 0 ? '+' : ''}${tendance}%`,
          tendance_positive: tendance >= 0,
          color: item.color || getCarburantColor(name)
        };
      });
    
    const totalLitres = validRepartition.reduce((sum, item) => sum + item.volume, 0);
    const globalTendance = data.kpi?.volume?.tendance || data.volume?.tendance || 0;
    
    return { repartition: validRepartition, totalLitres, globalTendance };
  }, [data]);

  const chartData = useMemo(() => ({
    labels: normalizedData.repartition.map(item => item.name),
    datasets: [{
      data: normalizedData.repartition.map(item => item.pourcentage),
      backgroundColor: normalizedData.repartition.map(item => item.color),
      borderWidth: 0,
      spacing: 4,
      borderRadius: 12,
      hoverOffset: 16,
    }],
  }), [normalizedData.repartition]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "84%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        cornerRadius: 14,
        padding: 14,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const item = normalizedData.repartition[context.dataIndex];
            if (!item) return [];
            return [
              `${item.name}: ${context.raw.toFixed(1)}%`,
              `Volume: ${item.volume_formate}`,
              `Montant: ${item.montant_formate}`,
              `Tendance: ${item.tendance_formate}`
            ];
          }
        },
      },
    },
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="fuelDistribution">
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" tip="Chargement des données..." />
        </div>
      </div>
    );
  }

  if (normalizedData.repartition.length === 0) {
    return (
      <div className="fuelDistribution">
        <Empty description="Aucune donnée de répartition disponible" />
      </div>
    );
  }

  return (
    <div className="fuelDistribution">
      <div className="distributionHeader">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="distributionLabel">Répartition par type de carburant</span>
          <div className="headerStats">
            <div className={`headerGrowth ${normalizedData.globalTendance >= 0 ? 'positive' : 'negative'}`}>
              <ArrowUpOutlined />
              {Math.abs(normalizedData.globalTendance).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="distributionBody">
        <div className="distributionChart">
          <div className="chartGlow" />
          <Doughnut data={chartData} options={options} />
          <div className="centerKPI">
            <DashboardOutlined />
            <h2>{normalizedData.totalLitres.toLocaleString('fr-FR')}</h2>
            <span>Litres</span>
            <small>Total consommé</small>
          </div>
        </div>

        <div className="distributionLegend">
          {normalizedData.repartition.map((item) => (
            <div key={item.id} className="legendItem">
              <div className="legendTop">
                <div className="legendLeft">
                  <span className="legendDot" style={{ background: item.color }} />
                  <div>
                    <h4>{item.name}</h4>
                    <span>{item.volume_formate}</span>
                  </div>
                </div>
                <div className="legendRight">
                  <div className="legendPercent">{item.pourcentage.toFixed(1)}%</div>
                  <div className={`trend ${item.tendance_positive ? "positive" : "negative"}`}>
                    {item.tendance_formate}
                  </div>
                </div>
              </div>
              <div className="legendProgress">
                <div
                  className="legendProgressFill"
                  style={{ width: `${Math.min(item.pourcentage, 100)}%`, background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getCarburantColor(type) {
  const colors = {
    'Diesel': '#3A5FCD',
    'Gazole': '#3A5FCD',
    'Essence': '#2BA4C6',
    'Sans Plomb': '#FF8C42',
    'Super': '#FF8C42',
    'GPL': '#8B5CF6',
    'Gaz': '#8B5CF6',
    'Éthanol': '#10B981',
    'E85': '#10B981',
    'Électrique': '#F59E0B',
  };
  return colors[type] || '#6B7280';
}

export default StatCarbRepartion;