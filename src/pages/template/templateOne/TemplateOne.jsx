import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Menu, notification, Popconfirm, Space, Tooltip, Tag } from 'antd';
import { ExportOutlined,CalendarOutlined,ScheduleOutlined,PlusCircleOutlined, UserOutlined, PrinterOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getTemplateOne } from '../../../services/templateService';

const { Search } = Input;

const TemplateOne = ({idTemplate}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [idClient, setidClient] = useState('');
  const [modalType, setModalType] = useState(null);

    const fetchData = async () => {

      try {
        const { data } = await getTemplateOne(idTemplate);
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
  }, [idTemplate]);

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
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag icon={<UserOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Type occu',
      dataIndex: 'nom_type_d_occupation',
      key: 'nom_type_d_occupation',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Batiment',
      dataIndex: 'nom_batiment',
      key: 'nom_batiment',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Niveau',
      dataIndex: 'nom_niveau',
      key: 'nom_niveau',
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
      dataIndex: 'nom_denomination_bat',
      key: 'nom_denomination_bat',
      render: (text) => (
        <Tag>{text}</Tag>
      ),
    },
    {
        title: 'Whse fact',
        dataIndex: 'nom_whse_fact',
        key: 'nom_whse_fact',
        render: (text) => (
          <Tag>{text}</Tag>
        ),
      },
      {
        title: 'Objet fact',
        dataIndex: 'nom_objet_fact',
        key: 'nom_objet_fact',
        render: (text) => (
          <Tag>{text}</Tag>
        ),
      },
      { 
        title: 'Date active', 
        dataIndex: 'date_actif', 
        key: 'date_actif',
        sorter: (a, b) => moment(a.date_actif).unix() - moment(b.date_actif).unix(), // tri par date
        render: text => (
          <Tag icon={<CalendarOutlined />} color='purple'>{moment(text).format('LL')}</Tag>
        ),
      },
      {
        title: 'Statut',
        dataIndex: 'nom_niveau',
        key: 'nom_niveau',
        render: (text) => (
          <> 
            <Tag color='cyan'>
              {text ?? 'Aucune'}
            </Tag>
          </>
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

export default TemplateOne;
