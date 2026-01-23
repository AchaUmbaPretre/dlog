import { useEffect, useState, useCallback } from 'react';
import { notification } from 'antd';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../../services/userService';

export const useCongeFormData = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const { permissions, scope_sites } = useSelector((state) => state.user?.currentUser);

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const [usersRes] = await Promise.all([
                getUser()
            ]);
            setUsers(usersRes.data || [])
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Impossible de récupérer les données.',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    return { users, loading, userId, permissions, scope_sites };
}