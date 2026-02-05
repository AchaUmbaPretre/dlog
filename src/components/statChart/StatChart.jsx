import React, { useEffect, useState, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { CheckOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Skeleton, Select, DatePicker, Button, Tooltip, Modal } from 'antd';
import { getTacheCountChart } from '../../services/tacheService';
import { CSSTransition } from 'react-transition-group';
import './statChart.css';
import FilterTache from '../../pages/FilterTache/FilterTache';
import { colorMapping } from '../../utils/prioriteIcons';
import { notifyWarning } from '../../utils/notifyWarning';

const { Option } = Select;
const CACHE_KEY = 'statChartCache';

const StatChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [showRows, setShowRows] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadFromCache = useCallback(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    return null;
  }, []);

  const saveToCache = useCallback((data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTacheCountChart(filter, dateRange);
      const formattedData = response.data.data.map(item => ({
        ...item,
        color: colorMapping[item.statut] || '#b0b0b0',
      }));

      const total = formattedData.reduce((acc, item) => acc + item.nombre_taches, 0);
      setTotalTasks(total);
      setData(formattedData);

      saveToCache({ data: formattedData, totalTasks: total });
    } catch (error) {
      console.error('Erreur fetch StatChart:', error);
      notifyWarning('Erreur de chargement', 'Chargement depuis le cache local…');

      const cached = loadFromCache();
      if (cached) {
        setData(cached.data);
        setTotalTasks(cached.totalTasks);
      } else {
        setData([]);
        setTotalTasks(0);
      }
    } finally {
      setLoading(false);
    }
  }, [filter, dateRange, loadFromCache, saveToCache]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (value) => {
    setFilter(value);
    if (value !== 'range') setDateRange([null, null]);
  };

  const handleDateRangeChange = (dates) => setDateRange(dates);

  const handleBarClick = (bar) => {
    setSelectedStatus(bar.indexValue);
    setIsModalVisible(true);
  };

  return (
    <div>
      <Tooltip title='Afficher Filtres'>
        <Button
          style={{ marginBottom: 10 }}
          onClick={() => setShowRows(!showRows)}
          icon={showRows ? <EyeInvisibleOutlined style={{color:'red'}} /> : <EyeOutlined style={{color:'blue'}} />}
        />
      </Tooltip>

      <CSSTransition in={showRows} timeout={300} classNames="filter-transition" unmountOnExit>
        <div className='rows' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className='row_select'>
            <Select value={filter} onChange={handleFilterChange} style={{ width: 120 }} placeholder="Sélectionnez un filtre">
              <Option value="" disabled>-- filtre --</Option>
              <Option value="today">Aujourd'hui</Option>
              <Option value="yesterday">Hier</Option>
              <Option value="7days">7 jours</Option>
              <Option value="30days">30 jours</Option>
              <Option value="range">Plage de date</Option>
            </Select>

            {filter === 'range' && (
              <DatePicker.RangePicker style={{ marginLeft: 10 }} onChange={handleDateRangeChange} value={dateRange} />
            )}

            <Button style={{ marginLeft: 10 }} onClick={fetchData} icon={<CheckOutlined />}>
              Appliquer
            </Button>
          </div>

          <div className='total_tache'>
            Total des tâches: {loading ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : totalTasks}
          </div>
        </div>
      </CSSTransition>

      <div style={{ height: 400 }}>
        {loading ? <Skeleton active /> : (
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
            axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Statut de la tâche', legendPosition: 'middle', legendOffset: 32 }}
            axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Count', legendPosition: 'middle', legendOffset: -40 }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        )}
      </div>

      <Modal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} width={1035} centered>
        <FilterTache selected={selectedStatus} filters={filter} dateRange={dateRange} />
      </Modal>
    </div>
  );
};

export default StatChart;
