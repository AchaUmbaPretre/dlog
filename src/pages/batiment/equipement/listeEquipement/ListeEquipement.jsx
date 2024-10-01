import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Menu, notification, Popconfirm, Space, Tooltip, Tag, Modal, Popover } from 'antd';
import { ExportOutlined, CheckCircleOutlined, EnvironmentOutlined,CloseCircleOutlined,HomeOutlined,CalendarOutlined,PlusCircleOutlined, ToolOutlined, PrinterOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../../../config';
import { getEquipementOne } from '../../../../services/batimentService';
import EquipementForm from '../equipementForm/EquipementForm';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Maintenance from '../maintenance/Maintenance';
import MaintenanceForm from '../maintenance/MaintenanceForm/MaintenanceForm';

const { Search } = Input;

const ListeEquipement = ({idBatiment}) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };
  const [modalType, setModalType] = useState(null);
  const [idEquipement, setIdEquipement] = useState('');
  const [nameBatiment, setNameBatiment] = useState('');
  const [searchValue, setSearchValue] = useState('');


    const fetchData = async () => {
      try {
        const { data } = await getEquipementOne(idBatiment);
        setData(data);
        setNameBatiment(data[0].nom_batiment)
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
  }, [DOMAIN]);

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


  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };

  const handleEdit = (record) => {
    message.info(`Editing client: ${record.nom}`);
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
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Equipement',
      dataIndex: 'nom_article',
      key: 'nom_article',
      render: (text) => (
        <Tag icon={<ToolOutlined  />} color="blue">{text ?? 'Aucun'}</Tag>
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
    {
      title: 'Bins',
      dataIndex: 'location',
      key: 'location',
      render: (text) => (
        <Tag icon={<EnvironmentOutlined />} color='geekblue' >{text}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
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
                icon={<PlusCircleOutlined />}
                style={{ color: 'blue' }}
                aria-label="Contrôler"
              />
            </Tooltip>
          </Popover>
{/*            <Tooltip title="Edit">
            <Popover title="Modifier" trigger="hover">
              <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleEdit(record)}
                type="link"
                aria-label="Edit client"
              />
            </Popover>
          </Tooltip> */}
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
    item.nom_article?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_statut?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ToolOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste d'équipement de {nameBatiment}</h2>
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
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddClient}
              >
                Equipement
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
        visible={isModalVisible}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <EquipementForm idBatiment={idBatiment} closeModal={()=>setIsModalVisible(false)} fetchData={fetchData} />
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

export default ListeEquipement;
