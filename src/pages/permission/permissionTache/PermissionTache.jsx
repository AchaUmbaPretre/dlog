import React, { useEffect, useState } from 'react'
import { Input, notification, Switch, Tag, Table } from 'antd';
import { EyeOutlined, EditOutlined, FormOutlined, UnlockOutlined } from '@ant-design/icons';
import { getUser } from '../../../services/userService';
import { getPermissionsTache, updatePermissionTache } from '../../../services/permissionService';
import { getTacheOneV } from '../../../services/tacheService';

const PermissionTache = ({idTache}) => {
    const [permissions, setPermissions] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [title, setTitle] = useState('');
    const scroll = { x: 400 };

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const { data: users } = await getUser();
                setData(users);
    
                const permissionsData = await getPermissionsTache(idTache);
    
                const formattedPermissions = permissionsData.data.reduce((acc, permission) => {
                    acc[permission.id_user] = {
                        can_view: Boolean(permission.can_view),
                        can_edit: Boolean(permission.can_edit),
                        can_comment: Boolean(permission.can_comment),
                    };
                    return acc;
                }, {});

                if(idTache){
                    const {data} = await getTacheOneV(idTache)
                    setTitle(data[0].nom_tache)
                }
    
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
    }, [idTache]);
    
    
    const handlePermissionChange = async (idUser, field, value) => {
        try {
            // Mettez à jour l'état local pour inclure `id_tache` et refléter immédiatement les modifications
            setPermissions((prevPermissions) => {
                const updatedPermissions = {
                    ...prevPermissions,
                    [idUser]: {
                        ...prevPermissions[idUser],
                        id_tache: idTache, // Assurez-vous que `id_tache` est présent
                        id_user: idUser,  // Assurez-vous que `id_user` est présent
                        [field]: value ? 1 : 0, // Mettez à jour le champ spécifique
                    },
                };
    
                // Envoyez toutes les permissions de cet utilisateur au serveur
                updatePermissionsToServer(updatedPermissions[idUser]);
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
            // Envoyez toutes les permissions avec `id_tache` et `id_user` au serveur
            await updatePermissionTache({
                id_tache: permissions.id_tache,
                id_user: permissions.id_user,
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
            title: <span style={{ color: '#52c41a' }}>Voir <EyeOutlined /></span>,
            dataIndex: 'can_view',
            key: 'can_view',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_utilisateur]?.can_view || false}
                    onChange={value => handlePermissionChange(record.id_utilisateur, 'can_view', value)}
                />
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Modifier <EditOutlined /></span>,
            dataIndex: 'can_edit',
            key: 'can_edit',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_utilisateur]?.can_edit || false}
                    onChange={value => handlePermissionChange(record.id_utilisateur, 'can_edit', value)}
                />
            ),
        },
        {
            title: <span style={{ color: '#000' }}>Ajouter <FormOutlined /></span>,
            dataIndex: 'can_comment',
            key: 'can_comment',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_utilisateur]?.can_comment || false}
                    onChange={value => handlePermissionChange(record.id_utilisateur, 'can_comment', value)}
                />
            ),
        },
    ];
    
      const filteredData = data.filter(item =>
        item.nom?.toLowerCase().includes(searchValue.toLowerCase())
      );

      console.log(title)
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <UnlockOutlined className='client-icon' />
                    </div>
                    <h2 className="client-h2">Gestion des permissions de tache {title}</h2>
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