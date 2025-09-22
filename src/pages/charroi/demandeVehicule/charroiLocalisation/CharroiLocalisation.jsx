import { useEffect, useState } from 'react';
import { CarOutlined, EyeOutlined, WarningOutlined } from '@ant-design/icons';
import { getFalcon } from '../../../../services/rapportService';
import { notification, Typography, Modal, Space, Tag, Input, Tooltip, Table, Button, Badge } from 'antd';
import moment from 'moment';
import { getAlerts, getEngineStatus, getOdometer, reverseGeocode, zoneAutorisee } from '../../../../services/geocodeService';
import CharroiLocalisationDetail from './charroiLocalisationDetail/CharroiLocalisationDetail';

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
  const [modalType, setModalType] = useState(null);
  const [id, setId] = useState(null)


  const closeAllModals = () => {
    setModalType(null);
  };

  const fetchData = async () => {
    try {
      const [falconData] = await Promise.all([getFalcon()]);
      let items = falconData.data[0].items;

      // Pré-calcul des adresses lisibles
      const itemsWithAddress = await Promise.all(
        items.map(async (item) => {
          if (!item.address || item.address === "-") {
            const addr = await reverseGeocode(item.lat, item.lng);
            return { ...item, address: addr };
          }
          return item;
        })
      );

      setFalcon(itemsWithAddress);
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

 const openModal = (type, id = '') => {
    closeAllModals();
    setModalType(type);
    setId(id);
  };

  const handleDetail = (id) => {
    openModal('detail', id)
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
      render: (text) => (
        <Text>{text}</Text>
      ),
    },
    {
      title: 'Vitesse',
      dataIndex: 'speed',
      render: (speed) => {
        let color = "red";
        if (speed > 5) color = "green";
        else if (speed > 0) color = "orange";
        return <Tag color={color}>{speed} km/h</Tag>;
      },
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
      title: 'Moteur',
      dataIndex: 'sensors',
      render: (sensors) => (
        <Tag color={getEngineStatus(sensors) === "ON" ? "green" : "red"}>
          {getEngineStatus(sensors)}
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
      title: 'Alertes',
      key: 'alerts',
      render: (text, record) => (
        <Space wrap>{getAlerts(record)}</Space>
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

  // --- Stats globales ---
  const totalVehicules = falcon.length;
  const enLigne = falcon.filter(f => f.online === "online").length;
  const horsLigne = falcon.filter(f => f.online === "offline").length;

  return (
    <div className="client">
      <div className="client-wrapper">
        <div className="client-row">
          <CarOutlined className='client-icon' />
          <h2 className="client-h2">Véhicules en Suivi</h2>
        </div>

        {/* Résumé */}
        <Space style={{ marginBottom: 16 }}>
          <Badge count={totalVehicules} showZero color="blue" />
          <Tag color="green">En ligne: {enLigne}</Tag>
          <Tag color="red">Hors ligne: {horsLigne}</Tag>
        </Space>

        {/* Recherche */}
        <div className="client-actions">
          <Search 
            placeholder="Rechercher un véhicule..."
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 300 }}
            enterButton 
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={falcon.filter(item => item.name?.toLowerCase().includes(searchValue.toLowerCase()))}
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
          rowKey="id"
          bordered
          size="middle"
          scroll={{ x: 1400 }}
          rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
        />
      </div>

      <Modal
        title=""
        visible={modalType === 'detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1025}
        centered
      >
        <CharroiLocalisationDetail id={id} />
      </Modal>
    </div>
  );
};

export default CharroiLocalisation;
