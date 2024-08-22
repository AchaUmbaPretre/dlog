import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip, Popover, Popconfirm } from 'antd';
import { ExportOutlined, PrinterOutlined, TagOutlined, PlusCircleOutlined, ApartmentOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined, EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, FileSearchOutlined, FileTextOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import config from '../../config';
import ControleForm from './controleForm/ControleForm';
import { getControle } from '../../services/controleService';

const { Search } = Input;

const ControleDeBase = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getControle();
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
  }, [DOMAIN]);

  const handleEdit = (record) => {
    message.info(`Editing client: ${record.nom}`);
  };

  const handleDelete = async (id) => {
    try {
      // Uncomment when delete function is available
      // await deleteClient(id);
      setData(data.filter((item) => item.id !== id));
      message.success('Client deleted successfully');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const handleViewDetails = (record) => {
    message.info(`Viewing details of client: ${record.nom}`);
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
        <ExportOutlined /> Export to Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <PrinterOutlined /> Export to PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
      align: 'center',
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
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='green'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: text => (
        <Space>
          <Tag icon={<TagOutlined />} color='blue'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Contrôle de base',
      dataIndex: 'controle_de_base',
      key: 'controle_de_base',
      render: text => (
        <Space>
          <Tag icon={<CheckCircleOutlined />} color='orange'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Fréquence',
      dataIndex: 'frequence',
      key: 'frequence',
      render: text => (
        <Tag color='blue'>
          <CalendarOutlined /> {text}
        </Tag>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'responsable',
      key: 'responsable',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='purple'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '15%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              style={{ color: 'blue' }}
              onClick={() => handleViewDetails(record)}
              aria-label="View client details"
            />
          </Tooltip>
          <Popover
            content={
              <div className='popOverSous' style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to={'/suivie'}>
                  <FileSearchOutlined /> Faire un suivi
                </Link>
                <Link to={`/liste_suivie?id_controle=${record.id}`}>
                    <FileTextOutlined /> Liste de suivi
                </Link>
              </div>
            }
            title="Suivi de contrôle"
            trigger="click"
          >
            <Tooltip title="Suivi de controle">
              <Button
                icon={<PlusCircleOutlined />}
                style={{ color: 'blue' }}
                aria-label="Suivi de contrôle"
              />
            </Tooltip>
          </Popover>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record)}
              aria-label="Edit client"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce client?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Delete client"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = data?.filter((item) =>
    item.departement?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.format?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.controle_de_base?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.responsable?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <CheckCircleOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Contrôle de base</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." 
                enterButtonvalue={searchValue}
                onChange={(e) => setSearchValue(e.target.value)} 
              />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                contrôle
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
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title="Ajouter un controle"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={850}
      >
        <ControleForm/>
      </Modal>
    </>
  );
};

export default ControleDeBase;
