import React, { useState, useEffect } from 'react';
import { Table, Switch, message, Tag, Input, Typography, Divider, Card } from 'antd';
import { EyeOutlined, EditOutlined, UnlockOutlined, DeleteOutlined } from '@ant-design/icons';
import { getMenus, getMenusOne, putPermission } from '../../../services/permissionService';
import './permissionOne.scss'; // Assuming you have a SCSS file for styles

const { Title, Text } = Typography;

const PermissionOne = ({ userId }) => {
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
          getMenus(userId),
        ]);

        setOptions(optionsRes.data);
        setName(permissionsRes.data[0]?.username || '');
        
        const perms = {};
        permissionsRes.data.forEach(p => {
          perms[p.menus_id] = {
            can_read: p.can_read ?? false,
            can_edit: p.can_edit ?? false,
            can_delete: p.can_delete ?? false,
            subMenus: {},
          };
        });
        setPermissions(perms);
      } catch (error) {
        message.error('Échec de la récupération des données');
      } finally {
        setLoading(false);
      }
    };

    fetchOptionsAndPermissions();
  }, [userId]);

  const handlePermissionChange = async (optionId, permType, value) => {
    const updatedPermissions = {
      ...permissions,
      [optionId]: {
        ...permissions[optionId],
        [permType]: value,
      },
    };

    setPermissions(updatedPermissions);

    const finalPermissions = {
      can_read: updatedPermissions[optionId].can_read,
      can_edit: updatedPermissions[optionId].can_edit,
      can_delete: updatedPermissions[optionId].can_delete,
    };

    try {
      await putPermission(userId, optionId, finalPermissions);
      message.success('Autorisations mises à jour avec succès');
    } catch {
      message.error('Échec de la mise à jour des autorisations');
    }
  };

  const handleSubMenuPermissionChange = async (parentId, submenuId, permType, value) => {
    const updatedPermissions = {
      ...permissions,
      [parentId]: {
        ...permissions[parentId],
        subMenus: {
          ...permissions[parentId]?.subMenus,
          [submenuId]: {
            ...permissions[parentId]?.subMenus[submenuId],
            [permType]: value,
          },
        },
      },
    };

    setPermissions(updatedPermissions);

    try {
      await putPermission(userId, submenuId, updatedPermissions[parentId].subMenus[submenuId]);
      message.success('Autorisations de sous-menu mises à jour avec succès');
    } catch {
      message.error('Échec de la mise à jour des autorisations de sous-menu');
    }
  };

  const columns = [
    {
      title: <span>#</span>,
      dataIndex: 'id',
      key: 'id',
      render: (_, __, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Option',
      dataIndex: 'menu_title',
      key: 'menu_title',
      render: text => <Tag color='blue'>{text}</Tag>,
    },
    {
      title: <span style={{ color: '#52c41a' }}><EyeOutlined /></span>,
      dataIndex: 'can_read',
      key: 'can_read',
      render: (_, record) => (
        <Switch
          checked={permissions[record.menu_id]?.can_read || false}
          onChange={value => handlePermissionChange(record.menu_id, 'can_read', value)}
        />
      ),
    },
    {
      title: <span style={{ color: '#1890ff' }}><EditOutlined /></span>,
      dataIndex: 'can_edit',
      key: 'can_edit',
      render: (_, record) => (
        <Switch
          checked={permissions[record.menu_id]?.can_edit || false}
          onChange={value => handlePermissionChange(record.menu_id, 'can_edit', value)}
        />
      ),
    },
    {
      title: <span style={{ color: '#ff4d4f' }}><DeleteOutlined /></span>,
      dataIndex: 'can_delete',
      key: 'can_delete',
      render: (_, record) => (
        <Switch
          checked={permissions[record.menu_id]?.can_delete || false}
          onChange={value => handlePermissionChange(record.menu_id, 'can_delete', value)}
        />
      ),
    },
  ];

  const renderSubMenuTable = (subMenus) => {
    // Only render the table if there are valid submenus
    const validSubMenus = subMenus.filter(submenu => submenu.submenu_id);
    if (validSubMenus.length === 0) {
      return <Text type="secondary">Aucun sous-menu disponible</Text>;
    }

    return (
      <Table
        dataSource={validSubMenus}
        columns={[
          {
            title: 'Sous-menu',
            dataIndex: 'submenu_title',
            key: 'submenu_title',
            render: text => <Tag color='green'>{text}</Tag>,
          },
          {
            title: <span style={{ color: '#52c41a' }}><EyeOutlined /></span>,
            dataIndex: 'can_read',
            key: 'can_read',
            render: (_, record) => (
              <Switch
                checked={permissions[record.parentId]?.subMenus[record.submenu_id]?.can_read || false}
                onChange={value => handleSubMenuPermissionChange(record.parentId, record.submenu_id, 'can_read', value)}
              />
            ),
          },
          {
            title: <span style={{ color: '#1890ff' }}><EditOutlined /></span>,
            dataIndex: 'can_edit',
            key: 'can_edit',
            render: (_, record) => (
              <Switch
                checked={permissions[record.parentId]?.subMenus[record.submenu_id]?.can_edit || false}
                onChange={value => handleSubMenuPermissionChange(record.parentId, record.submenu_id, 'can_edit', value)}
              />
            ),
          },
          {
            title: <span style={{ color: '#ff4d4f' }}><DeleteOutlined /></span>,
            dataIndex: 'can_delete',
            key: 'can_delete',
            render: (_, record) => (
              <Switch
                checked={permissions[record.parentId]?.subMenus[record.submenu_id]?.can_delete || false}
                onChange={value => handleSubMenuPermissionChange(record.parentId, record.submenu_id, 'can_delete', value)}
              />
            ),
          },
        ]}
        rowKey="submenu_id"
        pagination={false}
        bordered
      />
    );
  };

  const filteredData = options.filter(item =>
    item.menu_title?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="permission-container">
      <div className="permission-wrapper">
        <div className="permission-header">
          <UnlockOutlined className='permission-icon' />
          <Title level={2}>Gestion des permissions pour {name}</Title>
        </div>
        <div className="permission-search">
          <Input
            type="search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Recherche..."
            className="product-search"
          />
        </div>
        <Table
          dataSource={loading ? [] : filteredData}
          columns={columns}
          scroll={scroll}
          rowKey="menu_id"
          bordered
          pagination={false}
          loading={loading}
          className='table_permission'
        />
        {options.map(menu => (
          menu.subMenus && menu.subMenus.some(submenu => submenu.submenu_id) && (
            <Card key={menu.menu_id} title={menu.menu_title} style={{ marginTop: 16 }}>
              {renderSubMenuTable(menu.subMenus.map(submenu => ({ ...submenu, parentId: menu.menu_id })))}
            </Card>
          )
        ))}
      </div>
    </div>
  );
};

export default PermissionOne;
