import React, { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import moment from 'moment';

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

  const formatValue = (value) => {
    return `${(value / 1000).toFixed(1).replace('.0', '')}k`;
};

  return (
    <div style={{ height: 500 }}>
      <ResponsiveBar
        data={formattedData}
        keys={keys}
        indexBy="periode"
        margin={{ top: 50, right: 200, bottom: 80, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          tickRotation: -45,
          legend: 'Période',
          legendPosition: 'middle',
          legendOffset: 60,
          format: value => moment(value, "MMM-YYYY").format("MMM-YY")
          
        }}
        axisLeft={{
          legend: 'Valeur',
          legendPosition: 'middle',
          legendOffset: -40,
          format: formatValue

        }}
        labelSkipWidth={0}
        labelSkipHeight={0}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        label={({ value }) => formatValue(value)} 
        tooltip={({ id, value, color, indexValue }) => (
          <div style={{
            padding: 10,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            color: '#333'
          }}>
            <strong>{id}</strong><br />
            Période : {indexValue}<br />
            Valeur : <strong>{formatValue(value)}</strong>
          </div>
        )}
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
