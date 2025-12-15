import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useReparateurGenLoader } from './useReparateurGenLoader';


export function useReparateurGenForm({ onSaved } = {}) {
    const userId = useSelector((s) => s.user?.currentUser?.id_utilisateur);
    const { loading, lists, reload } = useReparateurGenLoader();

    return {
        loading,
        lists,
        reload
    }
}