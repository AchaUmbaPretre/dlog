import React, { useState, useEffect } from 'react';
import { Table, Button, Skeleton, Input, Tag, notification } from 'antd';
import { DollarOutlined, CalendarOutlined, SettingOutlined, CarOutlined, ToolOutlined, FileSearchOutlined, UserOutlined } from '@ant-design/icons';
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
    const role = useSelector((state) => state.user?.currentUser?.role);

   
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
              render: (text) => (
                <Tag icon={<CarOutlined />} color="orange">
                  {text}
                </Tag>
              ),
            },
            {
              title: 'Origine',
              dataIndex: 'origine',
              render: (text) => (
                <Tag icon={<FileSearchOutlined />} color={text === 'Inspection' ? 'geekblue' : 'green'}>
                  {text}
                </Tag>
              ),
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
            },
            {
              title: 'Description',
              dataIndex: 'description',
              render: (text) => (
                <Tag icon={<SettingOutlined />} color="purple">
                  {text || 'N/A'}
                </Tag>
              ),
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
            },
            {
              title: 'Avis',
              dataIndex: 'avis',
              render: (text) =>
                text ? (
                  <Tag color="magenta">
                    {text}
                  </Tag>
                ) : (
                  <Tag color="default">-</Tag>
                ),
            },
            {
              title: 'Commentaire',
              dataIndex: 'commentaire',
              render: (text) => <span>{text || '-'}</span>
            }
          ];
          

      const handleAddModele = () => openModal('Add')

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