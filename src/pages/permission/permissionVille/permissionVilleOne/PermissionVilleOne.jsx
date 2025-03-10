import React, { useEffect, useState } from "react";
import {
  UnlockOutlined,
  FileTextOutlined,
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Switch, Table, Tag, Space, message } from "antd";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!idVille) return;

        const { data: taches } = await getTacheVille(idVille);
        setData(taches);

        const { data: permissionData } = await getPermissionsVille(idVille);
        const permissionMap = {};
        permissionData.forEach((permission) => {
          permissionMap[permission.id_tache] = {
            can_read: permission.can_read,
            can_edit: permission.can_edit,
            can_comment: permission.can_comment,
            can_delete: permission.can_delete,
          };
        });
        setPermissions(permissionMap);

        const { data: provinceData } = await getProvinceOne(idVille);
        if (provinceData.length > 0) {
          setTitle(provinceData[0].name);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [idVille]);

  const handlePermissionChange = async (idTache, field, checked) => {
    try {
      // Mettre à jour l'état local des permissions
      setPermissions((prevPermissions) => ({
        ...prevPermissions,
        [idTache]: {
          ...prevPermissions[idTache],
          [field]: checked,
        },
      }));

      const dataAll = {
        id_user: userId,
        id_tache: idTache,
        id_ville: idVille,
        can_view: permissions[idTache]?.can_read ?? 0,
        can_edit: permissions[idTache]?.can_edit ?? 0,
        can_delete: permissions[idTache]?.can_delete ?? 0,
        can_comment: permissions[idTache]?.can_comment ?? 0,
      };

      await updatePermissionTache(dataAll);
      message.success("Autorisations mises à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la permission:", error);
      message.error("Échec de la mise à jour des autorisations");

      // Revenir à la valeur précédente en cas d'erreur
      setPermissions((prevPermissions) => ({
        ...prevPermissions,
        [idTache]: {
          ...prevPermissions[idTache],
          [field]: !checked,
        },
      }));
    }
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
        <Space>
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
      dataIndex: "can_read",
      key: "can_read",
      render: (_, record) => (
        <Switch
          checked={permissions[record.id_tache]?.can_read || false}
          onChange={(value) => handlePermissionChange(record.id_tache, "can_read", value)}
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
      align: "center",
      render: (_, record) => (
        <Switch
          checked={permissions[record.id_tache]?.can_comment || false}
          onChange={(value) => handlePermissionChange(record.id_tache, "can_comment", value)}
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
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 400 }}
          rowKey="id_tache"
          bordered
          pagination={false}
          className="table_permission"
        />
      </div>
    </div>
  );
};

export default PermissionVilleOne;
