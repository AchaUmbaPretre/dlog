import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import moment from 'moment';
moment.locale('fr');

const RapportClotureBar = ({ data }) => {

  const sortedData = [...data].sort((a, b) => new Date(a.periode) - new Date(b.periode));

  const transformedData = sortedData.map(item => ({
    periode: moment(item.periode).format('MMM-YY'),
    entreposage: item.entreposage || 0,
    manutation: item.manutation || 0,
    total: item.total || 0,
  }));
  
  const formatValue = (value) => {
      return `${(value / 1000).toFixed(1).replace('.0', '')}k`;
  };

  return (
    <div style={{ height: 400, background:'#fff' }}>
        <ResponsiveBar
        data={transformedData}
        keys={['entreposage', 'manutation', 'total']}
        indexBy="periode"
        margin={{ top: 50, right: 130, bottom: 60, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        colors={{ scheme: 'set2' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Période',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Montant',
          legendPosition: 'middle',
          legendOffset: -50,
          format: formatValue

        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 4,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default RapportClotureBar;
