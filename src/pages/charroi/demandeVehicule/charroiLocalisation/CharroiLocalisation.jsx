import React, { useEffect, useState } from 'react';
import { CarOutlined, EyeOutlined } from '@ant-design/icons';
import { getFalcon } from '../../../../services/rapportService';
import { notification, Typography, Space, Tag, Input, Tooltip, Table, Button } from 'antd';
import moment from 'moment';

const { Text } = Typography;
const { Search } = Input;

const CharroiLocalisation = () => {
  const [falcon, setFalcon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [searchValue, setSearchValue] = useState('');

  const fetchData = async () => {
    try {
      const [falconData] = await Promise.all([getFalcon()]);
      setFalcon(falconData.data[0].items);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger les données véhicules.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDetail = (id) => {
    console.log("Voir détails du véhicule :", id);
  };

  const getOdometer = (sensors = []) => {
    const odo = sensors.find((s) => s.type === "odometer");
    return odo ? odo.value : "-";
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%",
    },
    {
      title: 'Matricule',
      dataIndex: 'name',
      render: (text) => (
        <div className="vehicule-matricule">
          <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
          <Text strong>{text}</Text>
        </div>
      ),
    },
    { 
      title: 'Date & Heure', 
      dataIndex: 'time',
      render: (text) => (
        <Text>{moment(text, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}</Text>
      ),
      sorter: (a, b) => moment(a.time, "DD-MM-YYYY HH:mm:ss").unix() - moment(b.time, "DD-MM-YYYY HH:mm:ss").unix(),
    },
    { 
      title: 'Adresse', 
      dataIndex: 'address',
      render: (text, record) => (
        text && text !== "-" 
          ? <Text>{text}</Text> 
          : <Tag color="blue">{record.lat}, {record.lng}</Tag>
      ),
    },
    {
      title: 'Vitesse',
      dataIndex: 'speed',
      render: (text) => (
        <Tag color={text > 0 ? "green" : "volcano"}>
          {text} km/h
        </Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'online',
      render: (text) => (
        <Tag color={text === "online" ? "green" : "red"}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Km Total',
      dataIndex: 'sensors',
      render: (sensors) => (
        <Text>{getOdometer(sensors)}</Text>
      ),
    },
    {
      title: 'Durée arrêt',
      dataIndex: 'stop_duration',
      render: (text) => (
        text && text !== "-" ? <Text>{text}</Text> : <Tag color="default">N/A</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Tooltip title="Voir les détails">
            <Button
              icon={<EyeOutlined />}
              type="link"
              onClick={() => handleDetail(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="client">
      <div className="client-wrapper">
        <div className="client-row">
          <CarOutlined className='client-icon' />
          <h2 className="client-h2">Véhicules en Suivi</h2>
        </div>
        <div className="client-actions">
          <Search 
            placeholder="Rechercher un véhicule..."
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 300 }}
            enterButton 
          />
        </div>
        <Table
          columns={columns}
          dataSource={falcon.filter(item => item.name?.toLowerCase().includes(searchValue.toLowerCase()))}
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
          rowKey="id"
          bordered
          size="middle"
          rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
        />
      </div>
    </div>
  );
};

export default CharroiLocalisation;
