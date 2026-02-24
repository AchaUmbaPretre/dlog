import React from 'react';
import './dashEntreeSortie.scss';
import { BarChartOutlined } from '@ant-design/icons';
import { ResponsiveBar } from '@nivo/bar';

const DashEntreeSortie = () => {
  const data = [
    { time: '06:00', Entrées: 2, Sorties: 1 },
    { time: '07:00', Entrées: 6, Sorties: 4 },
    { time: '08:00', Entrées: 14, Sorties: 8 },
    { time: '10:00', Entrées: 16, Sorties: 12 },
    { time: '11:00', Entrées: 12, Sorties: 14 },
    { time: '12:00', Entrées: 8, Sorties: 10 }
  ];

  return (
    <div className="dashboard-section">
      <div className="section-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <BarChartOutlined />
        Entrées / Sorties dernières heures
      </div>
      
      <div className="chart-wrapper" style={{ height: '250px' }}>
        <ResponsiveBar
          data={data}
          keys={['Entrées', 'Sorties']}
          indexBy="time"
          margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
          padding={0.3}
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          colors={['#4CAF50', '#F44336']}
          borderRadius={6}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -40,
            tickValues: [0, 2, 4, 6, 8, 10, 12, 14, 16]
          }}
          enableGridY={true}
          gridYValues={[0, 2, 4, 6, 8, 10, 12, 14, 16]}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>

      {/* Légende personnalisée */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color entries-color"></span>
          <span>Entrées</span>
        </div>
        <div className="legend-item">
          <span className="legend-color exits-color"></span>
          <span>Sorties</span>
        </div>
      </div>
    </div>
  );
};

export default DashEntreeSortie;