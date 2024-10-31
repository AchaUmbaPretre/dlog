import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { CheckOutlined } from '@ant-design/icons';
import { Skeleton, Select, DatePicker, Button } from 'antd';
import { getTacheCountChart } from '../../services/tacheService';

const { Option } = Select;

const StatChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0); // État pour le total des tâches
  const [filter, setFilter] = useState(''); // Pas de filtre par défaut
  const [dateRange, setDateRange] = useState([null, null]); // Pour la plage de date

  const handleFilterChange = (value) => {
    setFilter(value);
    // Réinitialiser la plage de date si un filtre prédéfini est sélectionné
    if (value !== 'range') {
      setDateRange([null, null]);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getTacheCountChart(filter, dateRange);

      const colorMapping = {
        'En attente': '#f4a261',
        'En cours': '#6a8caf',
        'Point bloquant': '#e63946',
        'En attente de validation': '#f9c74f',
        'Validé': '#2a9d8f',
        'Budget': '#e76f51',
        'Executé': '#264653',
      };

      const formattedData = data.data.map(item => ({
        ...item,
        color: colorMapping[item.statut] || '#b0b0b0',
      }));

      // Calculer le total des tâches
      const total = formattedData.reduce((acc, item) => acc + item.nombre_taches, 0);
      setTotalTasks(total); // Mettre à jour le total

      setData(formattedData);
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, dateRange]); // Récupérer les données lorsque le filtre ou la plage de date change

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center'}}>
          <Select
            value={filter}
            onChange={handleFilterChange}
            style={{ width: 120, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            placeholder="Sélectionnez un filtre" // Placeholder ajouté ici
          >
            <Option value="today">Aujourd'hui</Option>
            <Option value="yesterday">Hier</Option>
            <Option value="7days">7 jours</Option>
            <Option value="30days">30 jours</Option>
            <Option value="range">Plage de date</Option>
          </Select>

          {filter === 'range' && (
            <DatePicker.RangePicker
              style={{ marginLeft: '10px' }}
              onChange={handleDateRangeChange}
              value={dateRange}
            />
          )}

          <Button 
            style={{ marginLeft: '10px',boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color:'#555', fontSize:'12px',fontWeight:'300' }} 
            onClick={fetchData}
            icon={<CheckOutlined />}
          >
            Appliquer
          </Button>

        </div>

        {/* Affichage du total des tâches */}
        <div style={{ fontWeight: '300', fontSize:'14px', color:'#555',  boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding:'10px' }}>
          Total des tâches : {loading ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : totalTasks}
        </div>
      </div>

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
            colors={({ data }) => data.color}
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
    </div>
  );
};

export default StatChart;
