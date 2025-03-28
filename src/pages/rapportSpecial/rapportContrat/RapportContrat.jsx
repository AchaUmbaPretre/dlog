import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined,DollarOutlined,TagOutlined,FileTextOutlined,CalendarOutlined,UserOutlined,PhoneOutlined, PrinterOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import moment from 'moment';
/* import { getContrat } from '../../services/templateService';
 */import RapportContratForm from './rapportContratForm/RapportContratForm';

const { Search } = Input;

const RapportContrat = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };

    const fetchData = async () => {
      try {
/*         const { data } = await getContrat();
  
        setData(data); */
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

  const handleEdit = (record) => {
    message.info(`Modification fournisseur : ${record.nom}`);
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
        title: 'Conditions(Titre)',
        dataIndex: 'conditions',
        key: 'conditions',
        render: (text) => (
            <Tag icon={<TagOutlined />} color="blue">{text}</Tag>
        ),
    },
    {
        title: 'Client',
        dataIndex: 'nom',
        key: 'nom',
        render: (text) => (
            <Tag icon={<UserOutlined />} color="blue">{text}</Tag>
        ),
    },
    {
        title: 'Date début',
        dataIndex: 'date_debut',
        key: 'date_debut',
        render: (text) => (
            <Tag icon={<CalendarOutlined />} color="green">
                {moment(text).format('DD-MM-yyyy')}
            </Tag>
        ),
    },
    {
        title: 'Date fin',
        dataIndex: 'date_fin',
        key: 'date_fin',
        render: (text) => (
            <Tag icon={<CalendarOutlined />} color="red">
                {moment(text).format('DD-MM-yyyy')}
            </Tag>
        ),
    },
    {
        title: 'Date signature',
        dataIndex: 'date_signature',
        key: 'date_signature',
        render: (text) => (
            <Tag icon={<CalendarOutlined />} color="orange">
                {moment(text).format('DD-MM-yyyy')}
            </Tag>
        ),
    },
    {
        title: 'Montant',
        dataIndex: 'montant',
        key: 'montant',
        render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{`$${text}`}</Tag>
        ),
    },
    {
        title: 'Type contrat',
        dataIndex: 'nom_type_contrat',
        key: 'nom_type_contrat',
        render: (text) => (
            <Tag icon={<FileTextOutlined />} color="cyan">{text}</Tag>
        ),
    }
];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TeamOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Contrat</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter un contrat
              </Button>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
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
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <RapportContratForm closeModal={() => setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>
    </>
  );
};

export default RapportContrat;
