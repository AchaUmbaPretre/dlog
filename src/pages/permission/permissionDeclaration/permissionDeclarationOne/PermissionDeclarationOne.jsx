import React, { useEffect, useState } from 'react'
import { Input, notification, Switch, Tag, Table } from 'antd';
import { EyeOutlined, EditOutlined, CalendarOutlined, FormOutlined, UnlockOutlined } from '@ant-design/icons';
import { getPermissionsDeclaration, updatePermissionDeclaration } from '../../../../services/permissionService';
import { getDeclaration, getDeclarationVille } from '../../../../services/templateService';
import { useSelector } from 'react-redux';
import moment from 'moment';


const PermissionDeclarationOne = ({idVille, idUser}) => {
    const [permissions, setPermissions] = useState({});
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [title, setTitle] = useState('');
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const role = useSelector((state) => state.user?.currentUser.role);
    const scroll = { x: 400 };

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const { data } = await getDeclarationVille(idVille);
                
                setData(data);
    
                const permissionsData = await getPermissionsDeclaration(idUser);
                const formattedPermissions = permissionsData.data.reduce((acc, permission) => {
                    acc[permission.id_declaration] = {
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
    
    
    const handlePermissionChange = async (idDeclaration, idUser, field, value) => {
        console.log(idDeclaration, idUser, field, value);
        
        try {
            // Mise à jour de l'état local
            setPermissions((prevPermissions) => {
                const updatedPermissions = {
                    ...prevPermissions,
                    [idDeclaration]: {
                        ...prevPermissions[idDeclaration],
                        id_declaration: idDeclaration,
                        id_user: idUser,
                        [field]: value ? 1 : 0,
                    },
                };
    
                // Envoyer les permissions mises à jour au serveur
                updatePermissionsToServer(updatedPermissions[idDeclaration]);
    
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
        console.log(permissions);
        try {
            await updatePermissionDeclaration({
                id_declaration: permissions.id_declaration,
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
            title: 'Déclaration',
            dataIndex: 'desc_template',
            key: 'desc_template',
            render: (text, record) => (
                <Tag color="blue">{`${text}`}</Tag>
            ),
        },
        {
            title: 'Periode',
            dataIndex: 'periode',
            key: 'periode',
            sorter: (a, b) => moment(a.periode) - moment(b.periode),
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
            title: <span style={{ color: '#52c41a' }}>Voir <EyeOutlined /></span>,
            dataIndex: 'can_view',
            key: 'can_view',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_declaration_super]?.can_view || false}
                    onChange={value => handlePermissionChange(record.id_declaration_super, idUser, 'can_view', value)}
                />
            ),
        },
        {
            title: <span style={{ color: '#1890ff' }}>Modifier <EditOutlined /></span>,
            dataIndex: 'can_edit',
            key: 'can_edit',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_declaration_super]?.can_edit || false}
                    onChange={value => handlePermissionChange(record.id_declaration_super, idUser, 'can_edit', value)}
                />
            ),
        },
        {
            title: <span style={{ color: '#000' }}>Ajouter <FormOutlined /></span>,
            dataIndex: 'can_comment',
            key: 'can_comment',
            render: (text, record) => (
                <Switch
                    checked={permissions[record.id_declaration_super]?.can_comment || false}
                    onChange={value => handlePermissionChange(record.id_declaration_super, idUser,  'can_comment', value)}
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
                    <h2 className="client-h2">Gestion des permissions de tacheSSSSS : {title}</h2>
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

export default PermissionDeclarationOne;