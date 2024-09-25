import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, notification, Popconfirm, Space, Tooltip, Tag, Menu, Modal } from 'antd';
import { PlusCircleOutlined, CalendarOutlined, FileTextOutlined, DeleteOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import { getSuiviTacheOneV } from '../../../services/suiviService';
import moment from 'moment';
import SuiviTache from '../suiviTache/SuiviTache';

const { Search } = Input;

const ListeTracking = ({ idTache }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [nameTache, setNameTache] = useState('');
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 400 };

    const fetchData = async () => {
      try {
        const { data } = await getSuiviTacheOneV(idTache);
        setData(data);
        setNameTache(data[0].nom_tache)
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
  }, [idTache]);

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };

  const handleTracking = () => {
    openModal('suivi');
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
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Nom tache',
      dataIndex: 'nom_tache',
      key: 'nom_tache',
      render: (text) => (
        <Tag icon={<FileTextOutlined />} color="blue">{text}</Tag>
      ),
    },
    {
        title: 'Statut',
        dataIndex: 'nom_type_statut',
        key: 'nom_type_statut',
        render: (text) => (
          <Tag icon={<FileTextOutlined />} color="blue">{text}</Tag>
        ),
      },
      {
        title: 'Commentaire	',
        dataIndex: 'commentaire',
        key: 'commentaire	',
        render: (text) => (
          <Tag icon={<FileTextOutlined />} color="blue">{text}</Tag>
        ),
      },
      { 
        title: 'Date', 
        dataIndex: 'date_suivi', 
        key: 'date_suivi',
        render: text => (
          <Tag icon={<CalendarOutlined />} color='purple'>{moment(text).format('LL')}</Tag>
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
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">{nameTache ? `Liste des tracking de : ${nameTache}` : 'Liste des tracking'}</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Search doc..." enterButton />
            </div>
            <div className="client-rows-right">
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={handleTracking}
                >
                  Tracking
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
        visible={modalType === 'suivi'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <SuiviTache idTache={idTache} closeModal={() => setModalType(null)} fetchData={fetchData} />
      </Modal>
    </>
  );
};

export default ListeTracking;
