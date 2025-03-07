import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Popconfirm, Space, Tooltip, Tag, Tabs } from 'antd';
import { EditOutlined,FileSyncOutlined,SnippetsOutlined,ShareAltOutlined,EyeOutlined,LockOutlined,FileTextOutlined,MenuOutlined,DownOutlined,TagOutlined,OrderedListOutlined,ApartmentOutlined,HomeOutlined,CalendarOutlined,ScheduleOutlined,PlusCircleOutlined, UserOutlined, PrinterOutlined, DeleteOutlined } from '@ant-design/icons';
import TemplateForm from './templateForm/TemplateForm';
import { deletePutTemplate, getTemplate } from '../../services/templateService';
import moment from 'moment';
import { StatutColumn } from './templateStatut/TemplateStatut';
import TemplateDetail from './templateDetail/TemplateDetail';
import TabPane from 'antd/es/tabs/TabPane';
import Contrat from '../contrat/Contrat';
import { useSelector } from 'react-redux';
import { getSubMenuAccessByUrl } from '../../utils/tacheGroup';

const { Search } = Input;

const Template = ({datas}) => {
  const [loading, setLoading] = useState(true);
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Template' : true,
    'Client': true,
    'Type occu': true,
    'Batiment': true,
    "Niveau": true,
    "Dénomination": true,
    'Whse fact': true,
    'Objet fact': true,
    "Date active": true,
    "Date inactive": true,
    "Statut": true
  });
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [idTemplate, setidTemplate] = useState('');
  const [modalType, setModalType] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [activeKey, setActiveKey] = useState(['1', '2']);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const role = useSelector((state) => state.user?.currentUser.role);
  const currentUrl = window.location.pathname;

const access = getSubMenuAccessByUrl(currentUrl, datas);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

    const fetchData = async () => {

      try {
        const { data } = await getTemplate(role, userId);
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

  const handleEdit = (idTemplate) => {
    openModal('Edit', idTemplate);
  }

  const handleDetail = (idTemplate) => openModal('Detail', idTemplate)

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idTemplate = '') => {
    closeAllModals();
    setModalType(type);
    setidTemplate(idTemplate);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async (id) => {
    try {
      await deletePutTemplate(id)
      setData(data.filter((item) => item.id_template !== id));
      message.success('Template a été supprimé avec succès');
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

  const columnStyles = {
    title: {
      maxWidth: '220px',
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
      width: "4%",

      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Template',
      dataIndex: 'desc_template',
      key: 'desc_template',
      render: (text) => (
        <Space style={columnStyles.title} className={columnStyles.hideScroll}>
          <Tag icon={<FileTextOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
        </Space>
      ),
      ...(columnsVisibility['Template'] ? {} : { className: 'hidden-column' })
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
      render: (text) => {
        let color;
        let icon;
        switch (text) {
          case 'Dedié':
            color = 'green'; // Couleur pour "Dedié"
            icon = <ApartmentOutlined />; // Icône pour "Dedié"
            break;
          case 'Partagé':
            color = 'orange'; // Couleur pour "Partagé"
            icon = <ShareAltOutlined />; // Icône pour "Partagé"
            break;
          case 'Réservé':
            color = 'red'; // Couleur pour "Réservé"
            icon = <LockOutlined />; // Icône pour "Réservé"
            break;
          default:
            color = 'blue'; // Couleur par défaut
            icon = <ApartmentOutlined />; // Icône par défaut
        }
        return (
          <Tag icon={icon} color={color}>{text ?? 'Aucun'}</Tag>
        );
      },
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
      title: 'Contrat',
      dataIndex: 'conditions',
      key: 'conditions',
      render: (text) => (
        <Tag icon={<FileSyncOutlined />} color="yellow">{text ?? 'Aucune'}</Tag>
      ),
      ...(columnsVisibility['Whse fact'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Whse fact',
      dataIndex: 'nom_whse_fact',
      key: 'nom_whse_fact',
      render: (text) => (
        <Tag icon={<HomeOutlined />} color="geekblue">{text ?? 'Aucune'}</Tag>
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
      title: 'Date inactive', 
      dataIndex: 'date_inactif', 
      key: 'date_inactif',
      sorter: (a, b) => moment(a.date_inactif).unix() - moment(b.date_inactif).unix(),
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color='red'>
          {text ? moment(text).format('DD-MM-yyyy') : 'Aucune'}
        </Tag>
      ),
      ...(columnsVisibility['Date inactive'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Statut',
      dataIndex: 'id_statut_template',
      key: 'id_statut_template',
      render: (text, record) => (
        <StatutColumn initialStatus={text} id={record.id_template} />
      ),
      ...(columnsVisibility['Statut'] ? {} : { className: 'hidden-column' })
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
                disabled={access?.can_edit === 0}
                style={{ color: 'green' }}
                onClick={() => handleEdit(record.id_template)}
                aria-label="Edit tache"
              />
            </Tooltip>
            <Tooltip title="Voir les détails">
            <Button
              icon={<EyeOutlined />}
              disabled={access?.can_read === 0}
              onClick={() => handleDetail(record.id_template)}
              aria-label="détail"
              style={{ color: 'blue' }}
            />
          </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer ce client?"
                onConfirm={() => handleDelete(record.id_template)}
                okText="Oui"
                cancelText="Non"
              >
                <Button
                  icon={<DeleteOutlined />}
                  style={{ color: 'red' }}
                  aria-label="Delete client"
                  disabled={access?.can_delete === 0}
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
    item.nom_objet_fact?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.desc_template?.toLowerCase().includes(searchValue.toLowerCase())
   );
   
  return (
    <>
      <Tabs
        activeKey={activeKey[0]}
        onChange={handleTabChange}
        type="card"
        tabPosition="top"
        renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
      >
        <TabPane
          tab={
            <span>
              <SnippetsOutlined
                style={{
                  color: '#52c41a', // Vert pour les templates
                  fontSize: '18px',
                  marginRight: '8px',
                }}
              />
              Liste des templates
            </span>
          }
          key="1"
        >
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
                { access?.can_comment === 1 && 
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={handleAddTemplate}
                  >
                    Ajouter un template
                  </Button>
                }
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
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="id"
                bordered
                size="small"
                scroll={scroll}
                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
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

      <Modal
        title=""
        visible={modalType === 'Edit'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <TemplateForm closeModal={() => setModalType(null)} fetchData={fetchData} idTemplate={idTemplate} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <TemplateDetail idTemplate={idTemplate} />
      </Modal>
        </TabPane>

      { role === 'Admin' && (
        <TabPane
          tab={
            <span>
              <FileTextOutlined
                style={{
                  color: '#1890ff',
                  fontSize: '18px',
                  marginRight: '8px',
                }}
              />
              Contrat
            </span>
          }
          key="2"
        >
          <Contrat />
        </TabPane>
      )}
      </Tabs>;
    </>
  );
};

export default Template;
