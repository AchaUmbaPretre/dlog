import React, { useEffect, useState } from 'react';
import { Table, Button, Image, Input, message, Dropdown, Menu, Space, Tooltip, Popconfirm, Tag, Modal, notification } from 'antd';
import { ExportOutlined, CarOutlined, TruckOutlined, CalendarOutlined, PrinterOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import CharroiForm from './charroiForm/CharroiForm';
import { getVehicule } from '../../services/charroiService';
import config from '../../config';

const { Search } = Input;

const Charroi = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
   const [pagination, setPagination] = useState({
          current: 1,
          pageSize: 15,
      });
  const scroll = { x: 'max-content' };
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  
  const handleEdit = (id) => {
  };

  const handleDelete = async (id) => {
    /* try {
      await deletePutDepartement(id);
      setData(data.filter((item) => item.id_departement !== id));
      message.success('Departement supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    } */
  };

    const fetchData = async () => {
      try {
        const { data } = await getVehicule();
        setData(data.data);
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

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    // Logic to export data to PDF
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        Export to Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Export to PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Tag color="blue">{index + 1}</Tag>
        </Tooltip>
      ),
      width: "4%" 
    },
    {
      title: 'Image',
      dataIndex: 'img',
      key: 'img',
      render: (text, record) => (
        <div className="userList">
          <Image
            className="userImg"
            src={`${DOMAIN}/${record.img}`}
            width={40}
            height={40}
            style={{ borderRadius: '50%' }}
            alt="Profil utilisateur"
          />
        </div>
      ),
    },
    {
        title: 'Matricule',
        dataIndex: 'immatriculation',
        render: (text) => (
            <div className="vehicule-matricule">
                <span className="car-wrapper">
                    <span className="car-boost" />
                        <CarOutlined className="car-icon-animated" />
                    <span className="car-shadow" />
                </span>
                <Tag color="geekblue">{text}</Tag>
            </div>
        )
    }, 
    {
        title: 'Marque',
        dataIndex: 'nom_marque',
            render: (text, record) => (
                <Tag icon={<CarOutlined />} color="cyan">
                    {text}
                </Tag>
            )
    },
    {
      title: 'Modèle',
      dataIndex: 'modele',
      render : (text) => (
        <Tag icon={<CarOutlined />} color="green">
            {text ?? 'Aucun'}
        </Tag>
      )

    },
    {
        title: 'Categorie',
        dataIndex: 'nom_cat',
        render : (text) => (
          <Tag icon={<CarOutlined />} color="geekblue">
              {text ?? 'Aucun'}
          </Tag>
        )
  
    },
    {
      title: 'Année de fab.',
      dataIndex: 'annee_fabrication',
      render: text => (
        <Tooltip title="Annee fabrication">
            <Tag icon={<CalendarOutlined />} color="magenta">
                {text}
            </Tag>
        </Tooltip>
      )
    },
    {
      title: 'Année circu.',
      dataIndex: 'annee_circulation',
      render: text => (
        <Tooltip title="annee circulation'">
          <Tag icon={<CalendarOutlined />} color="magenta">
                {text}
            </Tag>
        </Tooltip>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle" style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        </Space>
      ),
    }
  ];

  const filteredData = data.filter(item =>
    item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TruckOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Liste des vehicules</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddClient}
              >
                Ajouter un véhicule
              </Button>
              <Dropdown overlay={menu} trigger={['click']} className='client-export'>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                className='client-export'
              >
                Print
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            onChange={(pagination)=> setPagination(pagination)}
            rowKey="id_vehicule"
            bordered
            size="small" 
            scroll={scroll}
            loading={loading}
          />
        </div>
      </div>
 
      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        centered
      >
        <CharroiForm idVehicule={''} closeModal={() => setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>
    </>
  );
};

export default Charroi;