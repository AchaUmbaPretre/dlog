import { useEffect, useState } from 'react'
import { Table, Modal, Space, Tooltip, Button, Typography, Input, notification } from 'antd';
import {  CarOutlined, PlusCircleOutlined, UserOutlined, ExportOutlined, SwapOutlined, CalendarOutlined } from '@ant-design/icons';
import { getAffectationDemande } from '../../../services/charroiService';
import moment from 'moment';
import AffectationDemandeForm from './affectationDemandeForm/AffectationDemandeForm';

const { Search } = Input;
const { Text } = Typography;

const AffectationDemande = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
          current: 1,
          pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const [affectationId, setAffectationId] = useState('');


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


    const handleAdd = () => openModal('Add')

    const closeAllModals = () => {
      setModalType(null);
    };

    const openModal = (type, affectationId = '') => {
      closeAllModals();
      setModalType(type);
      setAffectationId(affectationId)
    };
        
    const fetchData = async() => {
      try {
        const { data } = await  getAffectationDemande()
        setData(data)
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          escription: 'Une erreur est survenue lors du chargement des données.',
        });
                
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
        width: "4%"
       },
    {
    title: (
      <Space>
        <UserOutlined  style={{color:'orange'}}/>
        <Text strong>Chauffeur</Text>
      </Space>
    ),
    dataIndex: 'nom',
    key: 'nom',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
    },
    {
    title: (
      <Space>
        <CarOutlined style={{ color: 'red' }} />
        <Text strong>Immatriculation</Text>
      </Space>
    ),
    dataIndex: 'immatriculation',
    key: 'immatriculation',
    align: 'center',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
    },
    {
    title: (
      <Space>
        <CarOutlined style={{ color: 'blue' }} />
        <Text strong>Modèle</Text>
      </Space>
    ),
    dataIndex: 'modele',
    key: 'modele',
    align: 'center',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
    },
    {
    title: (
      <Space>
        <CarOutlined style={{ color: '#2db7f5' }} />
        <Text strong>Marque</Text>
      </Space>
    ),
    dataIndex: 'nom_marque',
    key: 'nom_marque',
    align: 'center',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
    },
    {
      title: (
        <Space>
          <CalendarOutlined style={{ color: 'blue' }} />
          <Text strong>Date d'affectation</Text>
        </Space>
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Text>{moment(text).format('DD-MM-yyyy')}</Text>
        </Tooltip>
      ),
    },
    {
      title: (
        <Space>
          <Text strong>Commentaire</Text>
        </Space>
      ),
      dataIndex: 'commentaire',
      key: 'commentaire',
      render: (text) => (
        <div style={columnStyles.title} className={columnStyles.hideScroll}>
          <Tooltip placement="topLeft" title={text}>
            <Text>{text}</Text>
          </Tooltip>
        </div>
      ),
    },
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
                <SwapOutlined className='client-icon' style={{color:'blue'}} />
              </div>
              <h2 className="client-h2"> Liste d'affectations</h2>
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
          visible={modalType === 'Add'}
          onCancel={closeAllModals}
          footer={null}
          width={900}
          centered
        >
          <AffectationDemandeForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </>
  )
}

export default AffectationDemande;