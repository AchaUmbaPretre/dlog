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
      const clientData = { client: client.Client };
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
      <h2
        style={{
          fontSize: '1rem',
          fontWeight: '300',
          marginBottom: '15px',
          borderBottom: '2px solid #e8e8e8',
          paddingBottom: '10px',
        }}
      >
        RAPPORT M² FACTURE
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
          colors={['#E63946', '#F4A261', '#2A9D8F', '#264653', '#E9C46A', '#A8DADC', '#457B9D', '#1D3557']} // Palette plus contrastée
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Mois',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Montant',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          tooltip={({ id, value }) => (
            <strong>
              {id}: {value}
            </strong>
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
          groupMode="grouped" // Peut être changé à "stacked" pour des barres empilées
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 0.85,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RapportFactureChart;
