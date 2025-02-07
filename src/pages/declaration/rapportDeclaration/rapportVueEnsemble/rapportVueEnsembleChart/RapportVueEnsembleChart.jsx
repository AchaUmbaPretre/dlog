import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import moment from 'moment';

const RapportVueEnsembleChart = ({ groupedData, showPercentage }) => {
  // 🔹 Transformer et regrouper les données pour le graphique
  const formatDataForNivo = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const grouped = {};

    data.forEach(item => {
      const mois = moment(item.Mois, "MMM-YY").format('MMM-YYYY'); // 🔹 Format 'MMM-YYYY' pour obtenir 'dec-2024'

      if (!grouped[mois]) {
        grouped[mois] = { Mois: mois, Entreposage: 0, Manutention: 0, total: 0 };
      }

      // 🔹 Additionner les valeurs pour Entreposage et Manutention pour toutes les villes
      Object.keys(item).forEach(key => {
        if (key.includes("Entreposage")) {
          grouped[mois].Entreposage += item[key] || 0;
        }
        if (key.includes("Manutention")) {
          grouped[mois].Manutention += item[key] || 0;
        }
      });

      // 🔹 Calculer le total pour chaque mois
      grouped[mois].total = grouped[mois].Entreposage + grouped[mois].Manutention;
    });

    return Object.values(grouped);
  };

  let nivoData = formatDataForNivo(groupedData);

  // 🔹 Convertir en pourcentage si `showPercentage` est activé
  if (showPercentage) {
    nivoData = nivoData.map(item => ({
      Mois: item.Mois,
      Entreposage: item.total ? ((item.Entreposage / item.total) * 100).toFixed(2) : 0,
      Manutention: item.total ? ((item.Manutention / item.total) * 100).toFixed(2) : 0
    }));
  }

  const formatValue = (value) => {
    if (showPercentage) {
      return `${value}%`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1).replace('.0', '')}k`;
    }
    return value;
  };

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: '300', marginBottom: '15px', borderBottom: '2px solid #e8e8e8', paddingBottom: '10px' }}>
        RAPPORT CHART DES VILLES
      </h2>
      <div style={{ height: 400 }}>
        <ResponsiveBar
          data={nivoData}
          keys={['Entreposage', 'Manutention']} // 🔹 Juste Entreposage et Manutention
          indexBy="Mois"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          groupMode="stacked"
          colors={{ scheme: 'nivo' }}
          borderRadius={2}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Mois',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: showPercentage ? 'Pourcentage (%)' : 'Montant ($)',
            legendPosition: 'middle',
            legendOffset: -40,
            format: formatValue // 🔹 Applique le format personnalisé
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              symbolSize: 20
            }
          ]}
          tooltip={({ id, value, color }) => (
            <div style={{ color, padding: '5px', background: '#fff', borderRadius: '3px', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)' }}>
              <strong>{id}: {formatValue(value)}</strong>
            </div>
          )}
          label={(d) => formatValue(d.value)}
        />
      </div>
    </div>
  );
};

export default RapportVueEnsembleChart;
