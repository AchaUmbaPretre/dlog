import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, notification, Spin, Checkbox } from 'antd';
import { getUser } from '../../../../services/userService';
import { postUserTerminal, getUserTerminalById } from '../../../../services/presenceService';

const UserTerminal = ({ id_terminal, closeModal }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Gérer la sélection et permissions
  const [selectedUsers, setSelectedUsers] = useState({}); 

  const fetchUsers = useCallback(async () => {
    if (!id_terminal) return;
    setLoading(true);
    try {
      const resUsers = await getUser();
      const allUsers = resUsers?.data || [];

      // Récupérer les utilisateurs déjà affectés au terminal
      const resAssigned = await getUserTerminalById(id_terminal);
      const assigned = resAssigned?.data || [];

      // Construire l’état initial de selectedUsers
      const initialSelected = {};
      assigned.forEach(item => {
        initialSelected[item.user_id] = {
          can_read: item.can_read,
          can_edit: item.can_edit
        };
      });

      setUsers(allUsers);
      setSelectedUsers(initialSelected);
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de charger les utilisateurs ou leurs permissions.'
      });
    } finally {
      setLoading(false);
    }
  }, [id_terminal]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ===========================
   * HANDLERS
   * =========================== */
  const togglePermission = (userId, permission) => {
    setSelectedUsers(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [permission]: prev[userId]?.[permission] ? 0 : 1
      }
    }));
  };

  const handleSubmit = async () => {
    if (!Object.keys(selectedUsers).length) {
      notification.warning({
        message: 'Aucune sélection',
        description: 'Veuillez sélectionner au moins un utilisateur.'
      });
      return;
    }

    setSubmitting(true);
    try {
      // Post pour chaque utilisateur
      const promises = Object.entries(selectedUsers).map(([user_id, perms]) =>
        postUserTerminal({
          user_id,
          terminal_id: id_terminal,
          can_read: perms.can_read,
          can_edit: perms.can_edit
        })
      );
      await Promise.all(promises);

      notification.success({
        message: 'Succès',
        description: `Utilisateurs affectés au terminal avec succès.`
      });

      closeModal();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Échec de l’affectation des utilisateurs au terminal.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ===========================
   * TABLE
   * =========================== */
  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Lecture',
      key: 'can_read',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={selectedUsers[record.id_utilisateur]?.can_read === 1}
          onChange={() => togglePermission(record.id_utilisateur, 'can_read')}
        />
      )
    },
    {
      title: 'Édition',
      key: 'can_edit',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={selectedUsers[record.id_utilisateur]?.can_edit === 1}
          onChange={() => togglePermission(record.id_utilisateur, 'can_edit')}
        />
      )
    }
  ];

  if (!id_terminal) return null;

  return (
    <Spin spinning={loading}>
      <h3 style={{ marginBottom: 16 }}>
        Gestion des utilisateurs pour le terminal :
        <strong style={{ marginLeft: 8 }}>{id_terminal}</strong>
      </h3>

      <Table
        rowKey="id_utilisateur"
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 12 }}
        size="small"
        bordered
      />

      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button onClick={closeModal} style={{ marginRight: 8 }}>
          Annuler
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
        >
          Valider
        </Button>
      </div>
    </Spin>
  );
};

export default UserTerminal;
