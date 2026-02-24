import { useCallback, useEffect, useState } from "react";
import { notifyWarning } from "../../../../../utils/notifyWarning";
import { getSite } from "../../../../../services/charroiService";
import { getDepartement } from "../../../../../services/departementService";
import { getUser } from "../../../../../services/userService";

export const useFiltreDashData = () => {
    const [data, setData] = useState([]);
    const [sites, setSites] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [period, setPeriod] = useState("TODAY");
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [siteRes, deptRes, userRes] = await Promise.all([
                getSite(),
                getDepartement(),
                getUser(),
            ]);

            setSites(Array.isArray(siteRes?.data.data) ? siteRes.data.data : []);
            setDepartments(Array.isArray(deptRes?.data) ? deptRes.data : []);
            setData(Array.isArray(userRes?.data) ? userRes.data : []);
        } catch (error) {
            console.error("useFiltreDashData:", error);
            notifyWarning("Impossible de charger les données.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return {
        data,
        sites,
        departments,
        loading,
        period,
        setPeriod,
        reload: load
    };
};