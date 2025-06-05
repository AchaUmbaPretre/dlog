import { useEffect, useState } from 'react';
import { Table, Button, Space, Badge, Tooltip, Popconfirm, Modal, Typography, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined, TruckOutlined, DeleteOutlined, MenuOutlined, DownOutlined, EyeOutlined, MoreOutlined, CalendarOutlined, PlusCircleOutlined, FieldTimeOutlined, AimOutlined, ClockCircleOutlined, PrinterOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Text } = Typography;

const Expedition = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [trajetId, setTrajetId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 'max-content' };
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
  });
const [columnsVisibility, setColumnsVisibility] = useState({
  id: true,
  depart: true,
  date_depart: true,
  date_arrivee: true,
  distance_km: true,
  duree: false,
  prix: false,
  nom: false,
  nom_mode: true
});

  
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

  const fetchData = async () => {
      try {

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

    const handleDelete = (id) => {
       
    }
  
    const handleEdit = (id) => openModal('Add', id);
    const handleAdd = () => openModal('Add');

    const getActionMenu = (record, openModal) => {
      const handleClick = ({ key }) => {

        switch (key) {
          case 'voirDetail':
            openModal('Detail', record.id_trajet)
            break;
          case 'edit':
            openModal('editTrajet', record.id_trajet)
            break;
          default:
            break;
        }
      };
      return (
        <Menu onClick={handleClick}>
          <Menu.Item key="voirDetail">
{/*             <EyeOutlined style={{ color: '#2db7f5' }} /> Détail
 */}          </Menu.Item>
          <Menu.Divider />
        </Menu>
      )
    };

    const closeAllModals = () => {
      setModalType(null);
    };

    const openModal = (type, trajetId = '') => {
      closeAllModals();
      setModalType(type);
      setTrajetId(trajetId)
    };

    const handleExportExcel = () => {
      message.success('Exporting to Excel...');
    };

    const handleExportPDF = () => {
      message.success('Exporting to PDF...');
    };

    const toggleColumnVisibility = (key) => {
      setColumnsVisibility((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    const handlePrint = () => {
      window.print();
    };

      const menus = (
        <Menu>
          {Object.keys(columnsVisibility).map((colKey) => (
            <Menu.Item key={colKey}>
              <span onClick={() => toggleColumnVisibility(colKey)}>
                <input type="checkbox" checked={columnsVisibility[colKey]} readOnly />
                <span style={{ marginLeft: 8 }}>{colKey}</span>
              </span>
            </Menu.Item>
          ))}
        </Menu>

      );  
      
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
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "5%",
    },
    {
      title: (
        <Space>
          📍
          <Text strong>Départ</Text>
        </Space>
      ),
      dataIndex: 'depart',
      key: 'depart',
      ellipsis: true,
      render: (text, record) => (
    <div
      style={columnStyles.title}
      className={columnStyles.hideScroll}
    >
      <Tooltip title={text}>
        <Tag color="blue">{record.depart}</Tag>
      </Tooltip>
    </div>
    ),
    },
     {
      title: (
        <Space>
          📍
          <Text strong>Destination</Text>
        </Space>
      ),
      dataIndex: 'destination',
      key: 'destination',
      ellipsis: true,
      render: (text, record) => (
    <div
      style={columnStyles.title}
      className={columnStyles.hideScroll}
    >
      <Tooltip title={text}>
        <Tag color="green">{record.depart}</Tag>
      </Tooltip>
    </div>
    ),
    },
    {
      title: (
        <Space>
          <AimOutlined style={{ color: '#faad14' }} />
          <Text strong>km</Text>
        </Space>
      ),
      dataIndex: 'distance_km',
      key: 'distance_km',
      align: 'center',
      render: (text) => <Badge count={ text ? `${text} km` : '0 km'} style={{ backgroundColor: '#faad14' }} />,
    },
    {
      title: <Text strong>Actions</Text>,
      key: 'action',
      width: '130px',
      align: 'center',
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="Modifier ce trajet">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id_trajet)}
              style={{ color: '#1890ff' }}
              aria-label="Modifier"
            />
          </Tooltip>
          <Dropdown overlay={getActionMenu(record, openModal)} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} style={{ color: 'blue' }} />
          </Dropdown>
          <Tooltip title="Supprimer définitivement">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce trajet ?"
              onConfirm={() => handleDelete(record.id_trajet)}
              okText="Oui"
              cancelText="Non"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label="Supprimer"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
    ];

    const filteredData = data.filter(item =>
      item.depart?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.destination?.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TruckOutlined className='client-icon' style={{color:'blue'}} />
            </div>
            <h2 className="client-h2">Liste d'expeditions</h2>
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
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={handleAdd}
                >
                    Ajouter
                </Button>

                <Dropdown overlay={menus} trigger={['click']}>
                  <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                    Colonnes <DownOutlined />
                  </Button>
                </Dropdown>

                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<ExportOutlined />}>Export</Button>
                </Dropdown>
                
            </div>
          </div>
          <Table
            dataSource={filteredData}
            loading={loading}
            columns={columns.filter(col => {
              return columnsVisibility[col.key] !== false;
            })}
            onChange={(pagination) => setPagination(pagination)}
            rowKey="id_trajet"
            bordered
            size="small"
            scroll={scroll}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        </div>
      </div>

{/*       <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <TrajetForm closeModal={() => setModalType(null)} fetchDatas={fetchData} trajetId={trajetId} />
      </Modal> */}
    </>
  );
};

export default Expedition;