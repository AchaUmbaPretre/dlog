import { useEffect, useState, useCallback } from 'react';
import { notification } from 'antd';
import { getUser } from '../../../../../services/userService';
import { getAbsenceType } from '../../../../../services/presenceService';
import { useSelector } from 'react-redux';

export const useAbsenceFormData = () => {
  const [users, setUsers] = useState([]);
  const [absenceTypes, setAbsenceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, typesRes] = await Promise.all([
        getUser(),
        getAbsenceType(),
      ]);
      setUsers(usersRes.data || []);
      setAbsenceTypes(typesRes.data || []);
    } catch {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de récupérer les données de référence.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { users, absenceTypes, loading, userId };
};
