import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const RapportVueEnsemblePie = ({ groupedData }) => {

  // Formatage des données pour le graphique Pie
  const formatDataForPie = (formattedData) => {
    const aggregatedData = {};
    
    formattedData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'Mois') {
          aggregatedData[key] = (aggregatedData[key] || 0) + item[key];
        }
      });
    });

    return Object.keys(aggregatedData).map(key => ({
      id: key,
      label: key,
      value: aggregatedData[key]
    }));
  };

  // Vérification de groupedData pour éviter les erreurs
  const pieData = Array.isArray(groupedData) && groupedData.length > 0 
                    ? formatDataForPie(groupedData) 
                    : [];

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
          data={pieData}
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
