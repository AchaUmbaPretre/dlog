import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, notification, Tabs } from 'antd';
import { NodeIndexOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getTypeGenerateur } from '../../../../../services/generateurService';
import FormTypeGen from './formTypeGen/FormTypeGen';

const { Search } = Input;

const ListeTypeGen = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    }); 
    const scroll = { x: 'max-content' };
    const [modalType, setModalType] = useState(null);
    const [activeKey, setActiveKey] = useState(['1', '2']);
    
    const handleTabChange = (key) => {
        setActiveKey(key);
    };
    
    const fetchData = async() => {
        try {
            const { data } = await getTypeGenerateur();
            setData(data);
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
        },
        {
            title: 'Nom',
            dataIndex: 'nom_type_gen',
        }
      ];

    const handleAddMarque = () => openModal('Add')

    const closeAllModals = () => {
        setModalType(null);
    };
      
    const openModal = (type, id='') => {
        closeAllModals();
        setModalType(type)
    };

    const filteredData = data.filter(item =>
        item.nom_type_gen?.toLowerCase().includes(searchValue.toLowerCase())
      );
    

  return (
    <>
    <div className="client">
        <div className="client-wrapper">
            <div className="client-row">
                <div className="client-row-icon">
                    <NodeIndexOutlined className='client-icon'/>
                </div>
                <h2 className="client-h2">Liste des types des générateurs</h2>
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
                                    onClick={handleAddMarque}
                                >
                                    Ajouter un type
                                </Button>
                            </div>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="id_marque"
                            loading={loading}
                            scroll={scroll}
                            size="small"
                            onChange={(pagination)=> setPagination(pagination)}
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
            width={700}
            centered
        >
            <FormTypeGen closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </>
  )
}

export default ListeTypeGen;