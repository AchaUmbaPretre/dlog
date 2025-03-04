import React, { useEffect, useState } from 'react'
import { Input, notification, Switch, Table } from 'antd';
import { EyeOutlined, DeleteOutlined, FileTextOutlined, PlusCircleOutlined, EditOutlined, UnlockOutlined } from '@ant-design/icons';
import { getPermissionsDeclaration, updatePermissionDeclaration } from '../../../../services/permissionService';
import { getDeclarationVille } from '../../../../services/templateService';
import { getUserOne } from '../../../../services/userService';

const PermissionDeclarationOne = ({idVille, idUser}) => {
    const [permissions, setPermissions] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [title, setTitle] = useState('');
    const scroll = { x: 400 };

        useEffect(()=> {
            const fetchData = async() => {
                const res = await getUserOne(idUser)
                setTitle(res?.data[0].nom)
            }
    
            fetchData();
        }, [idUser])

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const { data } = await getDeclarationVille(idVille);
                
                setData(data);
    
                const permissionsData = await getPermissionsDeclaration(idUser);
                const formattedPermissions = permissionsData.data.reduce((acc, permission) => {
                    acc[permission.id_template] = {
                        can_view: Boolean(permission.can_view),
                        can_edit: Boolean(permission.can_edit),
                        can_comment: Boolean(permission.can_comment),
                    };
                    return acc;
                }, {});

/*                 if(idDeclaration){
                    const {data} = await getTacheOneV(idDeclaration)
                    setTitle(data[0].nom_tache)
                } */
    
                setPermissions(formattedPermissions);
                setLoading(false);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
                setLoading(false);
            }
        };
    
        fetchPermissions();
    }, [idVille, idUser]);
    
    
    const handlePermissionChange = async (idTemplate, idUser, field, value) => {
        console.log(idTemplate, idUser, field, value, idVille);
        
        try {
            // Mise à jour de l'état local
            setPermissions((prevPermissions) => {
                const updatedPermissions = {
                    ...prevPermissions,
                    [idTemplate]: {
                        ...prevPermissions[idTemplate],
                        id_template : idTemplate,
                        id_user: idUser,
                        id_ville: idVille,
                        [field]: value ? 1 : 0,
                    },
                };
    
                updatePermissionsToServer(updatedPermissions[idTemplate]);
    
                return updatedPermissions;
            });
    
            notification.success({
                message: 'Permission mise à jour',
                description: `La permission "${field}" a été ${value ? 'ajoutée' : 'retirée'} avec succès.`,
            });
        } catch (error) {
            notification.error({
                message: 'Erreur de mise à jour',
                description: `Une erreur est survenue lors de la mise à jour de la permission "${field}".`,
            });
        }
    };
    
    const updatePermissionsToServer = async (permissions) => {
        try {
            await updatePermissionDeclaration({
                id_template: permissions.id_template,
                id_user: permissions.id_user,
                id_ville: idVille,
                can_view: permissions.can_view || 0,
                can_edit: permissions.can_edit || 0,
                can_comment: permissions.can_comment || 0,
            });
        } catch (error) {
            console.error('Erreur lors de l’envoi des permissions au serveur:', error);
        }
    };
    
    const columns = [
        {
            title: "#",
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            align: 'center',
            render: (text, record, index) => (
                <strong style={{ color: '#333' }}>{index + 1}</strong>
            ),
        },
        {
            title: <span style={{ fontWeight: 'bold', color: '#555' }}>📄 Template</span>,
            dataIndex: 'desc_template',
            key: 'desc_template',
            render: (text) => (
                <span style={{ fontWeight: '500', color: '#555' }}>
                    {text}
                </span>
            ),
        },
        {
            title: <span style={{ color: '#52c41a' }}>Voir <EyeOutlined /></span>,
            dataIndex: 'can_view',
            key: 'can_view',
            align: 'center',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_template]?.can_view || false}
                    onChange={(value) => handlePermissionChange(record.id_template, idUser, 'can_view', value)}
                />
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Modifier <EditOutlined /></span>,
            dataIndex: 'can_edit',
            key: 'can_edit',
            align: 'center',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_template]?.can_edit || false}
                    onChange={(value) => handlePermissionChange(record.id_template, idUser, 'can_edit', value)}
                />
            ),
        },
        {
            title: <span style={{ color: '#000' }}>Créer <PlusCircleOutlined /></span>,
            dataIndex: 'can_comment',
            key: 'can_comment',
            align: 'center',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_template]?.can_comment || false}
                    onChange={(value) => handlePermissionChange(record.id_template, idUser, 'can_comment', value)}
                />
            ),
        },
        {
            title: <span style={{ color: 'red' }}>Supprimer <DeleteOutlined /></span>,
            dataIndex: 'can_delete',
            key: 'can_delete',
            align: 'center',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_template]?.can_delete || false}
                    onChange={(value) => handlePermissionChange(record.id_template, idUser, 'can_delete', value)}
                />
            ),
        },
    ];
    

    const toggleAllPermissions = async (checked) => {
        const updatedPermissions = {};
    
        data.forEach((item) => {
            updatedPermissions[item.id_template] = {
                id_template: item.id_template, 
                id_user: idUser, 
                id_ville: idVille,
                can_view: checked ? 1 : 0,  
                can_edit: checked ? 1 : 0,  
                can_comment: checked ? 1 : 0, 
            };
        });
    
        setPermissions(updatedPermissions);
    
        await Promise.all(
            Object.values(updatedPermissions).map(updatePermissionsToServer)
        );
    
        notification.success({
            message: 'Mise à jour des permissions',
            description: `Toutes les permissions ont été ${checked ? 'activées' : 'désactivées'}.`,
        });
    };
    
    
      const filteredData = data.filter(item =>
        item.desc_template?.toLowerCase().includes(searchValue.toLowerCase())
      );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <UnlockOutlined className='client-icon' />
                    </div>
                    <h2 className="client-h2">Gestion des permissions Mr. {title}</h2>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Input.Search
                            type="search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Recherche..."
                            className="product-search"
                            enterButton
                        />    
                    </div>
                    <div>
                        <Switch 
                            checkedChildren="Tout activer" 
                            unCheckedChildren="Tout désactiver" 
                            onChange={(checked) => toggleAllPermissions(checked)} 
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
                      size="small"
                    />
            </div>
        </div>
    </>
  )
}

export default PermissionDeclarationOne;