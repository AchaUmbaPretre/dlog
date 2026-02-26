import { useMemo } from 'react';

export const usePerformanceData = (data) => {

  // Données brutes de l'API
  const rawData = useMemo(() => data?.data || data, [data]);
  
  // Transform underscore to camelCase if needed
  const transformedKpiGlobaux = useMemo(() => {
    const kpi = rawData?.kpi_globaux || {};
    return {
      tauxPresence: kpi.tauxPresence || kpi.taux_presence || 0,
      tauxPonctualite: kpi.tauxPonctualite || kpi.taux_ponctualite || 0,
      tauxActivite: kpi.tauxActivite || kpi.taux_activite || 0,
      totalRetards: kpi.totalRetards || kpi.total_retards || 0,
      retardMoyen: kpi.retardMoyen || kpi.retard_moyen || 0,
      evolutionPresence: kpi.evolutionPresence || kpi.evolution_presence || 0,
      evolutionPonctualite: kpi.evolutionPonctualite || kpi.evolution_ponctualite || 0,
      evolutionActivite: kpi.evolutionActivite || kpi.evolution_activite || 0,
      totalHeuresSup: kpi.totalHeuresSup || kpi.total_heures_sup || 0,
      employesAbsents: kpi.employesAbsents || kpi.employes_absents || 0,
      absencesJustifiees: kpi.absencesJustifiees || kpi.absences_justifiees || 0,
    };
  }, [rawData]);

  // Use the transformed data
  const kpiGlobaux = useMemo(() => ({
    ...transformedKpiGlobaux,
    retardMoyenFormat: transformedKpiGlobaux.retardMoyen ? 
      `${Math.floor(transformedKpiGlobaux.retardMoyen / 60)}h${transformedKpiGlobaux.retardMoyen % 60}` : '0h0',
    tauxPresenceColor: transformedKpiGlobaux.tauxPresence >= 75 ? 'success' : 
                       transformedKpiGlobaux.tauxPresence >= 50 ? 'warning' : 'danger'
  }), [transformedKpiGlobaux]);

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