import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined, BankOutlined, ApartmentOutlined,EditOutlined, PlusCircleOutlined,DeleteOutlined} from '@ant-design/icons';
import { getBins } from '../../services/batimentService';
import BinForm from '../batiment/bins/binsForm/BinForm';

const { Search } = Input;

const ListBinGlobal = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [idBins, setIdBins] = useState('')
  const scroll = { x: 400 };

  const handleEdit = (id) => {
    setIdBins(id)
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      setData(data.filter((item) => item.id_departement !== id));
      message.success('Departement supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

    const fetchData = async () => {
      try {
         const { data } = await getBins();
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
      render: (text, record, index) => index + 1, 
      width: "5%" 
    },
    { 
        title: 'Batiment', 
        dataIndex: 'nom_batiment', 
        key: 'nom_batiment',
        render: text => (
          <Space>
            <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
          </Space>
        ),
      },
    { 
      title: 'Nom', 
      dataIndex: 'nom', 
      key: 'nom',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Superficie', 
      dataIndex: 'superficie', 
      key: 'superficie',
      render: text => (
        <Tag color='volcano'>{text ? `${text} m²` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Longueur', 
      dataIndex: 'longueur', 
      key: 'longueur',
      render: text => (
        <Tag color='geekblue'>{text ? `${text} L` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Largeur', 
      dataIndex: 'largeur', 
      key: 'largeur',
      render: text => (
        <Tag color='geekblue'>{text ? `${text} W` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Hauteur', 
      dataIndex: 'hauteur', 
      key: 'hauteur',
      render: text => (
        <Tag color='geekblue'>{text ? `${text} H` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Capacité', 
      dataIndex: 'capacite', 
      key: 'capacite',
      render: text => (
        <Tag color='gold'>{text ? `${text} m³` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Statut', 
      dataIndex: 'statut', 
      key: 'statut',
      render: text => (
        <Tag color='green'>{text || "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Type de Stockage', 
      dataIndex: 'type_stockage', 
      key: 'type_stockage',
      render: text => (
        <Tag color='purple'>{text || "Non spécifié"}</Tag>
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
              onClick={() => handleEdit(record.id)}
              style={{ color: 'green' }}
              aria-label="Modifier entrepôt"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cet entrepôt ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Supprimer entrepôt"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  

  const filteredData = data.filter(item =>
    item.nom_departement?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.code?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <BankOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Bins</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
{/*               <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddClient}
              >
                Entrepot
              </Button> */}
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
            pagination={{ pageSize: 10 }}
            rowKey="key"
            bordered
            size="middle"
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
        width={650}
        centered
    >
         <BinForm idBatiment={''} closeModal={() => setIsModalVisible(false)} fetchData={fetchData} idBins={idBins}/>
    </Modal>
    </>
  );
};

export default ListBinGlobal;
