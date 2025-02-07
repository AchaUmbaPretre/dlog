import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import moment from 'moment';

const RapportVueEnsembleChart = ({ groupedData }) => {
  // Transformer et regrouper les données pour le graphique
  const formatDataForNivo = (data) => {
    const grouped = {};

    data.forEach(item => {
      const mois = moment(item.periode).format('YYYY-MM'); // Transformer la date en "AAAA-MM"

      if (!grouped[mois]) {
        grouped[mois] = { Mois: mois, Entrepôt: 0, Manutention: 0 };
      }

      grouped[mois].Entrepôt += item.total_entreposage;
      grouped[mois].Manutention += item.total_manutation;
    });

    return Object.values(grouped);
  };

  // Vérifier si les données existent
  const nivoData = Array.isArray(groupedData) && groupedData.length > 0 
    ? formatDataForNivo(groupedData) 
    : [];

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: '300', marginBottom: '15px', borderBottom: '2px solid #e8e8e8', paddingBottom: '10px' }}>
        RAPPORT DES VILLES
      </h2>
      <div style={{ height: 400 }}>
        <ResponsiveBar
          data={nivoData}
          keys={['Entrepôt', 'Manutention']} // Seulement entreposage et manutention
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
            legendOffset: 36
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Montant ($)',
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
