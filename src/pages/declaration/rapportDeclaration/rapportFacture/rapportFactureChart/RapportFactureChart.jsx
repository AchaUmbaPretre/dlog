import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import moment from 'moment';

const RapportFactureChart = ({ groupedData, uniqueMonths }) => {
  console.log(groupedData, uniqueMonths);

  const prepareChartData = (groupedData, uniqueMonths) => {
    // Formater les mois dans un format lisible
    const formattedMonths = uniqueMonths.map((month) => {
      const [numMonth, year] = month.split("-");
      return moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
    });

    const chartData = groupedData.map((client) => {
      const clientData = {
        client: client.Client,
        Total: client.Total,
      };

      // Ajouter les données pour chaque mois
      formattedMonths.forEach((month) => {
        clientData[month] = client[month] || 0; // S'assurer que la donnée est définie, sinon 0
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
      />
    </div>
  );
};

export default RapportFactureChart;
