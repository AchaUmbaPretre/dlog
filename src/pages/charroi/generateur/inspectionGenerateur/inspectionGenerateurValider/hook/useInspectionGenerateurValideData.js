import { useCallback, useEffect, useState, useRef } from "react";
import { notification } from "antd";
import { getInspectGenerateurById } from "../../../../../../services/generateurService";

export const useInspectionGenerateurValideData = (inspectionId) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const isMounted = useRef(true);

    const load = useCallback(async () => {
        if (!inspectionId) return;

        setLoading(true);

        try {
            const res = await getInspectGenerateurById(inspectionId);

            if (isMounted.current) {
                setData(Array.isArray(res?.data) ? res.data : []);
            }
        } catch (error) {
            if (isMounted.current) {
                notification.error({
                    message: "Erreur de chargement",
                    description: "Une erreur est survenue lors du chargement des données.",
                });
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [inspectionId]);

    useEffect(() => {
        load();
        return () => {
            isMounted.current = false;
        };
    }, [load]);

    return {
        data,
        loading,
        reload: load,
        setData,
    };
};
