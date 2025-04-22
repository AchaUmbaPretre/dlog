import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Tag } from 'antd';
import { CarOutlined, PlusCircleOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';

const { Search } = Input;


const TrackingGen = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    }); 
    const scroll = { x: 'max-content' };
    const [modalType, setModalType] = useState(null);
    
/*     
       const fetchData = async() => {
            try {
                const { data } = await getModeleAll();
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
        }, []) */
    
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
            {   title: 'Taches accomplie', 
                dataIndex: 'nom_cat_inspection', 
                key: 'nom_cat_inspection', 
                render: (text) => 
                <div> {text}</div>
            },
            {   title: 'Piéce', 
                dataIndex: 'type_rep', 
                key: 'type_rep', 
                render: (text) => (
                    <Tag icon={<ToolOutlined spin />} color='volcano' bordered={false}>
                        {text}
                    </Tag>
                ),
            },
            {   title: 'Budget', 
                dataIndex: 'budget', 
                key: 'budget', 
                render: (text) => <div>{text} $</div> 
            },
            {   title: 'Effectué par', 
                dataIndex: 'nom', 
                key: 'nom', 
                render: (text) => <Tag icon={<UserOutlined />}  color="blue">{text}</Tag> 
            }
        ]

      const handleAddModele = () => openModal('Add')

      const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type, id='') => {
        closeAllModals();
        setModalType(type)
    };

    const filteredData = data.filter(item =>
        item.modele?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase())
      );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <CarOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Liste des modèles</h2>
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
                            onClick={handleAddModele}
                        >
                            Ajouter un modèle
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
    </>
  )
}

export default TrackingGen;