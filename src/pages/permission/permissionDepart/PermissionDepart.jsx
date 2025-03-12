import React, { useEffect, useState } from "react";
import {
  UnlockOutlined,
  FileTextOutlined,
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Switch, Table, Tag, Space, message, Spin } from "antd";
import {
  getPermissionsVille,
  updatePermissionTache,
} from "../../../../services/permissionService";
import { getProvinceOne } from "../../../../services/clientService";
import { getTacheVille } from "../../../../services/tacheService";

const PermissionVilleOne = ({ idVille, userId }) => {
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false); // Ajout du loading state

  useEffect(() => {
    const fetchData = async () => {
      if (!idVille || !userId) return;
      
      setLoading(true); // Début du chargement

      try {
        const { data: taches } = await getTacheVille(idVille);
        setData(taches);

        const { data: permissionData } = await getPermissionsVille(idVille);
        const permissionMap = {};
        permissionData.forEach((permission) => {
          permissionMap[permission.id_tache] = {
            can_view: permission.can_view,
            can_edit: permission.can_edit,
            can_comment: permission.can_comment,
            can_delete: permission.can_delete,
          };
        });
        setPermissions(permissionMap);

        const { data: provinceData } = await getProvinceOne(idVille);
        if (provinceData?.length) {
          setTitle(provinceData[0].name);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setData([]);
          message.warning("Aucune tâche trouvée pour cette ville.");
        } else {
          message.error("Échec du chargement des données.");
        }
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchData();
  }, [idVille, userId]);

  const handlePermissionChange = async (idTache, field, checked) => {
    try {
      setPermissions((prev) => ({
        ...prev,
        [idTache]: { ...prev[idTache], [field]: checked },
      }));

      const updatedPermissions = {
        id_user: userId,
        id_tache: idTache,
        id_ville: idVille,
        can_view: field === "can_view" ? checked : permissions[idTache]?.can_view ?? 0,
        can_edit: field === "can_edit" ? checked : permissions[idTache]?.can_edit ?? 0,
        can_comment: field === "can_comment" ? checked : permissions[idTache]?.can_comment ?? 0,
        can_delete: field === "can_delete" ? checked : permissions[idTache]?.can_delete ?? 0,
      };

      await updatePermissionTache(updatedPermissions);
      message.success("Autorisations mises à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la permission:", error);
      message.error("Échec de la mise à jour des autorisations");

      setPermissions((prev) => ({
        ...prev,
        [idTache]: { ...prev[idTache], [field]: !checked },
      }));
    }
  };

  const columnStyles = {
    title: {
      maxWidth: '220px',
      whiteSpace: 'nowrap',
      overflowX: 'scroll', 
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none', 
    },
    hideScroll: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
      width: "3%",
    },
    {
      title: "Titre",
      dataIndex: "nom_tache",
      key: "nom_tache",
      render: (text) => (
        <Space style={columnStyles.title} className={columnStyles.hideScroll}>
          <Tag icon={<FileTextOutlined />} color="cyan">
            {text}
          </Tag>
        </Space>
      ),
    },
    {
      title: (
        <span style={{ color: "#52c41a" }}>
          Voir <EyeOutlined />
        </span>
      ),
      dataIndex: "can_view",
      key: "can_view",
      render: (_, record) => (
        <Switch
          checked={permissions[record.id_tache]?.can_view || false}
          onChange={(value) => handlePermissionChange(record.id_tache, "can_view", value)}
          disabled={loading} // Désactivation pendant le chargement
        />
      ),
    },
    {
      title: (
        <span style={{ color: "#1890ff" }}>
          Modifier <EditOutlined />
        </span>
      ),
      dataIndex: "can_edit",
      key: "can_edit",
      render: (_, record) => (
        <Switch
          checked={permissions[record.id_tache]?.can_edit || false}
          onChange={(value) => handlePermissionChange(record.id_tache, "can_edit", value)}
          disabled={loading}
        />
      ),
    },
    {
      title: (
        <span style={{ color: "#000" }}>
          Ajouter <PlusCircleOutlined />
        </span>
      ),
      dataIndex: "can_comment",
      key: "can_comment",
      render: (_, record) => (
        <Switch
          checked={permissions[record.id_tache]?.can_comment || false}
          onChange={(value) => handlePermissionChange(record.id_tache, "can_comment", value)}
          disabled={loading}
        />
      ),
    },
    {
      title: (
        <span style={{ color: "red" }}>
          Supprimer <DeleteOutlined />
        </span>
      ),
      dataIndex: "can_delete",
      key: "can_delete",
      render: (_, record) => (
        <Switch
          checked={permissions[record.id_tache]?.can_delete || false}
          onChange={(value) => handlePermissionChange(record.id_tache, "can_delete", value)}
          disabled={loading}
        />
      ),
    },
  ];

  return (
    <div className="client">
      <div className="client-wrapper">
        <div className="client-row">
          <div className="client-row-icon">
            <UnlockOutlined className="client-icon" />
          </div>
          <h2 className="client-h2">Gestion des permissions pour la ville de {title}</h2>
        </div>
        
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Table
            dataSource={data}
            columns={columns}
            scroll={{ x: 400 }}
            rowKey="id_tache"
            bordered
            pagination={false}
            loading={loading} // Activation du loading sur la table
            className="table_permission"
          />
        )}
      </div>
    </div>
  );
};

export default PermissionVilleOne;
