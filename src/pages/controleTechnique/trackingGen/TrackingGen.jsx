import React, { useState, useEffect } from 'react';
import { Table, Input, Menu, Tag, notification } from 'antd';
import { CheckCircleOutlined, CalendarOutlined, CarOutlined, FileSearchOutlined } from '@ant-design/icons';
import { getHistorique} from '../../../services/charroiService';
import moment from 'moment';
import { useSelector } from 'react-redux';

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
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Matricule': true,
        'Marque': true,
        'Montant inspection': true,
        'Montant réparation': false,
        'Description': false,
        'Commentaire' : false
    })

    const toggleColumnVisibility = (columnName, e) => {
        e.stopPropagation();
        setColumnsVisibility(prev => ({
          ...prev,
          [columnName]: !prev[columnName]
        }));
      };

    const fetchData = async() => {
            try {
                const { data } = await getHistorique();
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
              }, 5000);
          
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
              width: '4%',
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
              title: 'Etat',
              dataIndex: 'nom_statut_vehicule',
              render: (text) => (
                <Tag color={text === 'Immobile' ? 'red' : 'green'}>
                  {text}
                </Tag>
              ),
            },
            {
              title: 'Action',
              dataIndex: 'action',
              render: (text) => (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  {text}
                </Tag>
              ),
            },
            {
              title: 'Date action',
              dataIndex: 'date_action',
              render: (text) =>
                text ? (
                  <Tag icon={<CalendarOutlined />} color="blue">
                    {moment(text).format('DD-MM-YYYY HH:mm')}
                  </Tag>
                ) : (
                  <Tag color="default">-</Tag>
                ),
            },
            {
              title: 'Commentaire',
              dataIndex: 'commentaire',
              render: (text) => <span>{text || '-'}</span>,
            },
          ];
        

    const filteredData = data.filter(item =>
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