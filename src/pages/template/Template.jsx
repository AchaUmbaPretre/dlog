import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Popconfirm, Popover, Space, Tooltip, Tag } from 'antd';
import { ExportOutlined,HomeOutlined,ScheduleOutlined,PlusCircleOutlined,MailOutlined,UserOutlined,PhoneOutlined,ApartmentOutlined, PrinterOutlined, PlusOutlined, TeamOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import config from '../../config';
import TemplateForm from './templateForm/TemplateForm';
import { getTemplate } from '../../services/templateService';

const { Search } = Input;

const Template = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [idClient, setidClient] = useState('');
  const [modalType, setModalType] = useState(null);


    const fetchData = async () => {
      try {
        const { data } = await getTemplate();
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
  }, []);

  const handleAddTemplate = (idTemplate) => {
    openModal('Add', idTemplate);
  };

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idClient = '') => {
    closeAllModals();
    setModalType(type);
    setidClient(idClient);
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


  const handleDelete = async (id) => {
    try {
      setData(data.filter((item) => item.id_client !== id));
      message.success('Client deleted successfully');
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
      title: 'Client',
      dataIndex: 'id_client',
      key: 'id_client',
      render: (text) => (
        <Tag icon={<UserOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Type occu',
      dataIndex: 'id_type_occupation',
      key: 'id_type_occupation',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Batiment',
      dataIndex: 'id_batiment',
      key: 'id_batiment',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Niveau',
      dataIndex: 'id_niveau ',
      key: 'id_niveau ',
      render: (text) => (
        <> 
          <Tag color='cyan'>
            {text ?? 'Aucune'}
          </Tag>
        </>
      ),
    },
    {
      title: 'Dénomination',
      dataIndex: 'id_denomination',
      key: 'id_denomination',
      render: (text) => (
        <Tag>{text}</Tag>
      ),
    },
    {
        title: 'Whse fact',
        dataIndex: 'whse_fact',
        key: 'whse_fact',
        render: (text) => (
          <Tag>{text}</Tag>
        ),
      },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
{/*            <Tooltip title="Edit">
            <Popover title="Modifier" trigger="hover">
              <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handlEditClient(record.id_client)}
                aria-label="Edit client"
              />
            </Popover>
          </Tooltip> */}
          <Tooltip title="Delete">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce client?"
              onConfirm={() => handleDelete(record.id_client)}
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
              <ScheduleOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Template</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddTemplate}
              >
                Ajouter un template
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

      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <TemplateForm closeModal={() => setModalType(null)} idClient={''} fetchData={fetchData} />
      </Modal>

    </>
  );
};

export default Template;