import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, notification, Popconfirm, Space, Tooltip, Tag, Modal } from 'antd';
import { FileTextOutlined,PlusCircleOutlined, DeleteOutlined,EditOutlined, DownloadOutlined } from '@ant-design/icons';
import config from '../../../config';
import { getDetailTacheDoc } from '../../../services/tacheService';
import TacheDoc from '../tacheDoc/TacheDoc';
import { getTagProps } from '../../../utils/prioriteIcons';

const { Search } = Input;

const ListeDocTache = ({ idTache }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [idDoc, setIdDoc] = useState('');
  const scroll = { x: 400 };

    const fetchData = async () => {
      try {
        const { data } = await getDetailTacheDoc(idTache);
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
      const interval = setInterval(() => {
        fetchData();
      }, 5000);
    
      return () => clearInterval(interval); 
    }, [idTache]); 

  const handleAddDoc = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false)
    setIsModal(false)
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

  const handleViewDetails = (id) => {
    setIdDoc(id)
    setIsModal(true)
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
      title: 'Nom doc',
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
          <Tag icon={<DownloadOutlined />} color="blue">Télécharger</Tag>
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

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des documents</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Search doc..." enterButton />
            </div>
            <div className="client-rows-right">
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={handleAddDoc}
                >
                    Ajouter un document
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

        <Modal
            title=""
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={550}
            centered
        >
            <TacheDoc idTache={idTache} fetchData={fetchData} closeModal={handleCancel}/>
        </Modal>

        <Modal
            title=""
            visible={isModal}
            onCancel={handleCancel}
            footer={null}
            width={550}
            centered
        >
            <TacheDoc idTache={idTache} fetchData={fetchData} closeModal={handleCancel} idTacheDoc={idDoc}/>
        </Modal>
      </div>
    </>
  );
};

export default ListeDocTache;
