import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { CheckOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Skeleton, Select, DatePicker, Button, Tooltip, Modal } from 'antd';
import { getTacheCountChart } from '../../services/tacheService';
import { CSSTransition } from 'react-transition-group';
import './statChart.css';
import FilterTache from '../../pages/FilterTache/FilterTache';

const { Option } = Select;

const StatChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [showRows, setShowRows] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFilterChange = (value) => {
    setFilter(value);
    if (value !== 'range') {
      setDateRange([null, null]);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };
  const handleBarClick = (bar) => {
    setSelectedStatus(bar.indexValue);
    setIsModalVisible(true);
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

      const total = formattedData.reduce((acc, item) => acc + item.nombre_taches, 0);
      setTotalTasks(total);
      setData(formattedData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, dateRange]);

  return (
    <div>
      <Tooltip title='Afficher Filtres'>
        <Button 
          style={{ marginBottom: '10px' }}
          onClick={() => setShowRows(!showRows)}
          icon={showRows ? <EyeInvisibleOutlined style={{color:'red'}} /> : <EyeOutlined style={{color:'blue'}} />}
        >
        </Button>
      </Tooltip>

      <CSSTransition
        in={showRows}
        timeout={300}
        classNames="filter-transition"
        unmountOnExit
      >
        <div className='rows' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className='row_select'>
            <Select
              value={filter}
              onChange={handleFilterChange}
              style={{ width: 120, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              placeholder="Sélectionnez un filtre"
            >
              <Option style={{ color: '#555', fontSize: '12px', fontWeight: '300' }} value="" disabled> -- filtre -- </Option>
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
              style={{ marginLeft: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#555', fontSize: '12px', fontWeight: '300' }} 
              onClick={fetchData}
              icon={<CheckOutlined />}
            >
              Appliquer
            </Button>
          </div>

          <div className='total_tache'>
            Total des tâches : {loading ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : totalTasks}
          </div>
        </div>
      </CSSTransition>

      <div style={{ height: 400 }}>
        {loading ? (
          <Skeleton active />
        ) : (
          <ResponsiveBar
            data={data}
            keys={['nombre_taches']}
            indexBy="statut"
            onClick={handleBarClick}
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
      <Modal
        title={''}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1035}
        centered
      >
        <FilterTache selected ={selectedStatus} filters ={filter} dateRange={dateRange} />
      </Modal>
    </div>
  );
};

export default StatChart;