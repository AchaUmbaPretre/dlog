import React, { useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Statistic, 
  Tag, 
  Typography, 
  Space, 
  Avatar,
  Tooltip,
  Badge,
  Alert,
  Progress,
  Button
} from 'antd';
import { 
  UpOutlined,
  DownOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  CrownOutlined,
  WarningOutlined,
  BuildOutlined,
  ReloadOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';
import { useRapportPerformance } from './hooks/useRapportPerfomance';

const { Title, Text } = Typography;

const RapportPresencePerformance = () => {
  const { 
    data, 
    sites, 
    users, 
    loading, 
    error,
    reload,
    stats,
    hasData,
    periode
  } = useRapportPerformance();

  // Utiliser les données brutes de l'API (avec soulignés)
  const kpiGlobaux = useMemo(() => {
    // Données brutes de l'API (dans data.data)
    const rawData = data?.data || data;
    
    return {
      tauxPresence: rawData?.kpi_globaux?.taux_presence || 0,
      tauxPonctualite: rawData?.kpi_globaux?.taux_ponctualite || 0,
      tauxActivite: rawData?.kpi_globaux?.taux_activite || 0,
      totalRetards: rawData?.kpi_globaux?.total_retards || 0,
      retardMoyen: rawData?.kpi_globaux?.retard_moyen || 0,
      evolutionPresence: rawData?.kpi_globaux?.evolution_presence || 0,
      totalHeuresSup: rawData?.kpi_globaux?.total_heures_sup || 0,
      employesAbsents: rawData?.kpi_globaux?.employes_absents || 0,
      absencesJustifiees: rawData?.kpi_globaux?.absences_justifiees || 0,
      retardMoyenFormat: rawData?.kpi_globaux?.retard_moyen ? 
        `${Math.floor(rawData.kpi_globaux.retard_moyen / 60)}h${rawData.kpi_globaux.retard_moyen % 60}` : '0h0',
      tauxPresenceColor: (rawData?.kpi_globaux?.taux_presence || 0) >= 75 ? 'success' : 
                         (rawData?.kpi_globaux?.taux_presence || 0) >= 50 ? 'warning' : 'danger'
    };
  }, [data]);

  // Performance par site (données brutes)
  const performancesSites = useMemo(() => {
    const rawData = data?.data || data;
    return (rawData?.performances_sites || []).map(site => ({
      ...site,
      key: site.site_id || Math.random()
    }));
  }, [data]);

  // Classement des employés (données brutes)
  const classementEmployes = useMemo(() => {
    const rawData = data?.data || data;
    return {
      topPerformeurs: (rawData?.top_performeurs || []).map(emp => ({
        ...emp,
        key: emp.id || Math.random()
      })),
      agentsProbleme: (rawData?.agents_probleme || []).map(emp => ({
        ...emp,
        key: emp.id || Math.random()
      }))
    };
  }, [data]);

  // Métadonnées (données brutes)
  const metadata = useMemo(() => {
    const rawData = data?.data || data;
    return {
      periode: rawData?.metadata?.periode || {
        debut: new Date().toISOString().split('T')[0],
        fin: new Date().toISOString().split('T')[0],
        jours_ouvrables: 0
      },
      date_generation: rawData?.metadata?.date_generation || new Date().toISOString()
    };
  }, [data]);

  // Déterminer la couleur globale
  const globalColor = useMemo(() => {
    const taux = kpiGlobaux.tauxPresence || 0;
    if (taux >= 75) return '#52c41a';
    if (taux >= 50) return '#faad14';
    return '#f5222d';
  }, [kpiGlobaux.tauxPresence]);

  // Formatage sécurisé de la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (e) {
      return 'Date invalide';
    }
  };

  // Statistiques calculées localement
  const localStats = useMemo(() => {
    return {
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
    };
  }, [kpiGlobaux.employesAbsents, performancesSites]);

  // Colonnes pour le tableau des sites (utilisez les bons noms de champs)
  const columnsSites = [
    {
      title: 'Site',
      dataIndex: 'site_nom',
      key: 'site',
      render: (text, record) => (
        <Space>
          <BuildOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text || 'N/A'}</Text>
          {record?.performance < 50 && (
            <Tooltip title="Site en difficulté">
              <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: 'Présence',
      dataIndex: 'taux_presence',
      key: 'presence',
      render: (value) => {
        const val = value || 0;
        const color = val >= 75 ? '#52c41a' : val >= 50 ? '#faad14' : '#f5222d';
        return (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong style={{ color }}>{val}%</Text>
            <Progress 
              percent={val} 
              size="small" 
              showInfo={false}
              strokeColor={color}
              trailColor="#f0f0f0"
            />
          </Space>
        );
      }
    },
    {
      title: 'Retards',
      dataIndex: 'total_retards',
      key: 'retards',
      render: (value, record) => {
        const retards = value || 0;
        return (
          <Space>
            <Badge 
              count={retards} 
              style={{ backgroundColor: retards > 10 ? '#f5222d' : '#faad14' }}
              overflowCount={999}
            />
            <Tooltip title="Retard moyen">
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({(record?.retard_moyen || 0).toFixed(0)} min)
              </Text>
            </Tooltip>
          </Space>
        );
      }
    },
    {
      title: 'Performance',
      dataIndex: 'performance',
      key: 'performance',
      render: (value) => {
        const val = value || 0;
        let color = 'success';
        if (val < 50) color = 'error';
        else if (val < 75) color = 'warning';
        
        return (
          <Tag color={color}>
            {val}%
          </Tag>
        );
      }
    },
    {
      title: 'Effectifs',
      key: 'effectifs',
      render: (record) => (
        <Space>
          <TeamOutlined style={{ color: '#1890ff' }} />
          <Text type="secondary">
            {record?.employes_presents || 0}/{record?.employes_total || 0}
          </Text>
        </Space>
      )
    }
  ];

  // Colonnes pour le tableau des top performeurs
  const columnsTop = [
    {
      title: 'Employé',
      dataIndex: 'nom',
      key: 'nom',
      render: (text, record) => (
        <Space>
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#87d068' }}
          />
          <div>
            <Text strong>{record?.prenom || ''} {record?.nom || ''}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>{record?.site || 'N/A'}</Text>
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Présence',
      dataIndex: 'taux_presence',
      key: 'tauxPresence',
      render: (value) => (
        <Tag color="success">{value || 0}%</Tag>
      )
    },
    {
      title: 'Retard',
      dataIndex: 'retard_moyen',
      key: 'retardMoyen',
      render: (value) => (
        <Text type="secondary">
          <FieldTimeOutlined /> {value || 0} min
        </Text>
      )
    },
    {
      title: 'Heures sup',
      dataIndex: 'heures_sup',
      key: 'heuresSup',
      render: (value) => (
        <Text type="secondary">{value || 0}h</Text>
      )
    }
  ];

  // Colonnes pour le tableau des agents à problème
  const columnsProbleme = [
    {
      title: 'Employé',
      dataIndex: 'nom',
      key: 'nom',
      render: (text, record) => (
        <Space>
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#f5222d' }}
          />
          <div>
            <Text strong>{record?.prenom || ''} {record?.nom || ''}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>{record?.site || 'N/A'}</Text>
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Présence',
      dataIndex: 'taux_presence',
      key: 'tauxPresence',
      render: (value) => (
        <Tag color="error">{value || 0}%</Tag>
      )
    },
    {
      title: 'Retards',
      dataIndex: 'jours_retard',
      key: 'joursRetard',
      render: (value, record) => (
        <Tooltip title={`Total: ${record?.total_minutes_retard || 0} min`}>
          <Badge 
            count={value || 0} 
            style={{ backgroundColor: '#f5222d' }} 
            overflowCount={999}
          />
        </Tooltip>
      )
    },
    {
      title: 'Retard moyen',
      dataIndex: 'retard_moyen',
      key: 'retardMoyen',
      render: (value) => {
        const minutes = value || 0;
        return (
          <Text type="danger">
            {Math.floor(minutes / 60)}h{minutes % 60}
          </Text>
        );
      }
    },
    {
      title: 'Absences',
      dataIndex: 'jours_absence',
      key: 'joursAbsence',
      render: (value) => (
        <Tag color="error">{value || 0}j</Tag>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Card loading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Erreur de chargement"
          description={error}
          type="error"
          showIcon
          action={
            <Button 
              icon={<ReloadOutlined />} 
              onClick={reload}
              size="small"
            >
              Réessayer
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* En-tête avec période */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <Col>
          <Title level={2}>
            Rapport de Performance - Direction
            {(kpiGlobaux?.tauxPresence || 0) < 50 && (
              <Tag color="error" style={{ marginLeft: '12px' }}>
                ALERTE CRITIQUE
              </Tag>
            )}
          </Title>
        </Col>
        <Col>
          <Space>
            <Tag icon={<CalendarOutlined />} color="blue">
              {formatDate(metadata?.periode?.debut)} - {formatDate(metadata?.periode?.fin)}
            </Tag>
            <Tag color="geekblue">{metadata?.periode?.jours_ouvrables || 0} jours ouvrés</Tag>
            <ReloadOutlined 
              onClick={reload} 
              style={{ cursor: 'pointer', fontSize: '16px', color: '#1890ff' }} 
              spin={loading}
            />
          </Space>
        </Col>
      </Row>
      
      {/* Alertes de performance */}
      {(kpiGlobaux?.tauxPresence || 0) < 60 && (
        <Alert
          message="Performance critique détectée"
          description={`Le taux de présence global est de ${kpiGlobaux?.tauxPresence || 0}%, bien en dessous de l'objectif de 75%. ${localStats?.employesAbsents || 0} employés sont actuellement absents.`}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}
      
      {/* KPIs Globaux */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={24} md={8}>
          <Card 
            style={{ 
              borderTop: `4px solid ${globalColor}`,
              transition: 'all 0.3s'
            }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: globalColor }} />
                <Tag color={(kpiGlobaux?.evolutionPresence || 0) >= 0 ? 'success' : 'error'}>
                  {(kpiGlobaux?.evolutionPresence || 0) >= 0 ? <UpOutlined /> : <DownOutlined />}
                  {Math.abs(kpiGlobaux?.evolutionPresence || 0)}%
                </Tag>
              </Space>
              <Statistic 
                title="Taux de Présence"
                value={kpiGlobaux?.tauxPresence || 0}
                precision={1}
                suffix="%"
                valueStyle={{ color: globalColor, fontSize: '32px' }}
              />
              <Progress 
                percent={kpiGlobaux?.tauxPresence || 0} 
                strokeColor={globalColor}
                showInfo={false}
              />
              <Text type="secondary">
                {localStats?.employesAbsents || 0} employés absents • {kpiGlobaux?.absencesJustifiees || 0} justifiées
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card style={{ borderTop: '4px solid #52c41a' }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                <Avatar size={48} icon={<ClockCircleOutlined />} style={{ backgroundColor: '#52c41a' }} />
                <Tag color={(kpiGlobaux?.evolutionPonctualite || 0) >= 0 ? 'success' : 'error'}>
                  {(kpiGlobaux?.evolutionPonctualite || 0) >= 0 ? <UpOutlined /> : <DownOutlined />}
                  {Math.abs(kpiGlobaux?.evolutionPonctualite || 0)}%
                </Tag>
              </Space>
              <Statistic 
                title="Taux de Ponctualité"
                value={kpiGlobaux?.tauxPonctualite || 0}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#52c41a', fontSize: '32px' }}
              />
              <Text type="secondary">
                <FieldTimeOutlined /> {Math.round(kpiGlobaux?.retardMoyen || 0)} min de retard moyen • {kpiGlobaux?.totalRetards || 0} retards
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card style={{ borderTop: '4px solid #722ed1' }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                <Avatar size={48} icon={<DashboardOutlined />} style={{ backgroundColor: '#722ed1' }} />
                <Tag color={(kpiGlobaux?.evolutionActivite || 0) >= 0 ? 'success' : 'error'}>
                  {(kpiGlobaux?.evolutionActivite || 0) >= 0 ? <UpOutlined /> : <DownOutlined />}
                  {Math.abs(kpiGlobaux?.evolutionActivite || 0)}%
                </Tag>
              </Space>
              <Statistic 
                title="Taux d'Activité"
                value={kpiGlobaux?.tauxActivite || 0}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#722ed1', fontSize: '32px' }}
              />
              <Text type="secondary">
                {kpiGlobaux?.totalHeuresSup || 0}h supplémentaires
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Comparaison des Sites */}
      <Card 
        title={
          <Space>
            <BuildOutlined />
            <span>Comparaison des Sites</span>
            <Tag color="blue">{performancesSites?.length || 0} sites</Tag>
          </Space>
        }
        style={{ marginBottom: '24px' }}
        extra={
          <Space>
            {localStats?.meilleurSite && (
              <Tag color="gold">
                🏆 Meilleur: {localStats.meilleurSite.site_nom} ({localStats.meilleurSite.performance}%)
              </Tag>
            )}
            {localStats?.pireSite && localStats.pireSite.performance < 50 && (
              <Tag color="error">
                ⚠ Pire: {localStats.pireSite.site_nom} ({localStats.pireSite.performance}%)
              </Tag>
            )}
          </Space>
        }
      >
        <Table 
          columns={columnsSites} 
          dataSource={performancesSites}
          pagination={false}
          bordered
          rowClassName={(record, index) => {
            if (index < 3) return 'ant-table-row-top';
            if ((record?.performance || 0) < 50) return 'ant-table-row-danger';
            return '';
          }}
          locale={{ emptyText: 'Aucune donnée de site disponible' }}
        />
        {performancesSites?.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <Space size={[0, 8]} wrap>
              <Tag color="gold">🏆 Top 3 performeurs</Tag>
              <Tag color="blue">Moyenne présence: {Math.round(localStats?.moyennePresenceParSite || 0)}%</Tag>
              <Tag color="orange">{localStats?.sitesAvecProblemes || 0} sites en difficulté</Tag>
            </Space>
          </div>
        )}
      </Card>

      {/* Classement des Employés */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <CrownOutlined style={{ color: '#faad14' }} />
                <span>Top Performeurs</span>
                <Tag color="success">{classementEmployes?.topPerformeurs?.length || 0}</Tag>
              </Space>
            }
          >
            <Table 
              columns={columnsTop} 
              dataSource={classementEmployes?.topPerformeurs || []}
              pagination={false}
              showHeader={false}
              size="small"
              locale={{ emptyText: 'Aucun top performeur ce mois-ci' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <WarningOutlined style={{ color: '#f5222d' }} />
                <span>Agents à Problème</span>
                <Tag color="error">{classementEmployes?.agentsProbleme?.length || 0}</Tag>
              </Space>
            }
          >
            <Table 
              columns={columnsProbleme} 
              dataSource={classementEmployes?.agentsProbleme || []}
              pagination={false}
              showHeader={false}
              size="small"
              locale={{ emptyText: 'Aucun agent à problème identifié' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Synthèse Direction */}
      <Card style={{ 
        marginTop: '24px', 
        background: `linear-gradient(135deg, ${globalColor} 0%, ${globalColor}dd 100%)`,
        border: 'none',
        borderRadius: '8px'
      }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              Synthèse Direction - {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </Title>
          </Col>
          <Col>
            <Tag color="white" style={{ color: globalColor }}>
              {metadata?.periode?.jours_ouvrables || 0} jours analysés
            </Tag>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Présence globale</span>}
              value={kpiGlobaux?.tauxPresence || 0}
              precision={1}
              suffix="%"
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Ponctualité</span>}
              value={kpiGlobaux?.tauxPonctualite || 0}
              precision={1}
              suffix="%"
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Top performeurs</span>}
              value={classementEmployes?.topPerformeurs?.length || 0}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Agents à problème</span>}
              value={classementEmployes?.agentsProbleme?.length || 0}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
          </Col>
        </Row>

        {/* Indicateurs supplémentaires */}
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Space size={[16, 8]} wrap>
              <Tag color="white" style={{ color: globalColor }}>
                ⏱ Retard moyen: {Math.round(kpiGlobaux?.retardMoyen || 0)} min
              </Tag>
              <Tag color="white" style={{ color: globalColor }}>
                📊 Total retards: {kpiGlobaux?.totalRetards || 0}
              </Tag>
              <Tag color="white" style={{ color: globalColor }}>
                💪 Heures sup: {kpiGlobaux?.totalHeuresSup || 0}h
              </Tag>
              <Tag color="white" style={{ color: globalColor }}>
                👥 Employés actifs: {users?.length || 0}
              </Tag>
            </Space>
          </Col>
        </Row>
      </Card>

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