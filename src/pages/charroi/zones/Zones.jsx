import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Input,
  Dropdown,
  Menu,
  Space,
  Tooltip,
  Tag,
  Modal,
  notification
} from 'antd';
import {
  ExportOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  RadarChartOutlined,
  CompassOutlined,
  PrinterOutlined,
  PlusCircleOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EditOutlined
} from '@ant-design/icons';

import ZoneForm from './zoneForm/ZoneForm';
import { getZone } from '../../../services/charroiService';

const { Search } = Input;

const Zones = () => {
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [modalType, setModalType] = useState(null);
  const [idZone, setIdZone] = useState('');
  const scroll = { x: 'max-content' };

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getZone();
      setZones(data || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger la liste des zones.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

   const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, id = '') => {
    closeAllModals();
    setIdZone(id);
    setModalType(type);
  };

  const handlePrint = () => window.print();

  const exportMenu = (
    <Menu>
      <Menu.Item key="excel">Exporter vers Excel</Menu.Item>
      <Menu.Item key="pdf">Exporter vers PDF</Menu.Item>
    </Menu>
  );

  const getTypeZoneTag = (type) => {
    const types = {
      'géofencé': { color: 'blue', icon: <RadarChartOutlined /> },
      'normal': { color: 'green', icon: <GlobalOutlined /> }
    };
    return types[type] || { color: 'default', icon: <EnvironmentOutlined /> };
  };

  const getStateTag = (state) => {
    return state === 1 ? 
      { color: 'success', icon: <CheckCircleOutlined />, text: 'Actif' } : 
      { color: 'error', icon: <StopOutlined />, text: 'Inactif' };
  };

  const columns = [
    {
      title: '#',
      width: 60,
      render: (_, __, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Tag color="blue">{index + 1}</Tag>
        </Tooltip>
      )
    },
    {
      title: 'Nom de la zone',
      dataIndex: 'NomZone',
      key: 'NomZone',
      sorter: (a, b) => a.NomZone?.localeCompare(b.NomZone),
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      )
    },
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site',
      render: (_, record) => (
        <Space>
          <HomeOutlined style={{ color: '#faad14' }} />
          <span>{record.site_nom ?? 'N/A'}</span>
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type_zone',
      key: 'type_zone',
      filters: [
        { text: 'Géofencé', value: 'géofencé' },
        { text: 'Normal', value: 'normal' }
      ],
      onFilter: (value, record) => record.type_zone === value,
      render: (type) => {
        const { color, icon } = getTypeZoneTag(type);
        return (
          <Tag color={color} icon={icon}>
            {type?.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Coordonnées',
      key: 'coordinates',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tooltip title="Latitude">
            <Space>
              <CompassOutlined style={{ color: '#52c41a' }} />
              <span>{record.latitude?.toFixed(6) || '-'}</span>
            </Space>
          </Tooltip>
          <Tooltip title="Longitude">
            <Space>
              <CompassOutlined rotate={90} style={{ color: '#f5222d' }} />
              <span>{record.longitude?.toFixed(6) || '-'}</span>
            </Space>
          </Tooltip>
        </Space>
      )
    },
    {
      title: 'Rayon',
      dataIndex: 'rayon_metres',
      key: 'rayon_metres',
      sorter: (a, b) => a.rayon_metres - b.rayon_metres,
      render: (rayon) => rayon ? `${rayon} m` : '-'
    },
    {
      title: 'État',
      dataIndex: 'state',
      key: 'state',
      filters: [
        { text: 'Actif', value: 1 },
        { text: 'Inactif', value: 0 }
      ],
      onFilter: (value, record) => record.state === value,
      render: (state) => {
        const { color, icon, text } = getStateTag(state);
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      }
    },
    {
        title : 'Actions',
        align: 'center',
        width: 120,
        render: (_, record) => (
            <Space size="middle" >
                <Tooltip title="Modifier">
              <Button
                  icon={<EditOutlined />}
                  type="text"
                  style={{ color: "green" }}
                  onClick={() => openModal('Add', record.id)}
              />
              </Tooltip>
            </Space>
        )
    }
  ];

  const filteredZones = zones.filter((zone) =>
    zone.NomZone?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <RadarChartOutlined className="client-icon" />
            <h2 className="client-h2">Liste des zones</h2>
          </div>

          <div className="client-actions">
            <Search
              placeholder="Rechercher une zone..."
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 300 }}
            />

            <Space>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={()=> openModal('Add')}
              >
                Ajouter une zone
              </Button>

              <Dropdown overlay={exportMenu}>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>

              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                Imprimer
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={filteredZones}
            rowKey="id"
            loading={loading}
            bordered
            size="small"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} zones`
            }}
            scroll={scroll}
          />
        </div>
      </div>
       
      <Modal
        visible={modalType === 'Add'}
        footer={null}
        width={900}
        centered
        destroyOnClose
        onCancel={closeAllModals}
        title=""
      >
        <ZoneForm closeModal={closeAllModals} fetchData={fetchZones} idZone={idZone} />
      </Modal>
    </>
  );
};

export default Zones;