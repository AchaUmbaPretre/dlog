import { useRapportPerformance } from './hooks/useRapportPerfomance';
import { usePerformanceData } from './hooks/usePerformanceData';
import { columnsSites, columnsTop, columnsProbleme } from './columns/performanceColumns';
import { PerformanceLoader, PerformanceError } from './components/PerformanceStates';
import { KPICards } from './components/KPICards';
import PageHeader from './components/PageHeader';
import PerformanceAlert from './components/PerformanceAlert';
import SiteComparison from './components/SiteComparison';
import EmployeeRanking from './components/EmployeeRanking';
import DirectionSummary from './components/DirectionSummary';
import './rapportPresencePerfomance.scss';

const RapportPresencePerformance = () => {
  const { 
    data, 
    sites,
    users, 
    loading, 
    error,
    reload,
    filters,
    updateFilters,
    reloadWithParams
  } = useRapportPerformance();

  const {
    kpiGlobaux,
    performancesSites,
    classementEmployes,
    metadata,
    globalColor,
    localStats
  } = usePerformanceData(data);

  // Gestionnaires d'événements pour les filtres
  const handleSiteChange = (siteId) => {
    updateFilters({ site_id: siteId });
    reloadWithParams({ site_id: siteId });
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      const dateDebut = dates[0].format('YYYY-MM-DD');
      const dateFin = dates[1].format('YYYY-MM-DD');
      updateFilters({ 
        date_debut: dateDebut,
        date_fin: dateFin
      });
      reloadWithParams({ 
        date_debut: dateDebut,
        date_fin: dateFin
      });
    }
  };

  // Définition du style des lignes du tableau
  const getRowClassName = (record, index) => {
    if (index < 3) return 'ant-table-row-top';
    if ((record?.performance || 0) < 50) return 'ant-table-row-danger';
    return '';
  };

  if (loading) return <PerformanceLoader />;
  if (error) return <PerformanceError error={error} onReload={reload} />;
  
  // ✅ Attendre que les données soient vraiment chargées
  if (!data || !kpiGlobaux || !localStats) return <PerformanceLoader />;

  return (
    <div style={{ padding: '24px' }}>
      {/* En-tête avec période et filtres */}
      <PageHeader 
        title="Rapport de Performance - Direction"
        periode={metadata.periode}
        loading={loading}
        onReload={reload}
        onSiteChange={handleSiteChange}
        onDateRangeChange={handleDateRangeChange}
        selectedSite={filters.site_id}
        sites={sites}
        alertThreshold={50}
        currentValue={kpiGlobaux.tauxPresence}
      />
      
      {/* Alertes de performance */}
      <PerformanceAlert 
        tauxPresence={kpiGlobaux.tauxPresence}
        employesAbsents={localStats.employesAbsents}
      />
      
      {/* KPIs Globaux */}
      <KPICards 
        kpiGlobaux={kpiGlobaux} 
        globalColor={globalColor} 
        localStats={localStats} 
      />

      {/* Comparaison des Sites */}
      <SiteComparison 
        sites={performancesSites}
        columns={columnsSites}
        stats={localStats}
        onRowClass={getRowClassName}
      />

      {/* Classement des Employés */}
      <EmployeeRanking 
        topPerformeurs={classementEmployes.topPerformeurs}
        agentsProbleme={classementEmployes.agentsProbleme}
        columnsTop={columnsTop}
        columnsProbleme={columnsProbleme}
      />

      {/* Synthèse Direction */}
      <DirectionSummary 
        globalColor={globalColor}
        metadata={metadata}
        kpiGlobaux={kpiGlobaux}
        classementEmployes={classementEmployes}
        users={users}
      />

      <style>
        {`
          .ant-table-row-top {
            background-color: #fffbe6;
          }
          .ant-table-row-top:hover > td {
            background-color: #fff1b8 !important;
          }
          .ant-table-row-danger {
            background-color: #fff1f0;
          }
          .ant-table-row-danger:hover > td {
            background-color: #ffccc7 !important;
          }
          .ant-card {
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
            transition: all 0.3s;
          }
          .ant-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .ant-statistic-title {
            color: rgba(255,255,255,0.8) !important;
          }
        `}
      </style>
    </div>
  );
};

export default RapportPresencePerformance;