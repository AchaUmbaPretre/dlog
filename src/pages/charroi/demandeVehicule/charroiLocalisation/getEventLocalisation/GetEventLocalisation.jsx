import './getEventLocalisation.scss';
import { useEffect, useState, useMemo } from 'react';
import { DatePicker, Table, Tag, Space, message, Select } from 'antd';
import { CarOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../../../../config';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const GetEventLocalisation = () => {
  const [dateRange, setDateRange] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const apiHash = config.api_hash;

  // 🔹 Fonction de fetch avec dates dynamiques
  const fetchData = async (from, to) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://falconeyesolutions.com/api/get_events`,
        {
          params: {
            date_from: from,
            date_to: to,
            lang: 'fr',
            limit: 1000,
            user_api_hash: apiHash,
          },
        }
      );
      if (data?.items?.data) {
        setEvents(data.items.data);
        setFilteredEvents(data.items.data);
      } else {
        setEvents([]);
        setFilteredEvents([]);
        message.info("Aucun événement trouvé pour cette période.");
      }
    } catch (error) {
      console.error('Erreur lors du fetch:', error);
      message.error("Erreur lors du chargement des événements.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Chargement par défaut (aujourd'hui)
  useEffect(() => {
    const startOfDay = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfDay = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    setDateRange([dayjs().startOf('day'), dayjs().endOf('day')]);
    fetchData(startOfDay, endOfDay);
  }, []);

  // 🔹 Colonnes de la table
  const columns = [
    {
      title: 'Date & Heure',
      dataIndex: 'time',
      key: 'time',
      render: (text) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#1890ff' }} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Véhicule',
      dataIndex: 'device_name',
      key: 'device_name',
      render: (text) => (
        <Space>
          <CarOutlined style={{ color: '#722ed1' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Événement',
      dataIndex: 'message',
      key: 'message',
      render: (text, record) => {
        const color = record.type === 'ignition_on' ? 'green' : 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Position',
      key: 'position',
      render: (_, record) =>
        record.latitude && record.longitude ? (
          <a
            href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <EnvironmentOutlined style={{ color: '#fa8c16' }} /> Voir carte
          </a>
        ) : (
          <span>-</span>
        ),
    },
  ];

  // 🔹 Extraire la liste unique des véhicules
  const vehicles = useMemo(() => {
    const unique = [...new Set(events.map((e) => e.device_name))];
    return unique;
  }, [events]);

  // 🔹 Quand on change la plage de dates
  const handleDateChange = (values) => {
    setDateRange(values);
    if (values && values.length === 2) {
      const from = values[0].format('YYYY-MM-DD HH:mm:ss');
      const to = values[1].format('YYYY-MM-DD HH:mm:ss');
      fetchData(from, to);
      setSelectedVehicle(null); // reset filtre véhicule
    }
  };

  // 🔹 Filtrage par véhicule
  const handleVehicleChange = (value) => {
    setSelectedVehicle(value);
    if (value) {
      setFilteredEvents(events.filter((e) => e.device_name === value));
    } else {
      setFilteredEvents(events);
    }
  };

  return (
    <div className="event_container">
      <h2 className="title_event">📊 Détail des événements</h2>
      <div className="event_wrapper">
        <div className="event_top">
          <RangePicker
            style={{ width: '100%' }}
            value={dateRange}
            onChange={handleDateChange}
            allowClear
            showTime={{ format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            placeholder={['Date et heure début', 'Date et heure fin']}
          />
          <Select
            style={{ width: '100%', marginTop: 10 }}
            placeholder="Filtrer par véhicule"
            value={selectedVehicle}
            onChange={handleVehicleChange}
            allowClear
          >
            {vehicles.map((v) => (
              <Option key={v} value={v}>
                {v}
              </Option>
            ))}
          </Select>
        </div>
        <div className="event_bottom">
          <Table
            columns={columns}
            dataSource={filteredEvents}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            bordered
          />
        </div>
      </div>
    </div>
  );
};

export default GetEventLocalisation;
