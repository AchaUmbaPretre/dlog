import { useEffect, useState } from 'react';
import { CarOutlined, EyeOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import { getFalcon } from '../../../../services/rapportService';
import { notification, Typography, Modal, Tooltip, Space, Tag, Input, Table, Button, Badge } from 'antd';
import moment from 'moment';
import { getAlerts, getEngineStatus, getOdometer } from '../../../../services/geocodeService';
import CharroiLocalisationDetail from './charroiLocalisationDetail/CharroiLocalisationDetail';
import { formatStopDuration } from '../../../../utils/renderTooltip';
import { VehicleAddress } from '../../../../utils/vehicleAddress';
import GetEventLocalisation from './getEventLocalisation/GetEventLocalisation';
import RapportEvent from './rapportEvent/RapportEvent';
import { engineMap, getDirection, statusDeviceMap } from '../../../../utils/prioriteIcons';

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
        const falconData = await getFalcon();
        const items = falconData.data[0].items || [];
        setFalcon(items);
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

        const interval = setInterval(() => {
        fetchData();
        }, 5000);

        // Nettoyage à la destruction du composant
        return () => clearInterval(interval);
    }, []);

    const openModal = (type, id = '') => {
        closeAllModals();
        setModalType(type);
        setId(id);
    };

    const handleDetail = (id) => openModal('detail', id);
    const handleEvenement = () => openModal('Event')
    const handleRapport = () => openModal('rapport')

    const columns = [
        { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
          }, width: "4%",
        },
        { title: 'Immatriculation', dataIndex: 'name', render: (text) => (
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
        { title: 'Adresse', dataIndex: 'address',render: (_, record) => <VehicleAddress record={record} />
        },
        { title: 'Vitesse', dataIndex: 'speed', render: (speed) => {
            let color = "red";
            if (speed > 5) color = "green";
            else if (speed > 0) color = "orange";
            return <Tag color={color}>{speed} km/h</Tag>;
        },
        },
        {
          title: 'Statut',
          dataIndex: 'online',
          render: (text = '') => {

            const key = text?.toLowerCase();
            const status = statusDeviceMap[key] || { color: 'default', label: text.toUpperCase() || 'N/A', icon: null };
            return (
              <Tag color={status.color} icon={status.icon}>
                {status.label}
              </Tag>
            );
          },
        },
        {
          title: 'Moteur',
          dataIndex: 'sensors',
          render: (sensors) => {
            const engineStatus = getEngineStatus(sensors);
            const status = engineMap[engineStatus] || { color: 'default', label: engineStatus || 'N/A', icon: null };
            return (
              <Tag color={status.color} icon={status.icon}>
                {status.label}
              </Tag>
            );
          },
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
        {
          title: 'Direction',
          dataIndex: 'course',
          key: 'course',
          align: 'center',
          render: (text) => {
            const { label, icon, color, angle } = getDirection(text);

            return (
              <Tooltip title={`Angle exact: ${angle}°`}>
                <Tag
                  color={`${color}33`}
                  style={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    width:'100%',
                    fontWeight: 600,
                    fontSize: 14,
                    padding: '6px',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    cursor: 'default'
                  }}
                >
                  <span style={{ marginRight: 8 }}>{icon}</span>
                  {label}
                </Tag>
              </Tooltip>
            );
          },
        },
        { title: 'Actions', key: 'actions', render: (text, record) => (
          <Space>
            <Button icon={<EyeOutlined />} type="link" onClick={() => handleDetail(record.id)} />
          </Space>
        ),
        }
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
          <div className="client-rows-right">
            <Button
                type="primary"
                icon={<CalendarOutlined />}
                onClick={handleEvenement}
            >
                Voir les événements
            </Button>
            <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={handleRapport}
            >
                Rapport
            </Button>
          </div>
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
        width={1080}
        centered
      >
        <CharroiLocalisationDetail id={id} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Event'}
        onCancel={closeAllModals}
        footer={null}
        width={1090}
        centered
      >
        <GetEventLocalisation />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'rapport'}
        onCancel={closeAllModals}
        footer={null}
        width={1085}
        centered
      >
        <RapportEvent />
      </Modal>
    </div>
  );
};

export default CharroiLocalisation;
