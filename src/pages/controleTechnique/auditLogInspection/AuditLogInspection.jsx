import React, { useEffect, useRef, useState } from 'react'
import { Table, Input, Space, Tag, notification } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined, CalendarOutlined, SettingOutlined, CarOutlined, ToolOutlined, FileSearchOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getLogInspection } from '../../../services/charroiService';
import getColumnSearchProps from '../../../utils/columnSearchUtils';

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
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

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
            fetchData();

            const intervalId = setInterval(() => {
                fetchData();
              }, 5000); // 5000 ms = 5 secondes
          
              return () => clearInterval(intervalId);
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
            ...getColumnSearchProps(
                'immatriculation',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
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
            ...getColumnSearchProps(
                'nom_marque',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
            render: (text) => (
                <Tag icon={<CarOutlined />} color="orange">
                    {text}
                </Tag>
            ),
        },        
        {
            title: 'Type de rep.',
            dataIndex: 'type_rep',
            ...getColumnSearchProps(
                'type_rep',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
            render: (text) => (
                <Tag icon={<ToolOutlined spin />} style={columnStyles.title} className={columnStyles.hideScroll} color='volcano' bordered={false}>
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Actions', 
            dataIndex: 'action', 
            key: 'action',
            ...getColumnSearchProps(
                'action',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
            render: text => {
              let color;
              let icon;
              switch (text) {
                case 'Création':
                  color = 'green';
                  icon = <PlusCircleOutlined />;
                  break;
                case 'Modification':
                  color = 'orange';
                  icon = <EditOutlined />;
                  break;
                case 'Suppression':
                  color = 'red';
                  icon = <DeleteOutlined />;
                  break;
                default:
                  color = 'purple';
                  icon = <EllipsisOutlined />;
              }
              return (
                <Space>
                  <Tag color={color} icon={icon}>{text}</Tag>
                </Space>
              );
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            ...getColumnSearchProps(
                'description',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
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
            sorter: (a,b) => moment(a.created_at) - (b.created_at),
            sortDirections: ['descend', 'ascend'],
                render: (text) =>
                    text ? (
                    <Tag icon={<CalendarOutlined />} color="blue">
                        {moment(text).format('DD-MM-YYYY')}
                    </Tag>
            ) : (
                    <Tag color="default">-</Tag>
                ),
        },
        {
            title: 'Nom & Prénom', 
            dataIndex: 'nom', 
            key: 'nom',
            ...getColumnSearchProps(
                'nom',
                searchText,
                setSearchText,
                setSearchedColumn,
                searchInput
              ),
            render: (text, record) => (
                <Space>
                    <Tag icon={<UserOutlined />} color="green">
                      {record.nom && record.prenom
                        ? `${record.nom} - ${record.prenom}`
                        : record.nom || record.prenom || 'Aucun'}
                    </Tag>
                </Space>
            ),    
        }, 
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