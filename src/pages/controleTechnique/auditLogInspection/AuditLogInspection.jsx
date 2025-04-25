import React, { useEffect, useState } from 'react'
import { Table, Button, Skeleton, Dropdown, Input, Menu, Tag, notification } from 'antd';
import { DownOutlined, MenuOutlined, CalendarOutlined, SettingOutlined, CarOutlined, ToolOutlined, FileSearchOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getLogInspection } from '../../../services/charroiService';

const { Search } = Input;

const AuditLogInspection = () => {
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
                const { data } = await getLogInspection();
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


    const columnStyles = {
        title: {
          maxWidth: '220px',
          whiteSpace: 'nowrap',
          overflowX: 'scroll', 
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none', 
        },
        hideScroll: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
    };

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
                    <Tag color="blue" bordered={false}>{text}</Tag>
                </div>
            ),
        },
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
            render: (text) => (
                <Tag icon={<CarOutlined />} color="orange">
                    {text}
                </Tag>
            ),
        },        
        {
            title: 'Type de rep.',
            dataIndex: 'type_rep',
            render: (text) => (
                <Tag icon={<ToolOutlined spin />} style={columnStyles.title} className={columnStyles.hideScroll} color='volcano' bordered={false}>
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text) => (
                <Tag icon={<FileSearchOutlined />} color={text === 'Inspection' ? 'geekblue' : 'green'}>
                    {text}
                </Tag>
                ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: (text) => (
                <div style={columnStyles.title} className={columnStyles.hideScroll}>
                    <Tag icon={<SettingOutlined />} color="purple">
                        {text || 'N/A'}
                    </Tag>
                </div>
            ),
        },
        {
            title: "Date d'action",
            dataIndex: 'created_at',
                render: (text) =>
                    text ? (
                    <Tag icon={<CalendarOutlined />} color="blue">
                        {moment(text).format('DD-MM-YYYY')}
                    </Tag>
            ) : (
                    <Tag color="default">-</Tag>
                ),
        }
        ];


    const filteredData = data.filter(item =>
        item.description?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.type_rep?.toLowerCase().includes(searchValue.toLowerCase()) 
      );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-rows">

                    <div className="client-row">
                        <div className="client-row-icon">
                            <FileSearchOutlined className='client-icon'/>
                        </div>
                        <h2 className="client-h2">Liste des tracking</h2>
                    </div>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Search 
                            placeholder="Recherche..." 
                            onChange={(e) => setSearchValue(e.target.value)}
                            enterButton
                        />
                    </div>
                    {/* <div className="client-rows-right">
                        <Dropdown overlay={menus} trigger={['click']}>
                            <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                                Colonnes <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div> */}
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

export default AuditLogInspection