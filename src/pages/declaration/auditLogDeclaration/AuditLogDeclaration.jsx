import React, { useEffect, useState } from 'react';
import { Table, Input, notification, Space,Tag } from 'antd';
import {   PlusCircleOutlined, AuditOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined, UserOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getAudit_logs_declaration } from '../../../services/templateService';

const { Search } = Input;

const AuditLogDeclaration = () => {
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
         const { data } = await getAudit_logs_declaration();
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
      title: 'Titre',
      dataIndex: 'desc_template', 
      key: 'desc_template', 
      render: (text, record) => (
        <Space style={columnStyles.title} className={columnStyles.hideScroll} >
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    {
        title: 'Nom & Prénom', 
        dataIndex: 'nom', 
        key: 'nom',
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
    {
              title: 'Periode',
              dataIndex: 'timestamp',
              key: 'timestamp',
              sorter: (a, b) => moment(a.timestamp) - moment(b.timestamp),
              sortDirections: ['descend', 'ascend'],
              render: (text, record) => {
                const date = text ? new Date(text) : null;
                const mois = date ? date.getMonth() + 1 : null; // getMonth() renvoie 0-11, donc +1 pour avoir 1-12
                const annee = date ? date.getFullYear() : null;
                
                const formattedDate = date
                  ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
                  : 'Aucun';
            
                return (
                  <Tag 
                    icon={<CalendarOutlined />} 
                    color="purple" 
                  >
                    {formattedDate}
                  </Tag>
                );
              },
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
    }
  ];
  
  const filteredData = data.filter(item =>
    item.desc_template?.toLowerCase().includes(searchValue.toLowerCase())  );


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <AuditOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des audit logs déclaration</h2>
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

export default AuditLogDeclaration;
