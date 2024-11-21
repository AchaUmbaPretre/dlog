import React, { useEffect, useState } from 'react'
import { notification, Switch, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUser } from '../../../services/userService';


const PermissionTache = ({idTache}) => {
    const [permissions, setPermissions] = useState({});
    const [user, setUser] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


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
          title: 'Option',
          dataIndex: 'menu_title',
          key: 'menu_title',
          render: (text) => (
            <Tag color='blue'>{text}</Tag>
          ),
        },
        {
          title: <span style={{ color: '#52c41a' }}><EyeOutlined /></span>,
          dataIndex: 'can_read',
          key: 'can_read',
          render: (text, record) => (
            <Switch
              checked={permissions[record.menu_id]?.can_read || false}
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
          title: <span style={{ color: '#ff4d4f' }}><DeleteOutlined /></span>,
          dataIndex: 'can_delete',
          key: 'can_delete',
          render: (text, record) => (
            <Switch
              checked={permissions[record.menu_id]?.can_delete || false}
              onChange={value => handlePermissionChange(record.menu_id, 'can_delete', value)}
            />
          )
        }
      ];

  return (
    <div>PermissionTache</div>
  )
}

export default PermissionTache