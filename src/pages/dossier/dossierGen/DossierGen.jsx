import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, notification, Space, Tooltip, Tag, Menu, Dropdown, Popconfirm, Modal } from 'antd';
import { FileTextOutlined,EditOutlined, DeleteOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined, FileImageOutlined, DownloadOutlined } from '@ant-design/icons';
import config from '../../../config';
import TacheDoc from '../../taches/tacheDoc/TacheDoc';
import { getDocgeneral } from '../../../services/suiviService';

const { Search } = Input;

const DossierGen = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const scroll = { x: 400 };
  const [idDoc, setIdDoc] = useState('');
  const [isModal, setIsModal] = useState(false);


    const fetchData = async () => {
      try {
        const { data } = await getDocgeneral();
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

  const handleCancel = () => {
    setIsModal(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };


  const handleViewDetails = (id) => {
        setIdDoc(id)
        setIsModal(true)
      }

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

  const columnStyles = {
    title: {
      maxWidth: '280px',
      whiteSpace: 'nowrap',
      overflowX: 'scroll', 
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none', 
    },
    hideScroll: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
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
        <Space style={columnStyles.title} className={columnStyles.hideScroll}>
            <Tag icon={<FileTextOutlined />} color="green">{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type_document',
      key: 'type_document',
      render: (text) => {
        const { icon, color } = getTagProps(text);
        return <Tag icon={icon} color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Voir',
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
            <Tooltip title="Modifier">
                <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleViewDetails(record.id_tache_document )}
                aria-label=""
                />
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer ce dossier?"
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
    item.nom_document?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.type_document?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_tache?.toLowerCase().includes(searchValue.toLowerCase())  );


  return (
    <>
        <div className="client-actions">
            <div className="client-row-left">
                <Search
                    placeholder="Recherche..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    enterButton
                  />
            </div>
            <div className="client-rows-right">
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

        <Modal
            title=""
            visible={isModal}
            onCancel={handleCancel}
            footer={null}
            width={550}
            centered
        >
            <TacheDoc idTache={''} fetchData={fetchData} closeModal={handleCancel} idTacheDoc={idDoc}/>
        </Modal>
    </>
  );
};

export default DossierGen;
