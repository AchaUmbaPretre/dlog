import { useEffect, useState } from 'react'
import { Table, Tag, Space, Modal, Tooltip, Button, Typography, Input } from 'antd';
import { PlusCircleOutlined, ExportOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getBonSortiePerso } from '../../../services/charroiService';
import { statusIcons } from '../../../utils/prioriteIcons';
import BonSortiePersoForm from './bonSortiePersoForm/BonSortiePersoForm';

const { Search } = Input;
const { Text } = Typography;

const BonSortiePerso = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
          current: 1,
          pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);

    const columnStyles = {
      title: {
        maxWidth: '160px',
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

    const handleAdd = () => openModal('AddBonSortie');

    const closeAllModals = () => {
      setModalType(null);
    };

    const openModal = (type, id = '') => {
      closeAllModals();
      setModalType(type);
    };
        
    const fetchData = async() => {
      try {
        const { data } = await  getBonSortiePerso()
        setData(data)
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, []);

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
          width: "3%"
      },
      {
        title: (
          <Space>
            <UserOutlined  style={{color:'orange'}}/>
            <Text strong>Personnel</Text>
          </Space>
        ),
        dataIndex: 'nom',
        key: 'nom',
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            <Text type="secondary">{text}</Text>
          </Tooltip>
        ),
      },
      {
        title : "Service",
        dataIndex: 'nom_service',
        key:'nom_service',
          render : (text) => (
            <Tag color='purple'>{text}</Tag>
          )
      },
      {
        title : "Client",
        dataIndex: 'nom_client',
        key:'nom_client',
          render : (text) => (
            <Tag color='gold'>{text}</Tag>
          )
      },
      {
        title: (
          <Space>
            <CalendarOutlined style={{ color: 'blue' }} />
            <Text strong>Preuve</Text>
          </Space>
        ),
        dataIndex: 'date_sortie',
        key: 'date_sortie',
        align: 'center',
        render: (text) => {
          if (!text) {
            return (
              <Tag icon={<CalendarOutlined />} color="red">
                Aucune date
              </Tag>
            );
          }
          const date = moment(text);
          const isValid = date.isValid();              
            return (
              <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
              </Tag>
            );
        },
      },
      {
        title: (
          <Space>
            <CalendarOutlined style={{ color: 'blue' }} />
            <Text strong>Retour</Text>
          </Space>
        ),
        dataIndex: 'date_retour',
        key: 'date_retour',
        render: (text) => {
          if (!text) {
              return (
                  <Tag icon={<CalendarOutlined />} color="red">
                      Aucune date
                  </Tag>
              );
          }
          const date = moment(text);
          const isValid = date.isValid();              
              return (
                  <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                      {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
                  </Tag>
              );
          },
      },
      {
        title: (
          <Space>
            <UserOutlined  style={{color:'orange'}}/>
            <Text strong>Destination</Text>
          </Space>
        ),
        dataIndex: 'nom_destination',
        key: 'nom_destination',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            <Text type="secondary">{text}</Text>
          </Tooltip>
        ),
      },
      {
        title: (
          <Space>
            <Text strong>Motif</Text>
          </Space>
        ),
        dataIndex: 'nom_motif_demande',
        key: 'nom_motif_demande',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            <Tag type="secondary">{text}</Tag>
          </Tooltip>
        ),
      },
      {
          title: (
          <Space>
              <CheckCircleOutlined style={{ color: '#1890ff' }} />
              <Text strong>Statut</Text>
          </Space>
          ),
          dataIndex: 'nom_type_statut',
          key: 'nom_type_statut',
          render: text => {
              const { icon, color } = statusIcons[text] || {};
              return (
                <div style={columnStyles.title} className={columnStyles.hideScroll}>
                  <Tag icon={icon} color={color}>{text}</Tag>
                </div>
              );
          },
      },
  /*     {
          title: (
          <Text strong>Actions</Text>
          ),
          key: 'action',
          align: 'center',
          width : '120px',
          render: (text, record) => (
          <Space size="small">

              <Tooltip title="valider">
                  <Button
                      icon={<CheckCircleOutlined />}
                      style={{ color: 'green' }}
                      onClick={() => handlSortie(record.id_bande_sortie)}
                      aria-label="Valider"
                  />
              </Tooltip>
          </Space>
          ),
      }, */
    ]

    const filteredData = data.filter(item =>
     item.nom?.toLowerCase().includes(searchValue.toLowerCase()) || 
     item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
    );
    
  return (
    <>
        <div className="client">
          <div className="client-wrapper">
            <div className="client-row">
              <div className="client-row-icon">
                <ExportOutlined className='client-icon' style={{color:'blue'}} />
              </div>
              <h2 className="client-h2"> Tableau des bons de sortie du personnel</h2>
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
              </div>
              </div>
              <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
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
            visible={modalType === 'AddBonSortie'}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
        >
            <BonSortiePersoForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </>
  )
}

export default BonSortiePerso;