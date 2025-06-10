import { useEffect, useState } from 'react'
import { Input, notification, Switch, Tag, Table, Space } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, FormOutlined, UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getProjetOne } from '../../../../services/projetService';
import { getUser } from '../../../../services/userService';
import { getPermissionsProjet, updatePermissionProjet } from '../../../../services/permissionService';

const PermissionProjetOne = ({idProjet}) => {
    const [permissions, setPermissions] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [title, setTitle] = useState('');
    const scroll = { x: 400 };
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const { data: users } = await getUser();
                setData(users);
    
               const permissionsData = await getPermissionsProjet(idProjet);
    
                const formattedPermissions = permissionsData.data.reduce((acc, permission) => {
                    acc[permission.id_user] = {
                        can_view: Boolean(permission.can_view),
                        can_edit: Boolean(permission.can_edit),
                        can_comment: Boolean(permission.can_comment),
                        can_delete: Boolean(permission.can_delete)
                    };
                    return acc;
                }, {});

                if(idProjet){
                    const {data} = await getProjetOne(idProjet)
                    setTitle(data.projet[0].nom_projet)
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
    }, [idProjet]);
    
    
    const handlePermissionChange = async (idUser, field, value) => {
        try {
            setPermissions((prevPermissions) => {
                const updatedPermissions = {
                    ...prevPermissions,
                    [idUser]: {
                        ...prevPermissions[idUser],
                        id_projet: idProjet,
                        id_user: idUser,
                        user_cr: userId,
                        [field]: value ? 1 : 0,
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
            await updatePermissionProjet({
                id_projet: permissions.id_projet,
                id_user: permissions.id_user,
                user_cr: userId,
                can_view: permissions.can_view || 0,
                can_edit: permissions.can_edit || 0,
                can_comment: permissions.can_comment || 0,
                can_delete: permissions.can_delete || 0
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
            title: <span style={{ color: '#52c41a', textAlign:'center' }}>Voir <EyeOutlined /></span>,
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
            title: <span style={{ color: '#1890ff', textAlign:'center' }}>Modifier <EditOutlined /></span>,
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
            title: <span style={{ color: '#000', textAlign:'center' }}>Ajouter <FormOutlined /></span>,
            dataIndex: 'can_comment',
            key: 'can_comment',
           render: (text, record) => (
                <Switch
                    checked={permissions[record.id_utilisateur]?.can_comment || false}
                    onChange={value => handlePermissionChange(record.id_utilisateur, 'can_comment', value)}
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
                    checked={permissions[record.id_utilisateur]?.can_delete || false}
                    onChange={(value) => handlePermissionChange(record.id_utilisateur, 'can_delete', value)}
                />
            ),
        },
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
                    <h2 className="client-h2">{ `Gestion des permissions du projet "${title}"` }</h2>
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

export default PermissionProjetOne;