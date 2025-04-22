import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Card, Typography, message, notification, Popconfirm, Space, Tooltip, Tag, Modal, Skeleton } from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import InspectionGenFormTracking from './inspectionGenFormTracking/InspectionGenFormTracking';
import { getTracking } from '../../../services/charroiService';
const { Title, Text } = Typography;

const { Search } = Input;

const InspectionGenTracking = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [vehicule, setVehicule] = useState('');
  const [marque, setMarque] = useState('')

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getTracking();
      setData(data)

    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [idSubInspectionGen]);

  const handleTracking = () => {
    openModal('suivi');
  };

  const handleDelete = async (id) => {
    try {
      setData(data.filter((item) => item.id !== id));
      message.success('Client deleted successfully');
    } catch (error) {
      console.log(error)
      /* notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      }); */
    }
  };

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type) => {
    closeAllModals();
    setModalType(type);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%"
    },
    { title: 'Statut', dataIndex: 'nom_type_statut', key: 'nom_type_statut', render: (text) => <Tag color="blue">{text}</Tag> },
    { title: 'Commentaire', dataIndex: 'commentaire', key: 'commentaire', render: (text) => <Tag color="blue">{text}</Tag> },
    { title: 'Date', dataIndex: 'date_suivi', key: 'date_suivi', render: (text) => <Tag color='purple'>{moment(text).format('LL')}</Tag> },
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
              <Button icon={<DeleteOutlined />} style={{ color: 'red' }} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="client">
      <div className="client-wrapper">
        <Card style={{marginBottom:'15px'}}>
            <>
                    <Title level={4}>Détails de l’inspection</Title>
                    <Text strong>Marque :</Text> <Text>{marque}</Text><br />
                    <Text strong>Immatriculation :</Text> <Text>{vehicule}</Text><br />
            </>
          </Card>
        <div className="client-actions">
          <div className="client-row-left">
            <Search placeholder="Rechercher..." enterButton />
          </div>
          <div className="client-rows-right">
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleTracking}>
              Ajouter un tracking
            </Button>
          </div>
        </div>
        {loading ? (
          <Skeleton active />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            onChange={(pagination) => setPagination(pagination)}
            pagination={pagination}
            rowKey="id"
            bordered
            size="small"
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        )}
      </div>
      <Modal
        title=""
        visible={modalType === 'suivi'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <InspectionGenFormTracking idSubInspectionGen={idSubInspectionGen} closeModal={() => setModalType(null)} fetchData={fetchData} />
     </Modal>
    </div>
  );
};

export default InspectionGenTracking;
