import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import moment from 'moment';

const RapportFactureChart = ({ groupedData, uniqueMonths }) => {

  const prepareChartData = (groupedData, uniqueMonths) => {
    const formattedMonths = uniqueMonths.map((month) => {
      const [numMonth, year] = month.split("-");
      return moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
    });

    const chartData = groupedData.map((client) => {
      const clientData = {
        client: client.Client,
        Total: client.Total,
      };

      formattedMonths.forEach((month) => {
        clientData[month] = client[month] || 0;
      });

      return clientData;
    });

    return chartData;
  };

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (groupedData.length > 0 && uniqueMonths.length > 0) {
      setChartData(prepareChartData(groupedData, uniqueMonths));
    }
  }, [groupedData, uniqueMonths]);

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      {/* Titre du graphique */}
      <h2 style={{ fontSize: '1rem', fontWeight: '300', marginBottom: '15px', borderBottom:'2px solid #e8e8e8', paddingBottom:'10px' }}>
        Chart DIVERS M² FACTURE
      </h2>

      <div style={{ height: 400 }}>
        <ResponsiveBar
          data={chartData}
          keys={uniqueMonths.map((month) => {
            const [numMonth, year] = month.split("-");
            return moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
          })}
          indexBy="client"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          enableLabel={true}
          axisTop={{ tickSize: 5 }}
          axisRight={{ tickSize: 5 }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45, // Rotation des ticks pour une meilleure lisibilité
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            legend: 'Montant',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          tooltip={(data) => (
            <strong>{`${data.id}: ${data.value} $`}</strong>
          )}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: '#777777',
                  strokeWidth: 1,
                },
              },
              ticks: {
                line: {
                  stroke: '#777777',
                  strokeWidth: 1,
                },
                text: {
                  fill: '#777777',
                },
              },
            },
            grid: {
              line: {
                stroke: '#dddddd',
                strokeWidth: 1,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default RapportFactureChart;
