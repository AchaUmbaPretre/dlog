import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip,Popconfirm } from 'antd';
import { ExportOutlined, PrinterOutlined, TagOutlined, ApartmentOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined, EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { getControle } from '../../../services/controleService';

const { Search } = Input;

const ListeSuivi = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalSuivi, setIsModalSuivi] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getControle();
        setData(response.data);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <ExportOutlined /> Exporter vers Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <PrinterOutlined /> Exporter vers PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "5%",
      align: 'center',
    },
    {
      title: 'Département',
      dataIndex: 'departement',
      key: 'departement',
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
      title: 'Responsable',
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
      width: '20%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Voir les détails">
            <Button
              icon={<EyeOutlined />}
              style={{ color: 'blue' }}
              onClick={() => handleViewDetails(record)}
              aria-label="Voir les détails du client"
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record)}
              aria-label="Modifier le client"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce client ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Supprimer le client"
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
              <FileTextOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Liste de suivi</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search
                placeholder="Recherche..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter un contrôle
              </Button>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button icon={<ExportOutlined />}>Exporter</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Imprimer
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ListeSuivi;
