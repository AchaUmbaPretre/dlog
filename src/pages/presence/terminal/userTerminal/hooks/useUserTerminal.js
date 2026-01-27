import { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import { getUser } from '../../services/userService';
import {
  getUserTerminalById,
  postUserTerminal
} from '../../services/presenceService';
export const useUserTerminal = (terminalId, onSuccess) => {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const normalizePermissions = (assigned) =>
    assigned.reduce((acc, item) => {
      acc[item.user_id] = {
        can_read: Boolean(item.can_read),
        can_edit: Boolean(item.can_edit),
      };
      return acc;
    }, {});

  const fetchData = useCallback(async () => {
    if (!terminalId) return;

    setLoading(true);
    try {
      const [usersRes, assignedRes] = await Promise.all([
        getUser(),
        getUserTerminalById(terminalId),
      ]);

      setUsers(usersRes?.data || []);
      setPermissions(normalizePermissions(assignedRes?.data || []));
    } catch {
      notification.error({
        message: 'Erreur',
        description: 'Chargement des utilisateurs impossible.',
      });
    } finally {
      setLoading(false);
    }
  }, [terminalId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const togglePermission = (userId, permission) => {
    setPermissions(prev => ({
      ...prev,
      [userId]: {
        can_read: prev[userId]?.can_read ?? false,
        can_edit: prev[userId]?.can_edit ?? false,
        [permission]: !prev[userId]?.[permission],
      },
    }));
  };

  const submit = async () => {
    if (!Object.keys(permissions).length) {
      notification.warning({
        message: 'Aucune sélection',
        description: 'Sélectionnez au moins un utilisateur.',
      });
      return;
    }

    setSubmitting(true);
    try {
      await Promise.all(
        Object.entries(permissions).map(([user_id, perms]) =>
          postUserTerminal({
            user_id,
            terminal_id: terminalId,
            can_read: perms.can_read ? 1 : 0,
            can_edit: perms.can_edit ? 1 : 0,
          })
        )
      );

      notification.success({
        message: 'Succès',
        description: 'Permissions enregistrées.',
      });

      onSuccess?.();
    } catch {
      notification.error({
        message: 'Erreur',
        description: 'Échec de la sauvegarde.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    users,
    permissions,
    loading,
    submitting,
    togglePermission,
    submit,
  };
};
