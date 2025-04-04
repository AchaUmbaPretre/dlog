import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, notification, Popconfirm, Space, Tooltip, Tag, Modal, Popover } from 'antd';
import { CheckCircleOutlined, EnvironmentOutlined,EditOutlined,MoreOutlined, CloseCircleOutlined,CalendarOutlined,PlusCircleOutlined, ToolOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getEquipement } from '../../services/batimentService';
import MaintenanceForm from '../batiment/equipement/maintenance/MaintenanceForm/MaintenanceForm';
import Maintenance from '../batiment/equipement/maintenance/Maintenance';
import EquipementForm from '../batiment/equipement/equipementForm/EquipementForm';

const { Search } = Input;

const ListeEquipementGlobal = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };
  const [modalType, setModalType] = useState(null);
  const [idEquipement, setIdEquipement] = useState('');
  const [nameBatiment, setNameBatiment] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

    const fetchData = async () => {
      try {
        const { data } = await getEquipement();
        setData(data);
        setNameBatiment(data[0].nom_batiment)
        setLoading(false);
      } catch (error) {
        console.log(error)
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const closeAllModals = () => {
    setIsModalVisible(false);
    setModalType(null)
  };

  const openModal = (type, idEquipement = '') => {
    closeAllModals();
    setIdEquipement(idEquipement);
    setModalType(type);
  };

  const handleMaintenance = (idEquipement) => {
    openModal('addMaintenance', idEquipement)
  }

  const handleListeMaintenance = (idEquipement) => {
    openModal('listeMaintenance', idEquipement)
  }

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleEdit = (idEquipement) => {
    openModal('update', idEquipement)
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
    {
      title: 'Equipement',
      dataIndex: 'nom_article',
      key: 'nom_article',
      render: (text) => (
        <Tag icon={<ToolOutlined  />} color="green">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Bin',
      dataIndex: 'nom_bin',
      key: 'nom_bin',
      render: (text) => (
        <Tag icon={<EnvironmentOutlined  />} color="red">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
      render: (text) => (
        <Tag icon={<EnvironmentOutlined  />} color="red">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Date Installation',
      dataIndex: 'installation_date',
      key: 'installation_date',
      sorter: (a, b) => moment(a.installation_date) - moment(b.installation_date),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
      ),
    },
    {
      title: 'Date M',
      dataIndex: 'maintenance_date',
      key: 'maintenance_date',
      sorter: (a, b) => moment(a.maintenance_date) - moment(b.maintenance_date),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <> 
          <Tag icon={<CalendarOutlined />} color="blue">
            {moment(text).format('DD-MM-yyyy')}
          </Tag>
        </>
      ),
    },
    {
      title: 'Date PM',
      dataIndex: 'date_prochaine_maintenance',
      key: 'date_prochaine_maintenance',
      sorter: (a, b) => moment(a.date_prochaine_maintenance) - moment(b.date_prochaine_maintenance),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <> 
          <Tag icon={<CalendarOutlined />} color="blue">
            {moment(text).format('DD-MM-yyyy')}
          </Tag>,
        </>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'nom_statut',
      key: 'nom_statut',
      render: (text) => {
        let color = 'green';
        let icon = <CheckCircleOutlined />;
    
        if (text === 'En entretien') {
          color = 'orange';
          icon = <ToolOutlined />;
        } else if (text === 'En panne') {
          color = 'red';
          icon = <CloseCircleOutlined />;
        }
    
        return (
          <Tag icon={icon} color={color}>
            {text}
          </Tag>
        );
      },
    },    
/*     {
      title: 'Bins',
      dataIndex: 'location',
      key: 'location',
      render: (text) => (
        <Tag icon={<EnvironmentOutlined />} color='red' >{text}</Tag>
      ),
    }, */
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
                    onClick={() => handleEdit(record.id_equipement)}
                    aria-label="Edit client"
                />
          </Tooltip>
        <Popover
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link onClick={() => handleMaintenance(record.id_equipement)} >
                  <ToolOutlined /> Maitenance
                </Link>
                <Link onClick={()=>handleListeMaintenance(record.id_equipement)}>
                  <ToolOutlined /> Liste de maintenance
                </Link>
              </div>
            }
            title=""
            trigger="click"
          >
            <Tooltip title="Menu">
              <Button
                icon={<MoreOutlined />}
                style={{ color: 'black' }}
                aria-label="Contrôler"
              />
            </Tooltip>
          </Popover>
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
  ]

  const filteredData = data.filter(item =>
    item.nom_article?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ToolOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste d'équipements</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search 
                placeholder="Recherche..." 
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
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
            rowKey="id"
            bordered
            size="small"
            scroll={scroll}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'update'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <EquipementForm idBatiment={''} closeModal={()=>setIsModalVisible(false)} fetchData={fetchData} idEquipement={idEquipement} />
      </Modal>
      <Modal
        title=""
        visible={modalType === 'listeMaintenance'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <Maintenance idEquipement={idEquipement} closeModal={()=>setModalType(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title="Maintenance"
        visible={modalType === 'addMaintenance'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <MaintenanceForm idEquipement={idEquipement} closeModal={()=>setModalType(null)} fetchData={fetchData} />
      </Modal>
    </>
  );
};

export default ListeEquipementGlobal;
