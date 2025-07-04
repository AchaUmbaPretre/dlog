import { useEffect, useState } from 'react';
import { CalendarOutlined, BarsOutlined,CheckSquareOutlined,SolutionOutlined,RocketOutlined,HourglassOutlined,WarningOutlined,CheckCircleOutlined,ClockCircleOutlined,InfoCircleOutlined, FileTextOutlined, DollarOutlined,PlusCircleOutlined,UserOutlined, PrinterOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Form, Popover } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { statusIcons } from '../../../utils/prioriteIcons';
import { getProjet } from '../../../services/projetService';
import PermissionProjetOne from './permissionProjetOne/PermissionProjetOne';
import { useSelector } from 'react-redux';
moment.locale('fr');

const { Search } = Input;

const PermissionProjet = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const scroll = { x: 400 };
    const [searchValue, setSearchValue] = useState('');
    const [idProjet, setIdProjet] = useState(null);
    const [modalType, setModalType] = useState(null);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const role = useSelector((state) => state.user?.currentUser?.role);


    const fetchData = async () => {
          try {
            const { data } = await getProjet(role, userId);
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
          width: "4%"
        },
        {
          title: 'Client',
          dataIndex: 'nom',
          key: 'nom',
          render: (text) => (
            <Tag icon={<UserOutlined />} color="green">{text ?? 'Aucun'}</Tag>
          ),
        },
        { 
          title: 'Titre', 
          dataIndex: 'nom_projet', 
          key: 'nom_projet',
          render: (text, record) => (
            <Space style={columnStyles.title} className={columnStyles.hideScroll}>
              <Tag onClick={() => handleViewDetails(record.id_projet)} icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
            </Space>
          ),
        },
        { 
          title: 'Chef projet ',
          dataIndex: 'responsable', 
          key: 'responsable',
          render: text => (
            <Tag icon={<UserOutlined />} color='purple'>{text}</Tag>
          ),
        },
        { 
          title: 'Statut', 
          dataIndex: 'nom_type_statut', 
          key: 'nom_type_statut',
          render: text => {
            const { icon, color } = statusIcons[text] || {};
            return (
              <Space>
                <Tag icon={icon} color={color}>{text}</Tag>
              </Space>
            );
          }
        },
        { 
          title: 'Budget', 
          dataIndex: 'montant', 
          key: 'montant',
          render: text => (
            <Space>
              <Tag icon={<DollarOutlined />}  color='purple'>
                {text} $
              </Tag>
            </Space>
          ),
        },
        {
          title: 'Date création',
          dataIndex: 'date_creation',
          key: 'date_creation',
            sorter: (a, b) => moment(a.date_creation) - moment(b.date_creation),
            sortDirections: ['descend', 'ascend'],
            render: (text,record) => 
              <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-yyyy')}
              </Tag>,
        
        },
        {
          title: 'Action',
          key: 'action',
          width: '8%',
          align: 'center',
          render: (text, record) => (
              <Space>
                <Tooltip title="Voir détails">
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record.id_projet)}
                    aria-label="View budget details"
                    style={{ color: 'blue' }}
                    type='text'
                />
                </Tooltip>
              </Space>
            
          ),
        },
    ];

    const  handleViewDetails = (idProjet) => {
        openModal('detail', idProjet);
    };

    const closeAllModals = () => {
        setModalType(null);
    };
    
    const openModal = (type, idProjet = '') => {
        closeAllModals();
        setModalType(type);
        setIdProjet(idProjet);
    }; 

    const filteredData = data.filter(item =>
        item.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.nom_projet?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.nom_type_statut?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.responsable?.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
            <div className="client-row">
                <div className="client-row-icon">
                <BarsOutlined className='client-icon'/>
                </div>
                <h2 className="client-h2">Projet</h2>
            </div>
            <div className="client-actions">
                <div className="client-row-left">
                <Search 
                    placeholder="Recherche..." 
                    onChange={(e) => setSearchValue(e.target.value)}
                    enterButton
                />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id_projet"
                loading={loading}
                scroll={scroll}
                size="small"
                bordered
                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            />
            </div>
        </div>
        <Modal
            title=""
            visible={modalType === 'detail'}
            onCancel={closeAllModals}
            footer={null}
            width={1070}
            centered
        >
            <PermissionProjetOne idProjet={idProjet}/>
        </Modal>
    </>
  )
}

export default PermissionProjet