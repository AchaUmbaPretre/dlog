import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';

const RapportVueEnsembleChartLine = ({ groupedData, showPercentage }) => {
  const formatDataForNivo = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const grouped = {};

    data.forEach(item => {
      const mois = moment(item.Mois, "MMM-YY").format('MMM-YYYY');

      if (!grouped[mois]) {
        grouped[mois] = { Mois: mois, Entreposage: 0, Manutention: 0, total: 0 };
      }

      Object.keys(item).forEach(key => {
        if (key.includes("Entreposage")) {
          grouped[mois].Entreposage += item[key] || 0;
        }
        if (key.includes("Manutention")) {
          grouped[mois].Manutention += item[key] || 0;
        }
      });

      grouped[mois].total = grouped[mois].Entreposage + grouped[mois].Manutention;
    });

    let nivoData = Object.values(grouped);
    nivoData.sort((a, b) => moment(a.Mois, "MMM-YYYY").toDate() - moment(b.Mois, "MMM-YYYY").toDate());

    return nivoData;
  };

  let nivoData = formatDataForNivo(groupedData);

  if (showPercentage) {
    nivoData = nivoData.map(item => ({
      Mois: item.Mois,
      Entreposage: item.total ? ((item.Entreposage / item.total) * 100).toFixed(2) : 0,
      Manutention: item.total ? ((item.Manutention / item.total) * 100).toFixed(2) : 0
    }));
  }

  const lineData = [
    {
      id: 'Entreposage',
      data: nivoData.map(item => ({ x: item.Mois, y: item.Entreposage }))
    },
    {
      id: 'Manutention',
      data: nivoData.map(item => ({ x: item.Mois, y: item.Manutention }))
    }
  ];

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '1.3rem', color: '#333', fontWeight: '600' }}>
                📈 RAPPORT CHART DES VILLES
        </h2>
      <div style={{ height: 400 }}>
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
          curve="monotoneX"
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -30,
            legend: 'Mois',
            legendPosition: 'middle',
            legendOffset: 36,
            format: value => moment(value, "MMM-YYYY").format("MMM-YY")
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            legend: showPercentage ? 'Pourcentage (%)' : 'Montant ($)',
            legendPosition: 'middle',
            legendOffset: -50
          }}
          colors={{ scheme: 'category10' }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={3}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          pointLabelYOffset={-12}
          enableGridX={false}
          enableGridY={true}
          useMesh={true}
          legends={[
            {
              anchor: 'top-right',
              direction: 'column',
              translateX: 40,
              itemWidth: 100,
              itemHeight: 20,
              itemTextColor: '#333',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [{ on: 'hover', style: { itemTextColor: '#000', fontWeight: 'bold' } }]
            }
          ]}
        />
      </div>
    </div>
  );
};

export default RapportVueEnsembleChartLine;
