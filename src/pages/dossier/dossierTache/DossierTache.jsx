import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, notification, Popconfirm, Space, Tooltip, Tag, Menu, Dropdown } from 'antd';
import { ExportOutlined, FileTextOutlined, DeleteOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined, FileImageOutlined, DownloadOutlined } from '@ant-design/icons';
import { getDetailDoc } from '../../../services/offreService';
import config from '../../../config';
import { getTacheDoc } from '../../../services/tacheService';

const { Search } = Input;

const DossierTache = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getTacheDoc();
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

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
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

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        <Tag icon={<FileExcelOutlined />} color="green">Export to Excel</Tag>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <Tag icon={<FilePdfOutlined />} color="blue">Export to PDF</Tag>
      </Menu.Item>
    </Menu>
  );

  const getTagProps = (type) => {
    switch (type) {
      case 'PDF':
        return { icon: <FilePdfOutlined />, color: 'red' };
      case 'Word':
        return { icon: <FileWordOutlined />, color: 'blue' };
      case 'Excel':
        return { icon: <FileExcelOutlined />, color: 'green' };
      case 'Image':
        return { icon: <FileImageOutlined />, color: 'orange' };
      default:
        return { icon: <FileTextOutlined />, color: 'default' };
    }
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
      title: 'Titre',
      dataIndex: 'nom_document',
      key: 'nom_document',
      render: (text) => (
        <Tag icon={<FileTextOutlined />} color="green">{text}</Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type_document',
      key: 'type_document',
      render: (text) => {
        const { icon, color } = getTagProps(text);
        return <Tag icon={icon} color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Doc',
      dataIndex: 'chemin_document',
      key: 'chemin_document',
      render: (text) => (
        <a href={`${DOMAIN}/${text}`} target="_blank" rel="noopener noreferrer">
          <Tag icon={<DownloadOutlined />} color="orange">Télécharger</Tag>
        </a>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
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

  return (
    <>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." enterButton />
            </div>
            <div className="client-rows-right">
              <Dropdown overlay={menu} trigger={['click']}>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
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
    </>
  );
};

export default DossierTache;
