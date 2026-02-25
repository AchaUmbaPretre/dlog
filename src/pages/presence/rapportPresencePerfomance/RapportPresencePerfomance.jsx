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
    users, 
    loading, 
    error,
    reload
  } = useRapportPerformance();

  const {
    kpiGlobaux,
    performancesSites,
    classementEmployes,
    metadata,
    globalColor,
    localStats
  } = usePerformanceData(data);

  // Définition du style des lignes du tableau
  const getRowClassName = (record, index) => {
    if (index < 3) return 'ant-table-row-top';
    if ((record?.performance || 0) < 50) return 'ant-table-row-danger';
    return '';
  };

  if (loading) return <PerformanceLoader />;
  if (error) return <PerformanceError error={error} onReload={reload} />;

  return (
    <div style={{ padding: '24px' }}>
      {/* En-tête avec période */}
      <PageHeader 
        title="Rapport de Performance - Direction"
        periode={metadata.periode}
        loading={loading}
        onReload={reload}
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