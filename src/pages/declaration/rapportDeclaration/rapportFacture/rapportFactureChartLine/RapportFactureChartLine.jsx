import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';

const RapportFactureChartLine = ({ groupedData, uniqueMonths }) => {
  const prepareChartData = (groupedData, uniqueMonths) => {
    const formattedMonths = uniqueMonths.map((month) => {
      const [numMonth, year] = month.split("-");
      return moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
    });

    return groupedData.map((client) => ({
      id: client.Client,
      data: formattedMonths.map((month) => ({
        x: month,
        y: client[month] || 0,
      })),
    }));
  };

  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    if (groupedData.length > 0 && uniqueMonths.length > 0) {
      setLineData(prepareChartData(groupedData, uniqueMonths));
    }
  }, [groupedData, uniqueMonths]);

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '1.3rem', color: '#333', fontWeight: '600' }}>
        📈 Rapport des factures
      </h2>


      <div style={{ height: '400px' }}>
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
          curve="monotoneX"
          axisBottom={{
            legend: 'Mois',
            legendOffset: 36,
            legendPosition: 'middle',
            tickRotation: -30,
            tickSize: 5,
            tickPadding: 5,
            format: (value) => moment(value, "MMM-YYYY").format("MMM-YY"),
          }}
          axisLeft={{
            legend: 'Valeur',
            legendOffset: -50,
            legendPosition: 'middle',
            tickSize: 5,
            tickPadding: 5,
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
              effects: [{ on: 'hover', style: { itemTextColor: '#000', fontWeight: 'bold' } }],
            },
          ]}
          tooltip={({ point }) => (
            <div
              style={{
                background: '#fff',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0px 2px 10px rgba(0,0,0,0.15)',
              }}
            >
              <strong>{point.serieId}</strong> <br />
              Mois : {point.data.x} <br />
              Valeur : <span style={{ color: point.serieColor, fontWeight: 'bold' }}>{point.data.y}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default RapportFactureChartLine;
