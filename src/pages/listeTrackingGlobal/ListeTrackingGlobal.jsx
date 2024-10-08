import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, notification, Popconfirm, Space, Tooltip, Tag, Menu, Modal } from 'antd';
import { ClockCircleOutlined,CheckSquareOutlined,RocketOutlined,CheckCircleOutlined,DollarOutlined,HourglassOutlined,WarningOutlined, CalendarOutlined, FileTextOutlined, DeleteOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import moment from 'moment';
import { estSupprimeSuivi, getSuiviTacheOne } from '../../services/suiviService';

const { Search } = Input;

const ListeTrackingGlobal = ({ idTache }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [nameTache, setNameTache] = useState('');
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 400 };

    const fetchData = async () => {
      try {
        const { data } = await getSuiviTacheOne();
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


  const statusIcons = {
    'En attente': { icon: <ClockCircleOutlined />, color: 'orange' },
    'En cours': { icon: <HourglassOutlined />, color: 'blue' },
    'Point bloquant': { icon: <WarningOutlined />, color: 'red' },
    'En attente de validation': { icon: <CheckSquareOutlined />, color: 'purple' },
    'Validé': { icon: <CheckCircleOutlined />, color: 'green' },
    'Budget': { icon: <DollarOutlined />, color: 'gold' },
    'Executé': { icon: <RocketOutlined />, color: 'cyan' },
  };


  const handleDelete = async (id) => {
    try {
       await estSupprimeSuivi(id);
      setData(data.filter((item) => item.id_suivi !== id));
      message.success('Suive de tracking est supprimé avec succes');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
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
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Titre',
      dataIndex: 'nom_tache',
      key: 'nom_tache',
      render: (text) => (
        <Tag icon={<FileTextOutlined />} color="green">{text}</Tag>
      ),
    },
    {
        title: 'Statut',
        dataIndex: 'nom_type_statut',
        key: 'nom_type_statut',
        render: text => {
            const { icon, color } = statusIcons[text] || {};
            return (
                <Space>
                  <Tag icon={icon} color={color}>{text}</Tag>
                </Space>
            );
        }
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
        sorter: (a, b) => moment(a.date_suivi) - moment(b.date_suivi),
        sortDirections: ['descend', 'ascend'],
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
              title="Êtes-vous sûr de vouloir supprimer ce tracking ?"
              onConfirm={() => handleDelete(record.id_suivi)}
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
    item.nom_tache?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.commentaire?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_type_statut?.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des tracking</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
                <Search placeholder="Recherche..." 
                    enterButton 
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div className="client-rows-right">
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
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

export default ListeTrackingGlobal;
