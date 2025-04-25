import React, { useState, useEffect } from 'react';
import { Table, Button, Skeleton, Dropdown, Input, Menu, Tag, notification } from 'antd';
import { DollarOutlined, DownOutlined, MenuOutlined, CalendarOutlined, SettingOutlined, CarOutlined, ToolOutlined, FileSearchOutlined, UserOutlined } from '@ant-design/icons';
import { getTracking } from '../../../services/charroiService';
import moment from 'moment';
import { useSelector } from 'react-redux';

const { Search } = Input;

const TrackingGen = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [statistique, setStatistique] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    }); 
    const scroll = { x: 'max-content' };
    const [modalType, setModalType] = useState(null);
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Matricule': true,
        'Marque': true,
        'Type rep': true,
        'Origine': true,
        'Montant inspection': true,
        'Montant réparation': false,
        'Description': false,
        'Date inspection' : true,
        'Date entree reparation' : true,
        'Avis' : false,
        'Commentaire' : false
    })
    const role = useSelector((state) => state.user?.currentUser?.role);

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

    const menus = (
        <Menu>
          {Object.keys(columnsVisibility).map(columnName => (
            <Menu.Item key={columnName}>
              <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
                <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
                <span style={{ marginLeft: 8 }}>{columnName}</span>
              </span>
            </Menu.Item>
          ))}
        </Menu>
    );

    const toggleColumnVisibility = (columnName, e) => {
        e.stopPropagation();
        setColumnsVisibility(prev => ({
          ...prev,
          [columnName]: !prev[columnName]
        }));
      };

    const fetchData = async() => {
            try {
                const { data } = await getTracking();
                setData(data?.data);
                setStatistique(data?.totalByOrigine)
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
              ...(columnsVisibility['Matricule'] ? {} : { className: 'hidden-column' }),
        },
        {
              title: 'Marque',
              dataIndex: 'nom_marque',
              render: (text) => (
                <Tag icon={<CarOutlined />} color="orange">
                  {text}
                </Tag>
              ),
              ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' }),
        },        
        {
            title: 'Type de rep.',
            dataIndex: 'type_rep',
            render: (text) => (
                    <Tag icon={<ToolOutlined spin />} style={columnStyles.title} className={columnStyles.hideScroll} color='volcano' bordered={false}>
                        {text}
                    </Tag>
                ),
            ...(columnsVisibility['Type rep'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'Origine',
            dataIndex: 'origine',
            render: (text) => (
                  <Tag icon={<FileSearchOutlined />} color={text === 'Inspection' ? 'geekblue' : 'green'}>
                    {text}
                  </Tag>
            ),
            ...(columnsVisibility['Origine'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'Montant inspection',
            dataIndex: 'montant_inspection',
            render: (text) =>
                text ? (
                  <Tag color="cyan">
                    {text} $
                  </Tag>
                ) : (
                  <Tag color="default">-</Tag>
                ),
            ...(columnsVisibility['Montant inspection'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'Montant réparation',
            dataIndex: 'montant_reparation',
            render: (text) =>
            text ? (
                <Tag color="blue">
                    {text} $
                  </Tag>
                ) : (
                  <Tag color="default">-</Tag>
                ),
            ...(columnsVisibility['Montant réparation'] ? {} : { className: 'hidden-column' }),
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
              ...(columnsVisibility['Description'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'Date inspection',
            dataIndex: 'date_inspection',
              render: (text) =>
                text ? (
                  <Tag icon={<CalendarOutlined />} color="blue">
                    {moment(text).format('DD-MM-YYYY')}
                  </Tag>
                ) : (
                  <Tag color="default">-</Tag>
                ),
                ...(columnsVisibility['Date inspection'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'Date entrée réparation',
            dataIndex: 'date_entree_reparation',
              render: (text) =>
                text ? (
                  <Tag icon={<CalendarOutlined />} color="green">
                    {moment(text).format('DD-MM-YYYY')}
                  </Tag>
                ) : (
                  <Tag color="default">-</Tag>
                ),
                ...(columnsVisibility['Date entree reparation'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'Avis',
            dataIndex: 'avis',
              render: (text) =>
                text ? (
                <div style={columnStyles.title} className={columnStyles.hideScroll}>
                    {text}
                </div>
                ) : (
                  <Tag color="default">-</Tag>
                ),
                ...(columnsVisibility['Avis'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'Commentaire',
            dataIndex: 'commentaire',
              render: (text) => <span>{text || '-'}</span>,
              ...(columnsVisibility['Commentaire'] ? {} : { className: 'hidden-column' }),
        }
    ];
          
      const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type, id='') => {
        closeAllModals();
        setModalType(type)
    };

    const filteredData = data.filter(item =>
        item.avis?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.commentaire?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase())
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

                    {
                        role === 'Admin' &&
                    <div className='client-row-lefts'>
                        <span className='client-title'>
                        Resumé :
                        </span>
                        <div className="client-row-sou">
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 1 }} />
                        ) : (
                            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px'}}>
                            {
                                statistique.map((d) => (
                                <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                                {d.origine} : <strong>
                                    {Number.isFinite(parseFloat(d.total))
                                    ? Math.round(parseFloat(d.total)).toLocaleString()
                                    : 0}</strong>
                                </span>
                                ))
                            }
                            </div>
                        )}
                        </div>
                    </div>
                    }
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
                        <Dropdown overlay={menus} trigger={['click']}>
                            <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                                Colonnes <DownOutlined />
                            </Button>
                        </Dropdown>
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