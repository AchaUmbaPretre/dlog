import React, { useEffect, useState } from 'react'
import { getUser } from '../../../../services/userService';
import {  UnlockOutlined } from '@ant-design/icons';
import { Switch, Table, Tag } from 'antd';

const PermissionVilleOne = ({idVille}) => {
    const scroll = { x: 400 };
    const [data, setData] = useState([]);
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const { data: users } = await getUser();
                setData(users);
                
            } catch (error) {
                console.log(error)
            }
        }
        fetchPermission()
    }, []);

    const columns = [
        {
            title: <span>#</span>,
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1,
            width: '3%',
        },
        {
            title: 'Utilisateur',
            dataIndex: 'menu_title',
            key: 'menu_title',
            render: (text, record) => (
                <Tag color="blue">{`${record.nom} - ${record.prenom}`}</Tag>
            ),
        },
        {
            title: <span style={{ color: '#52c41a' }}></span>,
            dataIndex: 'can_view',
            key: 'can_view',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_utilisateur]}
                    onChange={handlePermissionChange(record.id_utilisateur)}
                />
            ),
        },
    ];

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
 {/*                    <div className="client-row-left">
                        <Input.Search
                            type="search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Recherche..."
                            className="product-search"
                            enterButton
                        />    
                    </div> */}
                </div>
                    <Table
                      dataSource={data}
                      columns={columns}
                      scroll={scroll}
                      rowKey="id"
                      bordered
                      pagination={false}
                      className='table_permission' 
                    />
            </div>
        </div>
    </>
  )
}

export default PermissionVilleOne