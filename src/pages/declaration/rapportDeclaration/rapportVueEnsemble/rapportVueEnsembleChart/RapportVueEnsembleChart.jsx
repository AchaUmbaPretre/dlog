import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const RapportVueEnsembleChart = ({ groupedData }) => {

  const formatDataForNivo = (formattedData) => {
    return formattedData.map(item => {
      const row = { Mois: item.Mois };
      
      // Ajout des données pour chaque capital (Entrep, Manut, Total)
      Object.keys(item).forEach(key => {
        if (key !== 'Mois') {
          row[key] = item[key];
        }
      });
      
      return row;
    });
  };

  // Vérification de groupedData pour éviter l'erreur
  const nivoData = Array.isArray(groupedData) && groupedData.length > 0 
                     ? formatDataForNivo(groupedData) 
                     : [];

  // Vérification des clés pour éviter l'erreur sur les objets vides
  const keys = nivoData.length > 0 ? Object.keys(nivoData[0]).filter(key => key !== 'Mois') : [];

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '300', marginBottom: '15px', borderBottom:'2px solid #e8e8e8', paddingBottom:'10px' }}>
        RAPPORT DES VILLES
        </h2>
        <div style={{ height: 400 }}>
      <ResponsiveBar
        data={nivoData}
        keys={keys} // Utilisation des keys vérifiées
        indexBy="Mois"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="stacked"
        colors={{ scheme: 'nivo' }}
        borderRadius={2}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Mois',
          legendPosition: 'middle',
          legendOffset: -36
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Total ($)',
          legendPosition: 'middle',
          legendOffset: -40
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
      />
    </div>
    </div>
  );
};

export default RapportVueEnsembleChart;
