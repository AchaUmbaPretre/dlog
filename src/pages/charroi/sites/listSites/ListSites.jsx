import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Dropdown, Menu, Space, Tooltip, Popconfirm, Tag, Modal, notification } from 'antd';
import { ExportOutlined, BarcodeOutlined, HomeOutlined, PhoneOutlined, DeleteOutlined, EnvironmentOutlined, TruckOutlined, CalendarOutlined, PrinterOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import { getSite } from '../../../../services/charroiService';
import SitesForm from '../sitesForm/SitesForm';
const { Search } = Input;

const ListSites = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const scroll = { x: 'max-content' };
  
  const handleEdit = (id) => {
  };

    const fetchData = async () => {
      try {
        const { data } = await getSite();
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
        width: "3%" 
    },
    {
        title: 'Code site',
        dataIndex: 'CodeSite',
        key: 'CodeSite',
        render: (text) => (
          <div>
            <BarcodeOutlined style={{ color: '#1890ff', marginRight: 4 }} />
            {text}
          </div>
        ),
      },
    {
      title: 'Nom site',
      dataIndex: 'nom_site',
      key: 'nom_site',
      render: (text) => (
        <div>
          <HomeOutlined style={{ color: '#1890ff', marginRight: 4 }} />
          {text}
        </div>
      ),
    },
    {
      title: 'Adresse',
      dataIndex: 'adress',
      key: 'adresse',
      render: (text) => (
        <div>
          <EnvironmentOutlined style={{ color: '#faad14', marginRight: 4 }} />
          {text}
        </div>
      ),
    },
    {
      title: 'Ville',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div>
          <EnvironmentOutlined style={{ color: 'red', marginRight: 4 }} />
          {text}
        </div>
      ),
    },
    {
      title: 'Téléphone',
      dataIndex: 'tel',
      key: 'tel',
      render: (text) => (
        <div>
          <PhoneOutlined style={{ color: '#eb2f96', marginRight: 4 }} />
          {text}
        </div>
      ),
    }
  ];

  const filteredData = data.filter(item =>
    item.nom_site?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TruckOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Liste des sites</h2>
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
                Ajouter un site
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
            pagination={{ pageSize: 10 }}
            rowKey="key"
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
        width={900}
        centered
      >
        <SitesForm idSite={''} closeModal={() => setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>
    </>
  );
};

export default ListSites;