import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Dropdown, Menu, notification, Popconfirm, Popover, Space, Tooltip, Tag } from 'antd';
import { ExportOutlined,HomeOutlined,ProfileOutlined,MailOutlined,UserOutlined,PhoneOutlined,ApartmentOutlined, PrinterOutlined, PlusOutlined, TeamOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import config from '../../config';
import { getBesoin } from '../../services/besoinsService';

const { Search } = Input;

const Besoins = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getBesoin();
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

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        <Tag icon={<ExportOutlined />} color="green">Export to Excel</Tag>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <Tag icon={<ExportOutlined />} color="blue">Export to PDF</Tag>
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
    },
    {
      title: 'Projet',
      dataIndex: 'nom_projet',
      key: 'nom_projet',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Client',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <Tag icon={<UserOutlined/>} color="green">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Article',
      dataIndex: 'nom_article',
      key: 'nom_article',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
      key: 'quantite',
      render: (text) => (
        <> 
          <Tag color='cyan'>
            {text ?? 'Aucune'}
          </Tag>
        </>
      ),
    },
    {
      title: 'Déscription',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tag color={"magenta"}>{text}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
{/*           <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              type="link"
              aria-label="View client details"
            />
          </Tooltip> */}
{/*           <Tooltip title="Edit">
            <Popover title="Modifier" trigger="hover">
              <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleEdit(record)}
                type="link"
                aria-label="Edit client"
              />
            </Popover>
          </Tooltip> */}
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
  ]

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ProfileOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Besoins</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter un Client
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
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
      </div>
    </>
  );
};

export default Besoins;
