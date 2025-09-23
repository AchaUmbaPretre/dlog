import { useEffect, useState } from 'react';
import { CarOutlined, EyeOutlined } from '@ant-design/icons';
import { getFalcon } from '../../../../services/rapportService';
import { notification, Typography, Tooltip, Modal, Space, Tag, Input, Table, Button, Badge } from 'antd';
import moment from 'moment';
import { getAlerts, getEngineStatus, getOdometer, reverseGeocode } from '../../../../services/geocodeService';
import CharroiLocalisationDetail from './charroiLocalisationDetail/CharroiLocalisationDetail';
import { formatStopDuration } from '../../../../utils/renderTooltip';

const { Text } = Typography;
const { Search } = Input;

const CharroiLocalisation = () => {
  const [falcon, setFalcon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [id, setId] = useState(null);

  const closeAllModals = () => setModalType(null);

  const fetchData = async () => {
    try {
      const [falconData] = await Promise.all([getFalcon()]);
      let items = falconData.data[0].items;

      // Récupération du cache depuis localStorage
      const addressCache = JSON.parse(localStorage.getItem('vehicleAddressCache') || '{}');

      const itemsWithAddress = await Promise.all(
        items.map(async (item) => {
          const key = `${item.lat}_${item.lng}`;

          // Si adresse déjà présente et valide
          if (item.address && item.address !== "-") return item;

          // Si adresse en cache
          if (addressCache[key]) return { ...item, address: addressCache[key] };

          let finalAddress = "Adresse non disponible";

          try {
            const addr = await reverseGeocode(item.lat, item.lng);

            if (addr) {
              // Fallback progressif : quartier → ville → province → pays
              const parts = [];
              if (addr.neighbourhood) parts.push(addr.neighbourhood);
              if (addr.suburb) parts.push(addr.suburb);
              if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
              if (addr.state) parts.push(addr.state);
              if (addr.country) parts.push(addr.country);

              finalAddress = parts.length > 0 ? parts.join(', ') : "Adresse non disponible";
            }
          } catch (err) {
            console.error("Erreur reverse geocoding:", err);
          }

          // Mise à jour du cache
          addressCache[key] = finalAddress;
          localStorage.setItem('vehicleAddressCache', JSON.stringify(addressCache));

          return { ...item, address: finalAddress };
        })
      );

      setFalcon(itemsWithAddress);
      setLoading(false);
    } catch (error) {
      console.error("Erreur fetchData:", error);
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger les données véhicules.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chargement initial
    fetchData();

    // Rafraîchissement toutes les 10 secondes
    const interval = setInterval(() => {
      fetchData();
    }, 10000); // 10 secondes

    // Nettoyage à la destruction du composant
    return () => clearInterval(interval);
  }, []);

  const openModal = (type, id = '') => {
    closeAllModals();
    setModalType(type);
    setId(id);
  };

  const handleDetail = (id) => openModal('detail', id);

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      }, width: "4%",
    },
    { title: 'Matricule', dataIndex: 'name', render: (text) => (
        <div className="vehicule-matricule">
          <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
          <Text strong>{text}</Text>
        </div>
      ),
    },
    { title: 'Date & Heure', dataIndex: 'time', render: (text) =>
        <Text>{moment(text, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}</Text>,
      sorter: (a, b) =>
        moment(a.time, "DD-MM-YYYY HH:mm:ss").unix() - moment(b.time, "DD-MM-YYYY HH:mm:ss").unix(),
    },
    { title: 'Adresse', dataIndex: 'address', render: (text, record) => (
        <Tooltip title={`${record.lat}, ${record.lng}`}>
          <Text>{text}</Text>
        </Tooltip>
      ),
    },
    { title: 'Vitesse', dataIndex: 'speed', render: (speed) => {
        let color = "red";
        if (speed > 5) color = "green";
        else if (speed > 0) color = "orange";
        return <Tag color={color}>{speed} km/h</Tag>;
      },
    },
    { title: 'Statut', dataIndex: 'online', render: (text) =>
        <Tag color={text === "online" ? "green" : "red"}>{text.toUpperCase()}</Tag>,
    },
    { title: 'Moteur', dataIndex: 'sensors', render: (sensors) =>
        <Tag color={getEngineStatus(sensors) === "ON" ? "green" : "red"}>{getEngineStatus(sensors)}</Tag>,
    },
    { title: 'Km Total', dataIndex: 'sensors', render: (sensors) => {
        const km = getOdometer(sensors);
        if (!km || isNaN(km)) return <Tag color="default">N/A</Tag>;
        return <Text>{Number(km).toLocaleString('fr-FR')} km</Text>;
      },
    },
    { title: 'Durée arrêt', dataIndex: 'stop_duration', render: (text) => {
        const formatted = formatStopDuration(text);
        return formatted ? <Text>{formatted}</Text> : <Tag color="default">N/A</Tag>;
      },
    },
    { title: 'Alertes', key: 'alerts', render: (text, record) => <Space wrap>{getAlerts(record)}</Space>, },
    { title: 'Actions', key: 'actions', render: (text, record) => (
        <Space>
          <Button icon={<EyeOutlined />} type="link" onClick={() => handleDetail(record.id)} />
        </Space>
      ),
    },
  ];

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

        <Space style={{ marginBottom: 16 }}>
          <Badge count={totalVehicules} showZero color="blue" />
          <Tag color="green">En ligne: {enLigne}</Tag>
          <Tag color="red">Hors ligne: {horsLigne}</Tag>
        </Space>

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
          scroll={{ x: 1400 }}
          rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
        />
      </div>

      <Modal
        title=""
        visible={modalType === 'detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1050}
        centered
      >
        <CharroiLocalisationDetail id={id} />
      </Modal>
    </div>
  );
};

export default CharroiLocalisation;
