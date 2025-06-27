import { useEffect, useState } from 'react';
import { Table, Typography, Button, Image, Tabs, Input, message, Dropdown, Menu, Space, Tooltip, Popconfirm, Tag, Modal, notification } from 'antd';
import { FullscreenExitOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, BarcodeOutlined, PlusCircleOutlined, NumberOutlined} from '@ant-design/icons';
import config from '../../../config';
import ParametreSocieteForm from './parametreSocieteForm/ParametreSocieteForm';
import { getSociete } from '../../../services/userService';

const { Search } = Input;
const { Text } = Typography

const ParametreSociete = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 'max-content' };
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [idSociete, setIdSociete] = useState(null)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });

      const columnStyles = {
        title: {
          maxWidth: '220px',
          whiteSpace: 'nowrap',
          overflowX: 'scroll', 
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none', 
        },
        hideScroll: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
  };

    const fetchData = async() => {
        try {
            const { data } = await getSociete();
            setData(data)
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

    const handleAddSociete = (id) => openModal('Add', id);
    const closeAllModals = () => {
        setModalType(null);
    };
    const openModal = (type, idSociete = '') => {
        closeAllModals();
        setModalType(type);
        setIdSociete(idSociete)
    };

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => (
      <Tooltip title={`Ligne ${index + 1}`}>
        <Tag color="geekblue">{index + 1}</Tag>
      </Tooltip>
    ),
    width: "4%"
  },
  {
    title: 'Logo',
    dataIndex: 'logo',
    key: 'logo',
    render: (text, record) => (
      <div className="userList">
        <Image
          src={`${DOMAIN}/${record.logo}`}
          width={40}
          height={40}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
          alt="Logo société"
          preview={false}
        />
      </div>
    ),
    width: "6%"
  },
    {
    title: 'Nom',
    dataIndex: 'nom_societe',
    key: 'nom_societe',
    render: (text) => (
      <Tag style={columnStyles.title} className={columnStyles.hideScroll}>
        {text}
      </Tag>
    )
  },
  {
    title: 'Adresse',
    dataIndex: 'adresse',
    key: 'adresse',
    render: (text) => (
        <div style={columnStyles.title} className={columnStyles.hideScroll}>
            <Tag icon={<EnvironmentOutlined />} color="cyan">
                {text}
            </Tag>
        </div>
    )
  },
  {
    title: 'RCCM',
    dataIndex: 'rccm',
    key: 'rccm',
    render: (text) => (
      <Tag icon={<NumberOutlined />} color="blue">
        {text}
      </Tag>
    )
  },
  {
    title: 'NIF',
    dataIndex: 'nif',
    key: 'nif',
    render: (text) => (
      <Tag icon={<BarcodeOutlined />} color="green">
        {text}
      </Tag>
    )
  },
  {
    title: 'Téléphone',
    dataIndex: 'telephone',
    key: 'telephone',
    render: (text) => (
      <Text type="secondary" style={columnStyles.title} className={columnStyles.hideScroll}>
        <PhoneOutlined style={{ marginRight: 5 }} />
        {text}
      </Text>
    )
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    render: (text) => (
      <Text type="success" style={columnStyles.title} className={columnStyles.hideScroll}>
        {text}
      </Text>
    )
  }
];

  const filteredData = data.filter(item =>
    item.nom_societe?.toLowerCase().includes(searchValue.toLowerCase()) );
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <FullscreenExitOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Liste des sociétés</h2>
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
                            onClick={handleAddSociete}
                        >
                            Ajouter
                        </Button>
                    </div>
                </div>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        onChange={(pagination)=> setPagination(pagination)}
                        rowKey="id_vehicule"
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                        bordered
                        size="small" 
                        scroll={scroll}
                        loading={loading}
                    />
            </div>
        </div>

        <Modal
            title=""
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <ParametreSocieteForm idSociete={idSociete} closeModal={() => setModalType(null)} fetchData={fetchData}/>
        </Modal>
    </>
  )
}

export default ParametreSociete