import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, notification } from 'antd';
import { PlusCircleOutlined, CalendarOutlined, SettingOutlined, CarOutlined, ToolOutlined, FileSearchOutlined, UserOutlined } from '@ant-design/icons';
import { getTracking } from '../../../services/charroiService';
import moment from 'moment';

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
    
   
       const fetchData = async() => {
            try {
                const { data } = await getTracking();
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
                width: "4%"
            },    
            {
                title: 'Matricule',
                dataIndex: 'immatriculation',
                render: (text) => (
                    <div className="vehicule-matricule">
                        <span className="car-wrapper">
                            <span className="car-boost" />
                            <CarOutlined className="car-icon-animated" />
                            <span className="car-shadow" />
                        </span>
                        <Tag color="blue">{text}</Tag>
                    </div>
                ),
            }, 
            {
                title: 'Marque',
                dataIndex: 'nom_marque',
                render: (text, record) => (
                    <Tag icon={<CarOutlined />} color="orange">
                        {text}
                    </Tag>
                ),    
            },
            {   title: 'Taches', 
                dataIndex: 'titre', 
                key: 'titre', 
                render: (text) => (
                    <Tag icon={<ToolOutlined spin />} color='volcano' bordered={false}>
                        {text}
                    </Tag>
                )
                
            },
            {   title: 'Piéce', 
                dataIndex: 'nom', 
                key: 'nom', 
                render: (text) => (
                    <Tag icon={<SettingOutlined/>}  bordered={false}>
                        {text}
                    </Tag>
                ),
            },
            {   title: 'Budget', 
                dataIndex: 'budget', 
                key: 'budget', 
                render: (text) => <div>{text} $</div> 
            },
            {   title: 'Statut', 
                dataIndex: 'nom_evaluation', 
                key: 'nom_evaluation', 
                render: (text) => (
                    <Tag bordered={false}>
                        {text}
                    </Tag>
                ),
            },
            {
                title: 'Date',
                dataIndex: 'date_inspection',
                render: (text) => (
                    <Tag icon={<CalendarOutlined />} color="blue">
                        {moment(text).format('DD-MM-YYYY')}
                    </Tag>
                ),
            
            },
            {   title: 'Effectué par', 
                dataIndex: 'username', 
                key: 'username', 
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
        item.titre?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase())
      );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <FileSearchOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Liste des tracking</h2>
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