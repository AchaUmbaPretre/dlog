import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input,Tooltip, Tag, message,Popconfirm, Dropdown, Menu, notification, Space } from 'antd';
import { ExportOutlined,SafetyOutlined, LockOutlined, EnvironmentOutlined, ApartmentOutlined, PrinterOutlined,DeleteOutlined,MailOutlined,EditOutlined, UserOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import config from '../../config';
import { getUser } from '../../services/userService';
import FormUsers from './formUsers/FormUsers';

const { Search } = Input;

const Users = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };

    const fetchData = async () => {
      try {
        const { data } = await getUser();
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

  useEffect(() => {
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
    message.info(`Modification d'utilisateur : ${record.nom}`);
    setUserId(record.id_utilisateur)
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // Uncomment when delete function is available
      // await deleteClient(id);
      setData(data.filter((item) => item.id !== id));
      message.success("L'utilisateur a été supprimé avec succès");
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        Export to Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Export to PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    { title: 'Nom', 
      dataIndex: 'nom', 
      key: 'nom',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='green'>{text}</Tag>
        </Space>
    )
    },
    { title: 'Prénom', 
      dataIndex: 'prenom', 
      key: 'prenom',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='green'>{text ?? 'N/A'}</Tag>
        </Space>
    )
    },
    { title: 'Email', 
      dataIndex: 'email', 
      key: 'email',
      render: text => (
        <Space>
          <Tag icon={<MailOutlined />} color='blue'>{text}</Tag>
        </Space>
      ),
    },
    { title: 'Ville', 
      dataIndex: 'name', 
      key: 'name',
      render: text => (
        <Space>
          <Tag icon={<EnvironmentOutlined />} color='red'>{text ?? 'N/A'}</Tag>
        </Space>
      ),
    },
    { title: 'Departement', 
      dataIndex: 'nom_departement', 
      key: 'nom_departement',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text ?? 'N/A'}</Tag>
        </Space>
      ),
    },
    { title: 'Role', 
      dataIndex: 'role', 
      key: 'role',
      render: text => (
        <Space>
          <Tag icon={<SafetyOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
     {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record)}
              aria-label="Edit client"
            />
          </Tooltip>
          <Tooltip title="Changer le mot de passe">
            <Button
              icon={<LockOutlined />}
              style={{ color: '#000' }}
              onClick={() => handleEdit(record)}
              aria-label="Edit client"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
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

  const filteredData = data.filter(item =>
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.prenom?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchValue.toLowerCase())
  );


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TeamOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Utilisateur</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search 
                placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter un utilisateur
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
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 15 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <FormUsers userId={userId} close={()=> setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>
    </>
  );
};

export default Users;
