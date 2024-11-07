import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Popconfirm, Space, Tooltip, Tag } from 'antd';
import { ExportOutlined,FileTextOutlined,MenuOutlined,DownOutlined,TagOutlined,ShopOutlined,OrderedListOutlined,ApartmentOutlined,HomeOutlined,CheckCircleOutlined, CloseCircleOutlined,CalendarOutlined,ScheduleOutlined,PlusCircleOutlined, UserOutlined, PrinterOutlined, DeleteOutlined } from '@ant-design/icons';
import TemplateForm from './templateForm/TemplateForm';
import { getTemplate } from '../../services/templateService';
import moment from 'moment';

const { Search } = Input;

const Template = () => {
  const [loading, setLoading] = useState(true);
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Client': true,
    'Type occu': true,
    'Batiment': true,
    "Niveau": true,
    "Dénomination": true,
    'Whse fact': true,
    'Objet fact': true,
    "Date active": true,
    "Statut": true
  });
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [idClient, setidClient] = useState('');
  const [modalType, setModalType] = useState(null);

    const fetchData = async () => {

      try {
        const { data } = await getTemplate();
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

  const handleAddTemplate = (idTemplate) => {
    openModal('Add', idTemplate);
  };

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idClient = '') => {
    closeAllModals();
    setModalType(type);
    setidClient(idClient);
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


  const handleDelete = async (id) => {
    try {
      setData(data.filter((item) => item.id_client !== id));
      message.success('Client deleted successfully');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const menus = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
            <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
            <span style={{ marginLeft: 8 }}>{columnName}</span>
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );  

  
  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };


  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => (
        <Tag icon={<UserOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
      ),
      ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Type occu',
      dataIndex: 'nom_type_d_occupation',
      key: 'nom_type_d_occupation',
      render: (text) => (
        <Tag icon={<ApartmentOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
      ),
      ...(columnsVisibility['Type occu'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Batiment',
      dataIndex: 'nom_batiment',
      key: 'nom_batiment',
      render: (text) => (
        <Tag icon={<HomeOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
      ),
      ...(columnsVisibility['Batiment'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Niveau',
      dataIndex: 'nom_niveau',
      key: 'nom_niveau',
      render: (text) => (
        <Tag icon={<OrderedListOutlined />} color="cyan">{text ?? 'Aucune'}</Tag>
      ),
      ...(columnsVisibility['Niveau'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Dénomination',
      dataIndex: 'nom_denomination_bat',
      key: 'nom_denomination_bat',
      render: (text) => (
        <Tag icon={<TagOutlined />} color="purple">{text ?? 'Aucune'}</Tag>
      ),
      ...(columnsVisibility['Dénomination'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Whse fact',
      dataIndex: 'nom_whse_fact',
      key: 'nom_whse_fact',
      render: (text) => (
        <Tag icon={<ShopOutlined />} color="geekblue">{text ?? 'Aucune'}</Tag>
      ),
      ...(columnsVisibility['Whse fact'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Objet fact',
      dataIndex: 'nom_objet_fact',
      key: 'nom_objet_fact',
      render: (text) => (
        <Tag icon={<FileTextOutlined />} color="green">{text ?? 'Aucun'}</Tag>
      ),
      ...(columnsVisibility['Objet fact'] ? {} : { className: 'hidden-column' })

    },
    { 
      title: 'Date active', 
      dataIndex: 'date_actif', 
      key: 'date_actif',
      sorter: (a, b) => moment(a.date_actif).unix() - moment(b.date_actif).unix(),
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color='purple'>
          {text ? moment(text).format('DD-MM-yyyy') : 'Aucune'}
        </Tag>
      ),
      ...(columnsVisibility['Date active'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Statut',
      dataIndex: 'id_statut_template',
      key: 'id_statut_template',
      render: (text) => (
        text === 1 ? (
          <Tag color="cyan" icon={<CheckCircleOutlined style={{ color: 'green' }} />}>
            Activé
          </Tag>
        ) : (
          <Tag color="gray" icon={<CloseCircleOutlined style={{ color: 'red' }} />}>
            Désactivé
          </Tag>
        )
      ),
      ...(columnsVisibility['Statut'] ? {} : { className: 'hidden-column' })

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
              onConfirm={() => handleDelete(record.id_client)}
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
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_type_d_occupation?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_niveau?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_denomination_bat?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_objet_fact?.toLowerCase().includes(searchValue.toLowerCase())

   );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ScheduleOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Template</h2>
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
                onClick={handleAddTemplate}
              >
                Ajouter un template
              </Button>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </Button>
              <Dropdown overlay={menus} trigger={['click']}>
                <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                  Colonnes <DownOutlined />
                </Button>
              </Dropdown>
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
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <TemplateForm closeModal={() => setModalType(null)} fetchData={fetchData} />
      </Modal>
    </>
  );
};

export default Template;
