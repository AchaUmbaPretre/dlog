import React, { useEffect, useState } from 'react';
import { Table, Input, notification, Space,Tag } from 'antd';
import {   PlusCircleOutlined, AuditOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined, ApartmentOutlined, UserOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { getAuditLog } from '../../../services/tacheService';
import moment from 'moment';

const { Search } = Input;

const AuditLogTache = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const scroll = { x: 400 };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

    const fetchData = async () => {
      try {
         const { data } = await getAuditLog();
        setData(data);
        setLoading(false); 
      } 
      catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);
  

  const columnStyles = {
    title: {
      maxWidth: '250px',
      whiteSpace: 'nowrap',
      overflowX: 'scroll', 
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
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
      width: "4%",
    },
    { 
      title: 'DPT', 
      dataIndex: 'nom_departement', 
      key: 'nom_departement',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    {   
      title: 'Titre',
      dataIndex: 'nom_tache', 
      key: 'nom_tache', 
      render: (text, record) => (
        <Space style={columnStyles.title} className={columnStyles.hideScroll} >
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    {   
      title: 'Nom & Prenom', 
      dataIndex: 'nom', 
      key: 'nom',
      render: (text, record) => (
        <Space>
          <Tag icon={<UserOutlined />} color='green'>{ `${record.nom} - ${record.prenom}` ?? 'Aucun'}</Tag>
        </Space>
      ),    
    },
    {
      title: "Date d'actions",
      dataIndex: 'timestamp',
      key: 'timestamp',
      sorter: (a, b) => moment(a.timestamp) - moment(b.timestamp),
      sortDirections: ['descend', 'ascend'],
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy HH:mm')}
        </Tag>
      ),
    },
    {
      title: 'Actions', 
      dataIndex: 'action', 
      key: 'action',
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
  ];
  

  const filteredData = data.filter(item =>
    item.nom_tache?.toLowerCase().includes(searchValue.toLowerCase())  );


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <AuditOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des audit logs tache</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
                <Search 
                  placeholder="Recherche..." 
                  enterButton 
                  onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div className="client-rows-right">
            </div>
          </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="id"
                bordered
                size="middle"
                scroll={scroll}
            />
        </div>
      </div>
    </>
  );
};

export default AuditLogTache;
