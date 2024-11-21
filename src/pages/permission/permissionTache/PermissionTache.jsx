import React, { useEffect, useState } from 'react'
import { Input, notification, Switch, Tag, Table } from 'antd';
import { EyeOutlined, EditOutlined, FormOutlined, UnlockOutlined } from '@ant-design/icons';
import { getUser } from '../../../services/userService';

const PermissionTache = ({idTache}) => {
    const [permissions, setPermissions] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const scroll = { x: 400 };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await getUser();
            setData(data);
            setLoading(false);
          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données.',
            });
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);

      const handlePermissionChange = () => {

      }

    const columns = [
        { 
          title: <span>#</span>, 
          dataIndex: 'id', 
          key: 'id', 
          render: (text, record, index) => index + 1, 
          width: "3%" 
        },
        {
          title: 'Utilisateur',
          dataIndex: 'menu_title',
          key: 'menu_title',
          render: (text, record) => (
            <Tag color='blue'>{`${record.nom} - ${record.prenom}`}</Tag>
          ),
        },
        {
          title: <span style={{ color: '#52c41a' }}><EyeOutlined /></span>,
          dataIndex: 'can_read',
          key: 'can_read',
          render: (text, record) => (
            <Switch
              checked={permissions[record.id]?.can_view || false}
              onChange={value => handlePermissionChange(record.menu_id, 'can_read', value)}
            />
          )
        },
        {
          title: <span style={{ color: '#1890ff' }}><EditOutlined /></span>,
          dataIndex: 'can_edit',
          key: 'can_edit',
          render: (text, record) => (
            <Switch
              checked={permissions[record.menu_id]?.can_edit || false}
              onChange={value => handlePermissionChange(record.menu_id, 'can_edit', value)}
            />
          )
        },
        {
          title: <span style={{ color: '#ff4d4f' }}><FormOutlined /></span>,
          dataIndex: 'can_delete',
          key: 'can_delete',
          render: (text, record) => (
            <Switch
              checked={permissions[record.id]?.can_comment || false}
              onChange={value => handlePermissionChange(record.menu_id, 'can_delete', value)}
            />
          )
        }
      ];

      const filteredData = data.filter(item =>
        item.nom?.toLowerCase().includes(searchValue.toLowerCase())
      );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <UnlockOutlined className='client-icon' />
                    </div>
                    <h2 className="client-h2">Gestion des permissions de tache</h2>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Input
                            type="search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Recherche..."
                            className="product-search"
                        />    
                    </div>
                </div>
                    <Table
                      dataSource={loading ? [] : filteredData}
                      columns={columns}
                      scroll={scroll}
                      rowKey="id"
                      bordered
                      pagination={false}
                      loading={loading}
                      className='table_permission' 
                    />
            </div>
        </div>
    </>
  )
}

export default PermissionTache