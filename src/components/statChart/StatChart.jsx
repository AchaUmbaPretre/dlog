import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { notification, Skeleton } from 'antd';
import { getTacheCountChart } from '../../services/tacheService';

const StatChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getTacheCountChart();

        // Ajoutez des couleurs spécifiques pour chaque statut
        const colorMapping = {
          'En attente': '#f4a261',            // Orange clair
          'En cours': '#6a8caf',              // Bleu
          'Point bloquant': '#e63946',        // Rouge
          'En attente de validation': '#f9c74f', // Jaune
          'Validé': '#2a9d8f',               // Vert
          'Budget': '#e76f51',               // Orange foncé
          'Executé': '#264653',              // Vert foncé
        };

        // Associez les couleurs à vos données
        const formattedData = data.map(item => ({
          ...item,
          color: colorMapping[item.statut] || '#b0b0b0'  // Valeur par défaut si le statut n'a pas de couleur définie
        }));

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ height: 400 }}>
      {loading ? (
        <Skeleton active />
      ) : (
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
            tickColor: '#d0d0d0',
            legendTextColor: '#6a8caf',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Count',
            legendPosition: 'middle',
            legendOffset: -40,
            tickColor: '#d0d0d0',
            legendTextColor: '#6a8caf',
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
              itemTextColor: '#b0b0b0',
            },
          ]}
        />
      )}
    </div>
  );
};

export default StatChart;
