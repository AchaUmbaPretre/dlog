import { useEffect, useState } from 'react'
import { Input, Button, notification, Table, Tooltip, Modal } from 'antd';
import { SwapOutlined, CalendarOutlined, PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import AffectationsForm from './affectationsForm/AffectationsForm';
import { getAffectation } from '../../../services/charroiService';

const { Search } = Input;

const Affectations = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 400 };
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    
    const fetchData = async() => {
        try {
            const { data } = await getAffectation();
            setData(data.data);
            setLoading(false);

        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
              });
              setLoading(false);
        }
    }

    useEffect(()=> {
        fetchData()
    }, [])

    const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
      };

    const columns = [
        { 
          title: '#', 
          dataIndex: 'id', 
          key: 'id', 
          render: (text, record, index) => (
            <span style={{ fontWeight: 'bold' }}>{index + 1}</span>
          ),
          width: "5%", 
        },
        {
          title: 'Chauffeur',
          dataIndex: 'nom_chauffeur',
          render: (text, record) => (
            <div>
              <span style={{ color: '#1890ff' }}>{`${record.prenom}`}</span> - <span style={{ fontWeight: 'bold' }}>{record.nom}</span>
            </div>
          ),
        },
        {
          title: 'Nom site',
          dataIndex: 'nom_site',
          render: (text) => (
            <div>
              <span style={{ color: '#52c41a', fontStyle: 'italic' }}>{text}</span>
            </div>
          ),
        },
        {
          title: 'Description',
          dataIndex: 'commentaire',
          render: (text) => (
            <div>
              <span style={{ fontStyle: 'italic' }}>{text}</span>
            </div>
          ),
        },
        {
          title: "Date d'affectation",
          dataIndex: 'created_at',
          render: (text) => (
            <Tooltip title="Date d'affectation">
              <div>
                <CalendarOutlined style={{ color: '#fa8c16', marginRight: 8 }} /> 
                <span>{moment(text).format('DD-MM-yyyy')}</span>
              </div>
            </Tooltip>
          ),
        },
        {
          title: 'Créé par',
          dataIndex: 'affectation',
          render: (text, record) => (
            <div>
              <span style={{ color: '#722ed1' }}>{record.user}</span>
            </div>
          ),
        }
      ];

    const handleAddAffectation = () => openModal('Add')

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <SwapOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Affectation</h2>
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
                            onClick={handleAddAffectation}
                        >
                            Ajouter une affectation
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
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
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <AffectationsForm closeModal={() => setModalType(null)} fetchData={fetchData} />
      </Modal>
    </>
  )
}

export default Affectations