import React, { useEffect, useState } from 'react';
import { Table, Button,Input, message, Menu, notification, Space, Tooltip, Popconfirm, Tag, Modal } from 'antd';
import { SolutionOutlined,UserOutlined,EyeOutlined, PrinterOutlined,UnlockOutlined ,EditOutlined, DeleteOutlined} from '@ant-design/icons';
import config from '../../config';
import { getUser } from '../../services/userService';
import PermissionOne from './permissionOne/PermissionOne';

const { Search } = Input;

const Permission = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idUser, setIdUser] = useState('')

  const scroll = { x: 400 };

  const handleEdit = (id) => {
    setIdUser(id)
    setIsModalVisible(true)
  };


   useEffect(() => {
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

    fetchData();
  }, [DOMAIN]);

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExportExcel = () => {

  };

  const handleExportPDF = () => {
  };

  const handlePrint = () => {
    window.print();
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
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
      title: 'Nom', 
      dataIndex: 'nom', 
      key: 'nom',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Role', 
      dataIndex: 'role', 
      key: 'role',
      render: text => (
        <Space>
          <Tag icon={<SolutionOutlined />}  color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Voir les permissions">
            <Button
              icon={<EyeOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record.id_utilisateur)}
              aria-label="voir"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <UnlockOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Permission</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="recherche..." enterButton />
            </div>
            <div className="client-rows-right">
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
            pagination={{ pageSize: 15 }}
            rowKey="key"
            bordered
            size="middle"
            scroll={scroll}
            loading={loading}
          />
        </div>
      </div>

       <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <PermissionOne idUser={idUser}/>
      </Modal>
    </>
  );
};

export default Permission;
