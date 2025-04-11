import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Form, Popover } from 'antd';
import { CarOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getMarque } from '../../services/charroiService';

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
            render: (text, record, index) => index + 1, 
            width: "3%" 
          },
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
        },
        {
            title: 'Modele',
            dataIndex: 'nom_modele',
            render: (text) => (
                <Tag color="green">
                    {text}
                </Tag>
            )
        }        
/*         {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
              <Dropdown overlay={getActionMenu(record, openModal)} trigger={['click']}>
                <Button icon={<MoreOutlined />} style={{ color: 'blue' }} />
              </Dropdown>
            )
          } */
      ];

      const handleAddMarque = () => {

      }

  return (
    <>
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
                    dataSource={data}
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

export default Marque