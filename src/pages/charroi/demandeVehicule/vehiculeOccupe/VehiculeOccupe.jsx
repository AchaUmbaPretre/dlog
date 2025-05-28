import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tabs, Tooltip, Popconfirm, Modal, Typography, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import {  CarOutlined, UserOutlined } from '@ant-design/icons';
import { getAffectationDemande } from '../../../../services/charroiService';

const { Search } = Input;
const { Text } = Typography;


const VehiculeOccupe = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
          current: 1,
          pageSize: 15,
    });

    useEffect(() => {
        const fetchData = async() => {
            const { data } = await getAffectationDemande()
            setData(data)
        }

        fetchData()
    },[]);

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
        <UserOutlined />
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
        <Text strong>Véhicule</Text>
      </Space>
    ),
    dataIndex: 'Vehicule',
    key: 'immatriculation',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
  },
   ]

    const filteredData = data.filter(item =>
     item.nom?.toLowerCase().includes(searchValue.toLowerCase())
    );
  return (
    <>
        <div className="client">
                    <div className="client-wrapper">
                    <div className="client-row">
                        <div className="client-row-icon">
                        <CarOutlined className='client-icon' style={{color:'red'}} />
                        </div>
                        <h2 className="client-h2">Les véhicules occupés</h2>
                    </div>
                    <div className="client-actions">
                        <div className="client-row-left">
                            <Search 
                                placeholder="Recherche..." 
                                enterButton 
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
{/*                         <div className="client-rows-right">
                            <Dropdown overlay={getActionMenu(openModal)} trigger={['click']}>
                                <Button
                                    type="text"
                                    icon={<MoreOutlined />}
                                    style={{
                                    color: '#595959',              
                                    backgroundColor: '#f5f5f5',    
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    }}
                                />
                            </Dropdown>

                            <Dropdown overlay={menu} trigger={['click']}>
                                <Button icon={<ExportOutlined />}>Export</Button>
                            </Dropdown>
                            
                            <Button
                                icon={<PrinterOutlined />}
                                onClick={handlePrint}
                            >
                                Print
                            </Button>
                        </div> */}
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
    </>
  )
}

export default VehiculeOccupe