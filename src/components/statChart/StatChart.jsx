import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { notification } from 'antd';
import { getTacheCountChart } from '../../services/tacheService';

const StatChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(()=>{

    const fetchData = async() => {
      try {
        const { data } = await getTacheCountChart();
        setData(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    }
    fetchData();
  }, [])
  const datas = [
    {
      task: 'Complété',
      count: 45,
      color: '#6a8caf', 
    },
    {
      task: 'En cours',
      count: 30,
      color: '#b0b0b0', 
    },
    {
      task: 'En attente',
      count: 15,
      color: '#f4a261',  
    },
    {
      task: 'En retard',
      count: 10,
      color: '#90e0ef',  
    },
  ];

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={data}
        keys={['nombre_taches']}
        indexBy="statut"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={({ data }) => data.color}  // Application des couleurs spécifiées pour chaque barre
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Statut de la tâche',
          legendPosition: 'middle',
          legendOffset: 32,
          tickColor: '#d0d0d0',  // Couleur des ticks de l'axe X
          legendTextColor: '#6a8caf',  // Couleur du texte de la légende de l'axe X
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Count',
          legendPosition: 'middle',
          legendOffset: -40,
          tickColor: '#d0d0d0',  // Couleur des ticks de l'axe Y
          legendTextColor: '#6a8caf',  // Couleur du texte de la légende de l'axe Y
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
            itemsSpacing: 2,
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
            itemTextColor: '#b0b0b0',  // Couleur du texte dans la légende
          },
        ]}
      />
    </div>
  );
};

export default StatChart;
