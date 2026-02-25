import { useMemo } from 'react';

export const usePerformanceData = (data) => {
  // Données brutes de l'API
  const rawData = useMemo(() => data?.data || data, [data]);

  // KPIs formatés
  const kpiGlobaux = useMemo(() => ({
    tauxPresence: rawData?.kpi_globaux?.taux_presence || 0,
    tauxPonctualite: rawData?.kpi_globaux?.taux_ponctualite || 0,
    tauxActivite: rawData?.kpi_globaux?.taux_activite || 0,
    totalRetards: rawData?.kpi_globaux?.total_retards || 0,
    retardMoyen: rawData?.kpi_globaux?.retard_moyen || 0,
    evolutionPresence: rawData?.kpi_globaux?.evolution_presence || 0,
    evolutionPonctualite: rawData?.kpi_globaux?.evolution_ponctualite || 0, // ✅ Valeur par défaut
    evolutionActivite: rawData?.kpi_globaux?.evolution_activite || 0, 
    totalHeuresSup: rawData?.kpi_globaux?.total_heures_sup || 0,
    employesAbsents: rawData?.kpi_globaux?.employes_absents || 0,
    absencesJustifiees: rawData?.kpi_globaux?.absences_justifiees || 0,
    retardMoyenFormat: rawData?.kpi_globaux?.retard_moyen ? 
      `${Math.floor(rawData.kpi_globaux.retard_moyen / 60)}h${rawData.kpi_globaux.retard_moyen % 60}` : '0h0',
    tauxPresenceColor: (rawData?.kpi_globaux?.taux_presence || 0) >= 75 ? 'success' : 
                       (rawData?.kpi_globaux?.taux_presence || 0) >= 50 ? 'warning' : 'danger'
  }), [rawData]);

  // Performances par site
  const performancesSites = useMemo(() => 
    (rawData?.performances_sites || []).map(site => ({
      ...site,
      key: site.site_id || Math.random()
    }))
  , [rawData]);

  // Classement des employés
  const classementEmployes = useMemo(() => ({
    topPerformeurs: (rawData?.top_performeurs || []).map(emp => ({
      ...emp,
      key: emp.id || Math.random()
    })),
    agentsProbleme: (rawData?.agents_probleme || []).map(emp => ({
      ...emp,
      key: emp.id || Math.random()
    }))
  }), [rawData]);

  // Métadonnées
  const metadata = useMemo(() => ({
    periode: rawData?.metadata?.periode || {
      debut: new Date().toISOString().split('T')[0],
      fin: new Date().toISOString().split('T')[0],
      jours_ouvrables: 0
    },
    date_generation: rawData?.metadata?.date_generation || new Date().toISOString()
  }), [rawData]);

  // Couleur globale
  const globalColor = useMemo(() => {
    const taux = kpiGlobaux.tauxPresence;
    if (taux >= 75) return '#52c41a';
    if (taux >= 50) return '#faad14';
    return '#f5222d';
  }, [kpiGlobaux.tauxPresence]);

  // Statistiques locales
  const localStats = useMemo(() => ({
    employesAbsents: kpiGlobaux.employesAbsents,
    moyennePresenceParSite: performancesSites.length > 0 
      ? performancesSites.reduce((acc, site) => acc + (site.taux_presence || 0), 0) / performancesSites.length
      : 0,
    meilleurSite: performancesSites.length > 0 
      ? performancesSites.sort((a, b) => (b.performance || 0) - (a.performance || 0))[0]
      : null,
    pireSite: performancesSites.length > 0 
      ? performancesSites.sort((a, b) => (a.performance || 0) - (b.performance || 0))[0]
      : null,
    sitesAvecProblemes: performancesSites.filter(s => (s.performance || 0) < 75).length
  }), [kpiGlobaux.employesAbsents, performancesSites]);


  return {
    kpiGlobaux,
    performancesSites,
    classementEmployes,
    metadata,
    globalColor,
    localStats
  };
};