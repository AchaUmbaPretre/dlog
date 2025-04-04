import React, { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

const RapportSpecialBar = ({ datas }) => {
  // Conversion des données
  const { formattedData, keys } = useMemo(() => {
    const allKeys = new Set();

    const formatted = datas.map((item) => {
      const { periode, key, id_client, ...rest } = item;

      const cleaned = {
        periode: new Date(periode).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long'
        }),
      };

      Object.entries(rest).forEach(([key, value]) => {
        allKeys.add(key);
        cleaned[key] = value;
      });

      return cleaned;
    });

    return {
      formattedData: formatted,
      keys: Array.from(allKeys),
    };
  }, [datas]);

  return (
    <div style={{ height: 500 }}>
      <ResponsiveBar
        data={formattedData}
        keys={keys}
        indexBy="periode"
        margin={{ top: 50, right: 200, bottom: 80, left: 60 }}
        padding={0.3}
        groupMode="grouped" // "stacked" si tu veux empilé
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          tickRotation: -45,
          legend: 'Période',
          legendPosition: 'middle',
          legendOffset: 60,
        }}
        axisLeft={{
          legend: 'Valeur',
          legendPosition: 'middle',
          legendOffset: -40,
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
            translateX: 140,
            itemWidth: 200,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
};

export default RapportSpecialBar;
