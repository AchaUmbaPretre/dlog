import React from 'react'
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import 'moment/locale/fr';

const RapportVueEnsembleChartLine = ({ groupedData, showPercentage }) => {
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
      
        let nivoData = Object.values(grouped);
      
        // Trier du plus ancien au plus récent
        nivoData.sort((a, b) => moment(a.Mois, "MMM-YYYY").toDate() - moment(b.Mois, "MMM-YYYY").toDate());
      
        return nivoData;
      };
      
    
      let nivoData = formatDataForNivo(groupedData);
    
      if (showPercentage) {
        nivoData = nivoData?.map(item => ({
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
    <>
        <div style={{ width: '100%', height: '500px', padding: '20px'}}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.3rem', color: '#333', fontWeight: '600' }}>
                        📈 Rapport des Bâtiments
                    </h2>
        
                    <div style={{ height: '400px' }}>
                        <ResponsiveLine
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
    </>
  )
}

export default RapportVueEnsembleChartLine