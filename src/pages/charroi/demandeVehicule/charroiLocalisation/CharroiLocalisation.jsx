import { useEffect, useRef, useState } from 'react';
import { CarOutlined, InfoCircleOutlined, MenuOutlined, DownOutlined } from '@ant-design/icons';
import { getFalcon } from '../../../../services/rapportService';
import { notification, Typography, Modal, Menu, Tooltip, Space, Tag, Input, Table, Button, Badge, Dropdown } from 'antd';
import moment from 'moment';
import { getEngineStatus, getOdometer } from '../../../../utils/geocodeService';
import CharroiLocalisationDetail from './charroiLocalisationDetail/CharroiLocalisationDetail';
import { formatStopDuration } from '../../../../utils/renderTooltip';
import { VehicleAddress } from '../../../../utils/vehicleAddress';
import { getDirection, getEngineTag, statusDeviceMap } from '../../../../utils/prioriteIcons';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';

const { Text } = Typography;
const { Search } = Input;

const CharroiLocalisation = () => {
  const [falcon, setFalcon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [id, setId] = useState(null);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const closeAllModals = () => setModalType(null);
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Immatriculation': true,
    'MAJ': true,
    'Vitesse': true,
    "Clé de contact": true,
    'Position': true,
    "Km Total": false,
    'Durée arrêt': true,
    'Direction': true
  });

  const fetchData = async () => {
    try {
      const falconData = await getFalcon();
      const items = falconData.data[0].items || [];
      const gtmItems = items.filter(item => item.name && item.name.startsWith('GTM'));

      setFalcon(gtmItems);
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
        fetchData();

        const interval = setInterval(() => {
        fetchData();
        }, 5000);

        // Nettoyage à la destruction du composant
        return () => clearInterval(interval);
    }, []);

    const toggleColumnVisibility = (columnName, e) => {
      e.stopPropagation();
      setColumnsVisibility(prev => ({
        ...prev,
        [columnName]: !prev[columnName]
      }));
    };
      const menus = (
        <Menu>
          {Object.keys(columnsVisibility).map(columnName => (
            <Menu.Item key={columnName}>
              <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
                <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
                <span style={{ marginLeft: 8 }}>{columnName}</span>
              </span>
            </Menu.Item>
          ))}
        </Menu>
      ); 

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
        { title: 'Immatriculation', 
          dataIndex: 'name', 
          ...getColumnSearchProps(
            'name',
            searchText,
            setSearchText,
            '',
            searchInput
          ),
          render: (text) => (
            <div className="vehicule-matricule">
              <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
              <Text strong>{text}</Text>
            </div>
          ),
          ...(columnsVisibility['Immatriculation'] ? {} : { className: 'hidden-column' }),
        },
        { title: 'MAJ', dataIndex: 'time', render: (text) =>
            <Text>{moment(text, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}</Text>,
            sorter: (a, b) =>
            moment(a.time, "DD-MM-YYYY HH:mm:ss").unix() - moment(b.time, "DD-MM-YYYY HH:mm:ss").unix(),
            ...(columnsVisibility['MAJ'] ? {} : { className: 'hidden-column' }),
        },
        { title: 'Position / Zone', 
          dataIndex: 'address', 
          render: (_, record) => <VehicleAddress record={record} />,
          ...(columnsVisibility['Position'] ? {} : { className: 'hidden-column' })
        },
        { title: 'Vitesse', 
          dataIndex: 'speed', 
          render: (speed) => {
            let color = "red";
            if (speed > 5) color = "green";
            else if (speed > 0) color = "orange";
            return <Tag color={color}>{speed} km/h</Tag>
          },
          ...(columnsVisibility['Vitesse'] ? {} : { className: 'hidden-column' })
        },
        {
          title: 'Clé de contact',
          key: 'statusAndEngine',
          render: (_, record) => {
            const { online, sensors } = record;
            const engineStatus = getEngineStatus(sensors);

            return (
              <div style={{ display: "flex", gap: 1 }}>
                {statusDeviceMap(online)}
                {getEngineTag(engineStatus)}
              </div>
            );
          },
          ...(columnsVisibility['Clé de contact'] ? {} : { className: 'hidden-column' })
        },
        {
          title: 'Km Total',
          dataIndex: 'sensors',
          sorter: (a, b) => {
            const kmA = getOdometer(a.sensors) || 0;
            const kmB = getOdometer(b.sensors) || 0;
            return kmA - kmB;
          },
          render: (sensors) => {
            const km = getOdometer(sensors);
            if (!km) return <Tag color="default">N/A</Tag>;
            return <Text>{km.toLocaleString('fr-FR')} km</Text>;
          },
          ellipsis: false,
          ...(columnsVisibility['Km Total'] ? {} : { className: 'hidden-column' })
        },
        { title: 'Durée arrêt', 
          dataIndex: 'stop_duration', 
          sorter: (a, b) => {
            const dt1 = formatStopDuration(a.stop_duration) || 0;
            const dt2 = formatStopDuration(b.stop_duration) || 0;
            return dt1 - dt2;
          },
          render: (text) => {
            const formatted = formatStopDuration(text);
            return formatted ? <Text>{formatted}</Text> : <Tag color="default">N/A</Tag>;
          },
          ellipsis: false
        },
        {
          title: "Direction",
          dataIndex: "course",
          key: "course",
          align: "center",
          render: (course) => {
            const { label, icon, angle } = getDirection(course);
            return (
              <Tooltip title={`Angle exact: ${angle}°`}>
                <Tag
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "4px 8px",
                    borderRadius: 12,
                    cursor: "default",
                    color: "#fff",
                    backgroundColor: "#1E40AF",
                  }}
                >
                  <span style={{ marginRight: 6, display: "flex" }}>{icon}</span>
                  {label}
                </Tag>
              </Tooltip>
            );
          },
        },
        { title: 'Actions', key: 'actions', align: 'center', render: (text, record) => (
          <Space>
            <Button icon={<InfoCircleOutlined  />} type="link" onClick={() => handleDetail(record.id)} />
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
            <Dropdown overlay={menus} trigger={['click']}>
              <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                Colonnes <DownOutlined />
              </Button>
            </Dropdown>
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
        width={1150}
        centered
      >
        <CharroiLocalisationDetail id={id} />
      </Modal>
    </div>
  );
};

export default CharroiLocalisation;
