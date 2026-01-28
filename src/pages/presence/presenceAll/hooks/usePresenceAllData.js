import { useEffect, useState, useCallback } from "react";
import { notification } from "antd";
import { getSite } from "../../../../services/charroiService";
import { getPresence } from "../../../../services/presenceService";

export const usePresenceAllData = () => {
    const [presences, setPresences] = useState([]);
    const [sites, setSites] = useState([]);
    const [siteData, setSiteData] = useState([]);
    const [loading, setLoading] = useState(false);

    const showError = () => {
        notification.error({
            message: "Erreur de chargement",
            description: "Une erreur est survenue lors du chargement des données.",
        });
    };

    const loadPresences = useCallback(async () => {
        try {
            const res = await getPresence();
            setPresences(res?.data ?? []);
        } catch {
            showError();
        }
    }, []);

    const loadSites = useCallback(async () => {
        try {
            const res = await getSite();
            setSites(res?.data?.data ?? []);
        } catch {
            showError();
        }
    }, []);

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadPresences(),
                loadSites(),
            ]);
        } finally {
            setLoading(false);
        }
    }, [loadPresences, loadSites]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    return {
        presences,
        sites,
        loading,
        reload: loadAll,
        setSiteData
    };
};
