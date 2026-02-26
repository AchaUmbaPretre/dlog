import { useCallback, useEffect, useState, useMemo } from "react";
import { getPresenceDashboardPerformance } from "../../../../services/presenceService";
import { getSite } from "../../../../services/charroiService";
import { getUser } from "../../../../services/userService";
import { notifyWarning } from "../../../../utils/notifyWarning";

export const useRapportPerformance = () => {
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    site_id: null,
    date_debut: null,
    date_fin: null,
  });

  /* =========================
     CHARGEMENT RÉFÉRENCES
  ========================== */
  const loadReferenceData = useCallback(async () => {
    try {
      const [siteResponse, userResponse] = await Promise.all([getSite(), getUser()]);

      setSites(siteResponse?.data?.data || siteResponse?.data || []);
      setUsers(userResponse?.data || []);
    } catch (err) {
      console.error("Erreur chargement références", err);
      notifyWarning("Erreur chargement sites/utilisateurs");
    }
  }, []);

  /* =========================
     CHARGEMENT PERFORMANCE
  ========================== */
  const loadPerformanceData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const presenceData = await getPresenceDashboardPerformance(params);
      // Si ton API retourne { success, data }, prendre data
      const payload = presenceData?.data || presenceData;

      setData(payload || {});
      return payload;
    } catch (err) {
      console.error("Erreur chargement performance", err);
      setError(err.message || "Erreur de chargement");
      notifyWarning("Erreur chargement Performance");

      const fallback = {
        metadata: { periode: { debut: null, fin: null, jours_ouvrables: 0 } },
        kpi_globaux: {},
        performances_sites: [],
        top_performeurs: [],
        agents_probleme: [],
      };

      setData(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     LOAD GLOBAL (avec filtres)
  ========================== */
  const load = useCallback(async () => {
    await loadPerformanceData(filters);
  }, [filters, loadPerformanceData]);

  /* =========================
     RELOAD AVEC NOUVEAUX FILTRES
  ========================== */
  const reloadWithParams = useCallback(
    async (newFilters = {}) => {
      const updated = { ...filters, ...newFilters };
      setFilters(updated);
      return loadPerformanceData(updated);
    },
    [filters, loadPerformanceData]
  );

  /* =========================
     RESET FILTRES
  ========================== */
  const resetFilters = useCallback(() => {
    const initial = { site_id: null, date_debut: null, date_fin: null };
    setFilters(initial);
    loadPerformanceData(initial);
  }, [loadPerformanceData]);

  /* =========================
     EFFECTS
  ========================== */
  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  useEffect(() => {
    load();
  }, [filters.site_id, filters.date_debut, filters.date_fin]);

  /* =========================
     COMPUTED DATA
  ========================== */
  const computedData = useMemo(() => {
    if (!data) return null;

    const kpi = data.kpi_globaux || {};
    const sitesData = data.performances_sites || [];
    const top = data.top_performeurs || [];
    const probleme = data.agents_probleme || [];

    const formattedKpi = {
      tauxPresence: kpi.taux_presence ?? 0,
      tauxPonctualite: kpi.taux_ponctualite ?? 0,
      tauxActivite: kpi.taux_activite ?? 0,
      totalRetards: kpi.total_retards ?? 0,
      retardMoyen: kpi.retard_moyen ?? 0,
      evolutionPresence: kpi.evolution_presence ?? 0,
      evolutionPonctualite: kpi.evolution_ponctualite ?? 0,
      evolutionActivite: kpi.evolution_activite ?? 0,
      totalHeuresSup: kpi.total_heures_sup ?? 0,
      employesAbsents: kpi.employes_absents ?? 0,
      absencesJustifiees: kpi.absences_justifiees ?? 0,
      retardMoyenFormat: `${Math.floor(kpi.retard_moyen / 60) || 0}h${
        Math.round(kpi.retard_moyen % 60) || 0
      }`,
      tauxPresenceColor:
        kpi.taux_presence >= 75
          ? "success"
          : kpi.taux_presence >= 50
          ? "warning"
          : "danger",
    };

    // Calcul total presences depuis performances_sites
    const totalPresences = sitesData.reduce(
      (acc, site) => acc + (site.employes_presents ?? 0),
      0
    );

    const stats = {
      totalEmployes: users.length,
      totalSites: sites.length,
      totalPresences,
      totalRetards: formattedKpi.totalRetards,
      totalHeuresSup: formattedKpi.totalHeuresSup,
      employesAbsents: formattedKpi.employesAbsents,
      absencesJustifiees: formattedKpi.absencesJustifiees,
    };

    return {
      ...data,
      kpi_globaux: formattedKpi,
      performances_sites: sitesData,
      top_performeurs: top,
      agents_probleme: probleme,
      stats,
    };
  }, [data, users.length, sites.length]);

  /* =========================
     EXPORT
  ========================== */
  const exportData = useCallback(() => {
    if (!computedData) return null;
    return JSON.stringify(computedData, null, 2);
  }, [computedData]);

  return {
    data: computedData,
    sites,
    users,
    loading,
    error,
    filters,
    stats: computedData?.stats || {},
    load,
    reload: load,
    reloadWithParams,
    resetFilters,
    exportData,
    hasData: !!computedData,
    isEmpty: !computedData,
    hasError: !!error,
    periode: computedData?.metadata?.periode || {},
  };
};