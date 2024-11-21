import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Input, notification, Space, Tooltip, Tag, Modal } from 'antd';
import { ClockCircleOutlined,InfoCircleOutlined,ApartmentOutlined, UserOutlined, TeamOutlined,CheckSquareOutlined,RocketOutlined,CheckCircleOutlined,DollarOutlined,HourglassOutlined,WarningOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { getTache } from '../../../services/tacheService';
import PermissionTache from '../permissionTache/PermissionTache';

const { Search } = Input;

const ListeTachePermi = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [idTache, setIdTache] = useState('')
  const scroll = { x: 400 };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

    const fetchData = async () => {
      try {
        const { data } = await getTache();
        setData(data.taches);
        setLoading(false);
      } 
      catch (error) {
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

  const statusIcons = {
    'En attente': { icon: <ClockCircleOutlined />, color: 'orange' },
    'En cours': { icon: <HourglassOutlined />, color: 'blue' },
    'Point bloquant': { icon: <WarningOutlined />, color: 'red' },
    'En attente de validation': { icon: <CheckSquareOutlined />, color: 'purple' },
    'Validé': { icon: <CheckCircleOutlined />, color: 'green' },
    'Budget': { icon: <DollarOutlined />, color: 'gold' },
    'Executé': { icon: <RocketOutlined />, color: 'cyan' },
  };

  const handleViewDetails = (idTache) => {
    openModal('detail', idTache);
  };

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idTache = '') => {
    closeAllModals();
    setModalType(type);
    setIdTache(idTache);
  };  

  const columnStyles = {
    title: {
      maxWidth: '250px',
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
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%",    },
    { 
      title: 'DPT', 
      dataIndex: 'departement', 
      key: 'nom_departement',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      )
    },
    {   
      title: 'Titre',
      dataIndex: 'nom_tache', 
      key: 'nom_tache', 
      render: (text,record) => (
        <Space style={columnStyles.title} className={columnStyles.hideScroll} onClick={() => handleViewDetails(record.id_tache)}>
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
        </Space>
      )
    },
    {   
      title: 'Client', 
      dataIndex: 'nom_client', 
      key: 'nom_client',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='green'>{text ?? 'Aucun'}</Tag>
        </Space>
      )    
    },
    { 
      title: 'Statut', 
      dataIndex: 'statut', 
      key: 'statut',
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
      title: 'Fréquence', 
      dataIndex: 'frequence', 
      key: 'frequence',
      render: text => (
        <Space>
          <Tag icon={<CalendarOutlined />} color='blue'>{text}</Tag>
        </Space>
      )
    },
    { 
      title: 'Corps metier', 
      dataIndex: 'nom_corps_metier', 
      key: 'nom_corps_metier',
      render: text => (
        <Space>
          <Tag color='blue'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Categorie', 
      dataIndex: 'id_cat_tache', 
      key: 'id_cat_tache',
      render: text => (
        <Space>
          <Tag color='blue'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
    },
    {
      title: 'Owner', 
      dataIndex: 'owner', 
      key: 'owner',
      render: text => (
        <Space>
          <Tag icon={<TeamOutlined />} color='purple'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
          <Space size="middle">
            <Tooltip title="Voir les détails">
              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => handleViewDetails(record.id_tache)}
                aria-label="Voir les détails de la tâche"
                style={{ color: 'blue' }}
              />
            </Tooltip>
          </Space>
        )
    }
  ];

  const filteredData = data.filter(item =>
    item.nom_tache?.toLowerCase().includes(searchValue.toLowerCase())  );


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des taches</h2>
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
            </div>
          </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="id"
                bordered
                size="middle"
                scroll={scroll}
            />
        </div>
      </div>
      <Modal
        title=""
        visible={modalType === 'detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1070}
        centered
      >
        <PermissionTache idTache={idTache}/>
      </Modal>
    </>
  );
};

export default ListeTachePermi;
