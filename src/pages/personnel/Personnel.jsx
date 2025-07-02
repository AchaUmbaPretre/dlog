import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Typography, message, Menu, notification, Tag } from 'antd';
import { ExportOutlined, ToolOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import config from '../../config';

import PersonnelForm from './personnelForm/PersonnelForm';
import { getPersonne } from '../../services/userService';

const { Search } = Input;
const { Text } = Typography

const Personnel = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };
  const [searchValue, setSearchValue] = useState('');
  

   const fetchData = async () => {
      try {
        const { data } = await getPersonne();
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
  }, [DOMAIN]);
  

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

/*   const handleEdit = (record) => {
    message.info(`Modification fournisseur : ${record.nom}`);
  }; */

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
        <Tag icon={<ExportOutlined />} color="green">Export to Excel</Tag>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <Tag icon={<ExportOutlined />} color="blue">Export to PDF</Tag>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <Text>{text}</Text>
      ),
    },
    {
      title: 'Prenom',
      dataIndex: 'prenom',
      key: 'prenom',
      render: (text) => (
        <Text>{text}</Text>
      ),
    },
    {
      title: 'Matricule',
      dataIndex: 'matricule',
      key: 'matricule',
      render: (text) => (
        <Text>{text}</Text>
      ),
    },
    {
      title: 'Département',
      dataIndex: 'nom_departement',
      key: 'nom_departement',
      render: (text) => (
        <Text>{text}</Text>
      ),
    }
  ];

  const filteredData = data?.filter(item =>
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_departement?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ToolOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Personnel</h2>
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
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter
              </Button>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </Button>
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
        </div>
      </div>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={750}
        centered
      >
        <PersonnelForm fetchData={fetchData} modalOff={setIsModalVisible} />
      </Modal>
    </>
  );
};

export default Personnel;
