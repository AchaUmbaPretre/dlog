import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, notification } from 'antd';
import { ToolOutlined, PlusCircleOutlined } from '@ant-design/icons';
import TypeReparationForm from './typeReparationForm/TypeReparationForm';
import { getTypeReparation } from '../../services/charroiService'

const { Search } = Input;


const TypeReparation = () => {
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
                const { data } = await getTypeReparation();
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
    
    const columns = [
        { 
            title: '#', 
            dataIndex: 'id', 
            key: 'id', 
            render: (text, record, index) => index + 1, 
            width: "3%" 
          },
        {
            title: 'Nom',
            dataIndex: 'type_rep',
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

    const filteredData = data?.filter(item =>
        item.type_rep?.toLowerCase().includes(searchValue.toLowerCase())
      );
    

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                    <ToolOutlined className='client-icon'/>
                </div>
                <h2 className="client-h2">Liste des type des réparations</h2>
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

            <Modal
                title=""
                visible={modalType === 'Add'}
                onCancel={closeAllModals}
                footer={null}
                width={700}
                centered
            >
                <TypeReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
            </Modal>
    </>
  )
}

export default TypeReparation