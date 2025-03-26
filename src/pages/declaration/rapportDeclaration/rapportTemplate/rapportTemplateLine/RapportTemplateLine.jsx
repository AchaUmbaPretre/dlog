import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import 'moment/locale/fr';

const RapportTemplateLine = ({ groupedData, uniqueMonths, selectedField }) => {

  const chartData = groupedData.map(batiment => ({
      id: batiment.desc_template,
      data: uniqueMonths.map(month => {
          const formattedMonth = moment(month, "M-YYYY").locale('fr').format("MMM-YYYY");  // Correction ici
          const key = `${formattedMonth}_${selectedField}`;
  
          return {
              x: formattedMonth,
              y: batiment[key] || 0
          };
      })
  }));

  return (
    <div style={{ height: 400 }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '1.3rem', color: '#333', fontWeight: '600' }}>
        📈 Rapport des templates
      </h2>
      <div style={{ height: '400px' }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          axisLeft={{
            legend: 'Valeur',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Mois',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          colors={{ scheme: 'category10' }}
          lineWidth={3}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableSlices="x"
          useMesh={true}
        />
      </div>
    </div>
  );
};

export default RapportTemplateLine;
