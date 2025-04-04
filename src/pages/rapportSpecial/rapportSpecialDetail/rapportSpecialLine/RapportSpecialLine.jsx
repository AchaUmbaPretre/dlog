import React, { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

// Exemple de données groupées par période
const sampleData = [
  {
    periode: "Janvier 2024",
    data: [
      { client: "Alice", valeur: 120 },
      { client: "Bob", valeur: 80 }
    ]
  },
  {
    periode: "Février 2024",
    data: [
      { client: "Alice", valeur: 150 },
      { client: "Bob", valeur: 90 }
    ]
  },
  {
    periode: "Mars 2024",
    data: [
      { client: "Alice", valeur: 160 },
      { client: "Bob", valeur: 100 }
    ]
  }
];

const RapportSpecialBar = ({ data = sampleData }) => {
  // Construire les clés dynamiques et les données pivotées
  const { formattedData, keys } = useMemo(() => {
    const allClients = new Set();
    const formatted = data.map(({ periode, data: clientsData }) => {
      const entry = { periode };
      clientsData.forEach(({ client, valeur }) => {
        allClients.add(client);
        entry[client] = valeur;
      });
      return entry;
    });

    return {
      formattedData: formatted,
      keys: Array.from(allClients)
    };
  }, [data]);

  return (
    <div style={{ height: 500 }}>
      <ResponsiveBar
        data={formattedData}
        keys={keys}
        indexBy="periode"
        margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
        padding={0.3}
        groupMode="grouped" // ou "stacked" si tu veux empiler
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          tickRotation: -45,
          legend: 'Période',
          legendPosition: 'middle',
          legendOffset: 60
        }}
        axisLeft={{
          legend: 'Valeur',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle'
          }
        ]}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
};

export default RapportSpecialBar;
