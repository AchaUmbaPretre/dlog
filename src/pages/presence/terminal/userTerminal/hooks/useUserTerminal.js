import { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import {
  getUserTerminalById,
  postUserTerminal,
  deleteUserTerminal
} from '../../../../../services/presenceService';
import { getUser } from '../../../../../services/userService';

export const useUserTerminal = (terminalId, onSuccess) => {
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState({});
  const [initialAssigned, setInitialAssigned] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const normalizeAssigned = (rows) =>
    rows.reduce((acc, r) => {
      acc[r.user_id] = true;
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

      const assigned = normalizeAssigned(assignedRes?.data || []);

      setUsers(usersRes?.data || []);
      setAssignedUsers(assigned);
      setInitialAssigned(assigned);
    } catch {
      notification.error({
        message: 'Erreur',
        description: 'Chargement des données impossible.',
      });
    } finally {
      setLoading(false);
    }
  }, [terminalId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleUser = (userId) => {
    setAssignedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const toAdd = [];
      const toRemove = [];

      for (const userId of Object.keys(assignedUsers)) {
        if (assignedUsers[userId] && !initialAssigned[userId]) {
          toAdd.push(userId);
        }
      }

      for (const userId of Object.keys(initialAssigned)) {
        if (!assignedUsers[userId]) {
          toRemove.push(userId);
        }
      }

      await Promise.all([
        ...toAdd.map(user_id =>
          postUserTerminal({ user_id, terminal_id: terminalId })
        ),
        ...toRemove.map(user_id =>
          deleteUserTerminal(user_id, terminalId)
        )
      ]);

      notification.success({
        message: 'Succès',
        description: 'Accès aux terminaux mis à jour.',
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
    assignedUsers,
    loading,
    submitting,
    toggleUser,
    submit,
  };
};
