import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, notification, Tabs } from 'antd';
import { CarOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getMarque } from '../../services/charroiService';
import TabPane from 'antd/es/tabs/TabPane';
import MarqueForm from './marqueForm/MarqueForm';
import Modele from '../modeles/Modele';

const { Search } = Input;

const Marque = () => {
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
            const { data } = await getMarque();
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
            title: 'Marque',
            dataIndex: 'nom_marque',
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
        item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase())
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
                    <CarOutlined
                        style={{
                        color: '#1890ff',
                        fontSize: '18px',
                        marginRight: '8px',
                        }}
                    />
                    Liste des marques
                    </span>
                }
                key="1"
            >
                <div className="client">
                    <div className="client-wrapper">
                        <div className="client-row">
                            <div className="client-row-icon">
                                <CarOutlined className='client-icon'/>
                            </div>
                            <h2 className="client-h2">Liste des marques</h2>
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
                                    Ajouter une marque
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
            </TabPane>

            <TabPane
                tab={
                    <span>
                        <CarOutlined
                            style={{
                              color: 'red',
                              fontSize: '18px',
                              marginRight: '8px',
                            }}
                        />
                        Liste des modèles
                    </span>
                }
                key="2"
            >
                <Modele/>
            </TabPane>
        </Tabs>

        <Modal
            title=""
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={700}
            centered
        >
            <MarqueForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </>
  )
}

export default Marque