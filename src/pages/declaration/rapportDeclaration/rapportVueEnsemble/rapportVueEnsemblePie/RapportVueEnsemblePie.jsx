import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import moment from 'moment';

const RapportVueEnsemblePie = ({ groupedData, showPercentage }) => {
  // Formatage des données pour le graphique Pie
  const formatDataForPie = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const grouped = {};

    data.forEach(item => {
      const mois = moment(item.Mois, "MMM-YY").format('MMM-YYYY'); // 🔹 Format 'MMM-YYYY' pour obtenir 'dec-2024'

      if (!grouped[mois]) {
        grouped[mois] = { Mois: mois, Entreposage: 0, Manutention: 0 };
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
    });

    return Object.values(grouped);
  };

  // Vérification de groupedData pour éviter les erreurs
  let pieData = Array.isArray(groupedData) && groupedData.length > 0 
                    ? formatDataForPie(groupedData) 
                    : [];

  // Si l'option de pourcentage est activée
  if (showPercentage) {
    pieData = pieData.map(item => ({
      Mois: item.Mois,
      Entreposage: item.Entreposage ? ((item.Entreposage / (item.Entreposage + item.Manutention)) * 100).toFixed(2) : 0,
      Manutention: item.Manutention ? ((item.Manutention / (item.Entreposage + item.Manutention)) * 100).toFixed(2) : 0
    }));
  }

  // Formatage des valeurs pour afficher en pourcentage ou en k
  const formatValueForLabel = (value) => {
    if (showPercentage) {
      return `${value}%`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`; // Affiche en 'k' si la valeur est > 1000
    }
    return value.toLocaleString(); // Formate les petites valeurs (ex : 900, 250)
  };

  const pieChartData = pieData.flatMap(item => [
    { id: `Entreposage ${item.Mois}`, label: formatValueForLabel(item.Entreposage), value: item.Entreposage },
    { id: `Manutention ${item.Mois}`, label: formatValueForLabel(item.Manutention), value: item.Manutention }
  ]);

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <h2 style={{
        fontSize: '1rem',
        fontWeight: '300',
        marginBottom: '15px',
        borderBottom: '2px solid #e8e8e8',
        paddingBottom: '10px'
      }}>
        RAPPORT DES VILLES (PIE CHART)
      </h2>
      <div style={{ height: 400 }}>
        <ResponsivePie
          data={pieChartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5} // Crée un donut chart
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
};

export default RapportVueEnsemblePie;