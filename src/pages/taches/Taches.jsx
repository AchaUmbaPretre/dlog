import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tag, Tooltip } from 'antd';
import { ExportOutlined, WarningOutlined,ApartmentOutlined, RocketOutlined, DollarOutlined, CheckSquareOutlined, HourglassOutlined, ClockCircleOutlined, PrinterOutlined,CheckCircleOutlined,CalendarOutlined,TeamOutlined, EyeOutlined, UserOutlined, FileTextOutlined, PlusOutlined,FileDoneOutlined } from '@ant-design/icons';
import TacheForm from './tacheform/TacheForm';
import { getTache } from '../../services/tacheService';

const { Search } = Input;

const Taches = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getTache();
        setData(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (record) => {
    message.info(`Viewing details of tache : ${record.nom}`);
  };

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        Exporter vers Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Exporter au format PDF
      </Menu.Item>
    </Menu>
  );

  const statusIcons = {
    'En attente': { icon: <ClockCircleOutlined />, color: 'orange' },
    'En cours': { icon: <HourglassOutlined />, color: 'blue' },
    'Point bloquant': { icon: <WarningOutlined />, color: 'red' },
    'En attente de validation': { icon: <CheckSquareOutlined />, color: 'purple' },
    'Validé': { icon: <CheckCircleOutlined />, color: 'green' },
    'Budget': { icon: <DollarOutlined />, color: 'gold' },
    'Executé': { icon: <RocketOutlined />, color: 'cyan' },
};

const columns = [
    {
        title: '#',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => index + 1,
        width: "3%",
    },
    { 
        title: 'Département', 
        dataIndex: 'departement', 
        key: 'nom_departement',
        render: text => (
          <Space>
            <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
          </Space>
        ),
      },
    {   
        title: 'Nom',
        dataIndex: 'nom_tache', 
        key: 'nom_tache', 
        render: text => (
            <Space>
              <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
            </Space>
        )
    },
    {   
        title: 'Client', 
        dataIndex: 'nom_client', 
        key: 'nom_client',
        render: text => (
            <Space>
              <Tag icon={<UserOutlined />} color='cyan'>{text}</Tag>
            </Space>
        )
    },
    { 
        title: 'Statut', 
        dataIndex: 'statut', 
        key: 'statut',
        render: text => {
            const { icon, color } = statusIcons[text] || {};
            return (
                <Space>
                  <Tag icon={icon} color={color}>{text}</Tag>
                </Space>
            );
        }
    },
    { 
        title: 'Frequence', 
        dataIndex: 'frequence', 
        key: 'frequence',
        render: text => (
            <Space>
              <Tag icon={<CalendarOutlined />} color='blue'>{text}</Tag>
            </Space>
        )
    },
    { 
        title: 'Demandeur', 
        dataIndex: 'owner', 
        key: 'owner',
        render: text => (
            <Space>
              <Tag icon={<TeamOutlined />} color='purple'>{text}</Tag>
            </Space>
        )
    },
    { 
        title: 'Owner', 
        dataIndex: 'owner', 
        key: 'owner',
        render: text => (
            <Space>
              <Tag icon={<TeamOutlined />} color='purple'>{text}</Tag>
            </Space>
        )
    },
    {
        title: 'Action',
        key: 'action',
        width: '10%',
        render : (text, record) => (
            <Space size="middle">
                <Tooltip title="View Details">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                        aria-label="View client details"
                    />
                </Tooltip>
            </Space>
        )
    }
];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileDoneOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Tâches</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Search clients..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Tâches
              </Button>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      <Modal
        title="Ajouter une nouvelle tâche"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={850}
      >
        <TacheForm/>
      </Modal>
    </>
  );
};

export default Taches;
