import React, { useEffect, useState } from 'react';
import { UnlockOutlined } from '@ant-design/icons';
import { Switch, Table, Tag } from 'antd';
import { getPermissionsDepart, updatePermissionDepart } from '../../../services/permissionService';
import { getUser } from '../../../services/userService';

const PermissionDepart = ({ idDepartement, idVille }) => {
  const scroll = { x: 400 };
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const { data: userData } = await getUser();
        setData(userData);
        
        // Récupérer les permissions pour cette ville
        const permissionData = await getPermissionsDepart(idDepartement);
        
        // Initialiser l'état des permissions (clé = id_utilisateur, valeur = true/false)
        const permissionMap = {};
        permissionData.data.forEach((permission) => {
          permissionMap[permission.id_user] = permission.can_view;
        });
        setPermissions(permissionMap);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPermission();
  }, [idDepartement]);


  // Gérer le changement de permission
  const handlePermissionChange = async (userId, checked) => {
    try {
      // Mettre à jour l'état local des permissions
      setPermissions(prevPermissions => ({
        ...prevPermissions,
        [userId]: checked
      }));

      // Mettre à jour la permission dans la base de données
      const dataAll = {
        id_user: userId,
        id_departement: idDepartement,
        id_ville: idVille,
        can_view: checked
      }
      await updatePermissionDepart(dataAll);

      // Optionnel: Afficher un message de succès ou gérer d'autres actions si nécessaire
      console.log(`Permission de l'utilisateur ${userId} mise à jour à ${checked}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la permission:", error);
      // Vous pouvez également rétablir la valeur précédente en cas d'erreur
      setPermissions(prevPermissions => ({
        ...prevPermissions,
        [userId]: !checked
      }));
    }
  };

  // Colonnes du tableau
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
          checked={permissions[record.id_utilisateur] || false} // Vérifier si la permission existe
          onChange={(checked) => handlePermissionChange(record.id_utilisateur, checked)}
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
              <UnlockOutlined className="client-icon" />
            </div>
            <h2 className="client-h2">Gestion des permissions des departements</h2>
          </div>
          <Table
            dataSource={data}
            columns={columns}
            scroll={scroll}
            rowKey="id"
            bordered
            pagination={false}
            className="table_permission"
          />
        </div>
      </div>
    </>
  );
};

export default PermissionDepart;