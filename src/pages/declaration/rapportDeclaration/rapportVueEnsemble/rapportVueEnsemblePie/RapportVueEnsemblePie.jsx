import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const RapportVueEnsemblePie = ({ groupedData }) => {

  const formatDataForNivo = (formattedData) => {
    return formattedData.map(item => {
      const totalValue = Object.keys(item).reduce((sum, key) => {
        if (key !== 'Mois') {
          sum += item[key];
        }
        return sum;
      }, 0);

      return {
        id: item.Mois,
        label: item.Mois,
        value: totalValue,
      };
    });
  };

  // Vérification de groupedData pour éviter l'erreur
  const nivoData = Array.isArray(groupedData) && groupedData.length > 0 
                     ? formatDataForNivo(groupedData) 
                     : [];

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '300', marginBottom: '15px', borderBottom:'2px solid #e8e8e8', paddingBottom:'10px' }}>
        RAPPORT DES VILLES
        </h2>
        <div style={{ height: 400 }}>
      <ResponsivePie
        data={nivoData}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextColor="#333333"
        radialLabelsLinkColor={{ from: 'color' }}
        sliceLabelsSkipAngle={10}
        sliceLabelsTextColor="#333333"
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
            itemOpacity: 1,
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
