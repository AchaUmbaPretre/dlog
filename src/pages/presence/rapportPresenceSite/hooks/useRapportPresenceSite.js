import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import { notification } from "antd";
import { getPresenceSite } from "../../../../services/presenceService";

export const useRapportPresenceSite = () => {
    const today = dayjs();
    
      // Période par défaut = mois courant
    const defaultPeriod = { month: today.month() + 1, year: today.year() };
    
    const [monthRange, setMonthRange] = useState(defaultPeriod);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        if (!monthRange?.month || !monthRange?.year) return;
        setLoading(true);

        try {
            const res = await getPresenceSite({
                month: monthRange.month,
                year: monthRange.year,
            })
            setData(res.data);
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Chargement des données impossible.',
            });
        } finally {
            setLoading(false);
        }
    }, [monthRange]);

    useEffect(() => {
        load();
    }, [load]);
    
    return { data, loading, monthRange, setMonthRange, reload: load };

}