import React, { useState, useEffect } from 'react';
import { Table, Switch, message, Tag, Input } from 'antd';
import { EyeOutlined, EditOutlined,UnlockOutlined, DeleteOutlined } from '@ant-design/icons';
import { getMenus, getMenusOne, putPermission } from '../../../services/permissionService';

const PermissionOne = ({userId}) => {
  const [options, setOptions] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const scroll = { x: 400 };

  useEffect(() => {
    const fetchOptionsAndPermissions = async () => {
      setLoading(true);
      try {
        const [optionsRes, permissionsRes] = await Promise.all([
          getMenusOne(),
          getMenus(userId)
        ]);

        setOptions(optionsRes.data);
        setName(permissionsRes.data[0]?.username || '');
        setLoading(false);

        const perms = {};
        permissionsRes.data.forEach(p => {
          perms[p.menus_id] = {
            can_read: p.can_read,
            can_edit: p.can_edit,
            can_delete: p.can_delete
          };
        });
        setPermissions(perms);
      } catch (error) {
        message.error('Échec de la récupération des données');
        setLoading(false);
      }
    };

    fetchOptionsAndPermissions();
  }, [userId]);

  const handlePermissionChange = (optionId, permType, value) => {
    const updatedPermissions = {
      ...permissions,
      [optionId]: {
        ...permissions[optionId],
        [permType]: value
      }
    };
  
    const finalPermissions = {
      ...updatedPermissions[optionId],
      can_read: updatedPermissions[optionId].can_read ?? false,
      can_edit: updatedPermissions[optionId].can_edit ?? false,
      can_delete: updatedPermissions[optionId].can_delete ?? false,
    };
  
    setPermissions(updatedPermissions);
  
        putPermission(userId, optionId, finalPermissions )
      .then(() => {
        message.success('Autorisations mises à jour avec succès');
      })
      .catch(() => {
        message.error('Échec de la mise à jour des autorisations');
      });
  };
  

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
  
  const filteredData = options.filter(item =>
    item.menu_title?.toLowerCase().includes(searchValue.toLowerCase())
  );


  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <UnlockOutlined className='client-icon' />
                    </div>
                    <h2 className="client-h2">Gestion des permissions</h2>
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
                        pagination={false}
                        loading={loading}
                        className='table_permission' 
                    />
            </div>
        </div>
{/*         <div className="products">
            <div className="product-container">
                <div className="product-container-top">
                    <div className="product-left">
                        <h2 className="product-h2">Gestion des permissions pour l'utilisateur {name}</h2>
                        <span>Bienvenue dans la gestion des permissions. Cette page vous permet de définir les autorisations spécifiques pour chaque utilisateur.</span>
                    </div>
                </div>
                <div className="product-bottom">
                    <div className="product-bottom-top">
                        <div className="product-bottom-left">
                        <SisternodeOutlined className='product-icon' />
                        <Input
                            type="search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Recherche..."
                            className="product-search"
                        />    
                        </div>
                        <div className="product-bottom-right">
                        </div>
                    </div>
                    <div className="rowChart-row-table">
                        <Table
                            dataSource={loading ? [] : options}
                            columns={columns}
                            scroll={scroll}
                            rowKey="id"
                            pagination={false}
                            loading={loading}
                            className='table_permission' 
                        />
                    </div>
                </div>
            </div>
        </div> */}
    </>
  );
};

export default PermissionOne;
