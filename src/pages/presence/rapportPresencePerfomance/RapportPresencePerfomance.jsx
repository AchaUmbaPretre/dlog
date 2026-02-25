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
  Badge
} from 'antd';
import { 
  UpOutlined,
  DownOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  CrownOutlined,
  WarningOutlined,
  BuildOutlined
} from '@ant-design/icons';
import { useDashboardPresence } from '../dashboardPresence/hooks/useDashboardPresence';

const { Title, Text } = Typography;

const RapportPresencePerformance = () => {
  const { sites, presences, utilisateurs, loading } = useDashboardPresence();

  // Calcul des KPIs globaux
  const kpiGlobaux = useMemo(() => {
    const today = new Date();
    const debutMois = new Date(today.getFullYear(), today.getMonth(), 1);
    const finMois = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const presencesMois = presences.filter(p => 
      p.date_presence >= debutMois && p.date_presence <= finMois
    );

    const totalEmployes = utilisateurs.length;
    const joursOuvrables = 22;
    const presencesAttendues = totalEmployes * joursOuvrables;
    
    const presencesReelles = presencesMois.filter(p => 
      p.statut_jour === 'PRESENT' || p.statut_jour === 'SUPPLEMENTAIRE'
    ).length;
    
    const totalRetards = presencesMois.reduce((acc, p) => acc + (p.retard_minutes || 0), 0);
    const presencesAvecRetard = presencesMois.filter(p => p.retard_minutes > 0).length;
    
    const totalHeuresTravaillees = presencesMois.reduce((acc, p) => {
      if (p.heure_entree && p.heure_sortie) {
        const duree = (new Date(p.heure_sortie).getTime() - new Date(p.heure_entree).getTime()) / (1000 * 60 * 60);
        return acc + duree;
      }
      return acc;
    }, 0);
    
    const heuresAttendues = totalEmployes * joursOuvrables * 8;
    
    return {
      tauxPresence: (presencesReelles / presencesAttendues) * 100,
      tauxPonctualite: ((presencesReelles - presencesAvecRetard) / presencesReelles) * 100,
      tauxActivite: (totalHeuresTravaillees / heuresAttendues) * 100,
      totalRetards,
      retardMoyen: presencesAvecRetard > 0 ? totalRetards / presencesAvecRetard : 0,
      evolutionPresence: +2.5,
      evolutionPonctualite: -1.2,
      evolutionActivite: +1.8
    };
  }, [presences, utilisateurs]);

  // Performance par site
  const performancesSites = useMemo(() => {
    const today = new Date();
    const debutMois = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return sites.map(site => {
      const presencesSite = presences.filter(p => 
        p.site_id === site.id && 
        p.date_presence >= debutMois
      );
      
      const utilisateursSite = utilisateurs.filter(u => u.site_id === site.id);
      const joursOuvrables = 22;
      const presencesAttendues = utilisateursSite.length * joursOuvrables;
      
      const presencesReelles = presencesSite.filter(p => 
        p.statut_jour === 'PRESENT' || p.statut_jour === 'SUPPLEMENTAIRE'
      ).length;
      
      const totalRetards = presencesSite.reduce((acc, p) => acc + (p.retard_minutes || 0), 0);
      const presencesAvecRetard = presencesSite.filter(p => p.retard_minutes > 0).length;
      
      const tauxPresence = (presencesReelles / presencesAttendues) * 100;
      const retardMoyen = presencesAvecRetard > 0 ? totalRetards / presencesAvecRetard : 0;
      
      const performance = (tauxPresence * 0.6) + ((100 - (retardMoyen / 60 * 100)) * 0.4);
      
      return {
        key: site.id,
        site: site.nom,
        presence: Math.round(tauxPresence * 10) / 10,
        retards: presencesAvecRetard,
        retardMoyen: Math.round(retardMoyen * 10) / 10,
        performance: Math.round(performance * 10) / 10,
        employesTotal: utilisateursSite.length,
        employesPresent: presencesSite.filter(p => p.date_presence === today).length
      };
    }).sort((a, b) => b.performance - a.performance);
  }, [sites, presences, utilisateurs]);

  // Classement des employés
  const classementEmployes = useMemo(() => {
    const today = new Date();
    const debutMois = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const performances = utilisateurs.map(user => {
      const presencesUser = presences.filter(p => 
        p.id_utilisateur === user.id && 
        p.date_presence >= debutMois
      );
      
      const site = sites.find(s => s.id === user.site_id);
      const joursOuvrables = 22;
      const presencesAttendues = joursOuvrables;
      
      const presencesReelles = presencesUser.filter(p => 
        p.statut_jour === 'PRESENT' || p.statut_jour === 'SUPPLEMENTAIRE'
      ).length;
      
      const totalRetards = presencesUser.reduce((acc, p) => acc + (p.retard_minutes || 0), 0);
      const presencesAvecRetard = presencesUser.filter(p => p.retard_minutes > 0).length;
      
      const tauxPresence = (presencesReelles / presencesAttendues) * 100;
      const retardMoyen = presencesAvecRetard > 0 ? totalRetards / presencesAvecRetard : 0;
      
      const heuresSupplementaires = presencesUser.reduce((acc, p) => acc + (p.heures_supplementaires || 0), 0);
      
      let statut = 'NORMAL';
      let statutColor = 'default';
      if (tauxPresence >= 98 && retardMoyen <= 5) {
        statut = 'TOP';
        statutColor = 'success';
      } else if (tauxPresence < 80 || retardMoyen > 30) {
        statut = 'PROBLEME';
        statutColor = 'error';
      }
      
      return {
        key: user.id,
        id: user.id,
        nom: `${user.prenom} ${user.nom}`,
        site: site?.nom || 'Non assigné',
        tauxPresence: Math.round(tauxPresence * 10) / 10,
        totalRetards: presencesAvecRetard,
        retardMoyen: Math.round(retardMoyen * 10) / 10,
        heuresSupplementaires: Math.round(heuresSupplementaires * 10) / 10,
        statut,
        statutColor
      };
    });
    
    const topPerformeurs = performances
      .filter(p => p.statut === 'TOP')
      .sort((a, b) => b.tauxPresence - a.tauxPresence)
      .slice(0, 5);
      
    const agentsProbleme = performances
      .filter(p => p.statut === 'PROBLEME')
      .sort((a, b) => a.tauxPresence - b.tauxPresence)
      .slice(0, 5);
    
    return { topPerformeurs, agentsProbleme, tous: performances };
  }, [utilisateurs, presences, sites]);

  // Colonnes pour le tableau des sites
  const columnsSites = [
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site',
      render: (text) => (
        <Space>
          <BuildOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Présence',
      dataIndex: 'presence',
      key: 'presence',
      render: (value, record) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong style={{ 
            color: value >= 95 ? '#52c41a' : value >= 85 ? '#faad14' : '#f5222d' 
          }}>
            {value}%
          </Text>
          <div style={{ 
            height: 4, 
            width: '100%', 
            backgroundColor: '#f0f0f0',
            borderRadius: 2
          }}>
            <div style={{ 
              height: '100%',
              width: `${value}%`,
              backgroundColor: value >= 95 ? '#52c41a' : value >= 85 ? '#faad14' : '#f5222d',
              borderRadius: 2
            }} />
          </div>
        </Space>
      )
    },
    {
      title: 'Retards',
      dataIndex: 'retards',
      key: 'retards',
      render: (value, record) => (
        <Space>
          <Text>{value}</Text>
          <Tooltip title="Retard moyen">
            <Text type="secondary" style={{ fontSize: 12 }}>
              ({record.retardMoyen} min)
            </Text>
          </Tooltip>
        </Space>
      )
    },
    {
      title: 'Performance',
      dataIndex: 'performance',
      key: 'performance',
      render: (value) => {
        let color = 'green';
        if (value < 75) color = 'red';
        else if (value < 90) color = 'orange';
        
        return (
          <Tag color={color}>
            {value}%
          </Tag>
        );
      }
    },
    {
      title: 'Effectifs',
      dataIndex: 'employesPresent',
      key: 'employesPresent',
      render: (value, record) => (
        <Text type="secondary">
          {value}/{record.employesTotal}
        </Text>
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
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
          <div>
            <Text strong>{text}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>{record.site}</Text>
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Présence',
      dataIndex: 'tauxPresence',
      key: 'tauxPresence',
      render: (value) => <Text type="success">{value}%</Text>
    },
    {
      title: 'Retard',
      dataIndex: 'retardMoyen',
      key: 'retardMoyen',
      render: (value) => <Text type="secondary">{value} min</Text>
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
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f5222d' }} />
          <div>
            <Text strong>{text}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>{record.site}</Text>
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Présence',
      dataIndex: 'tauxPresence',
      key: 'tauxPresence',
      render: (value) => <Text type="danger">{value}%</Text>
    },
    {
      title: 'Retards',
      dataIndex: 'totalRetards',
      key: 'totalRetards',
      render: (value) => <Badge count={value} style={{ backgroundColor: '#f5222d' }} />
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Card loading={true} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Rapport de Performance - Direction</Title>
      
      {/* KPIs Globaux */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <Tag color={kpiGlobaux.evolutionPresence >= 0 ? 'success' : 'error'}>
                  {kpiGlobaux.evolutionPresence >= 0 ? <UpOutlined /> : <DownOutlined />}
                  {Math.abs(kpiGlobaux.evolutionPresence)}%
                </Tag>
              </Space>
              <Statistic 
                title="Taux de Présence"
                value={kpiGlobaux.tauxPresence}
                precision={1}
                suffix="%"
              />
              <Text type="secondary">vs mois dernier</Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                <Avatar size={48} icon={<ClockCircleOutlined />} style={{ backgroundColor: '#52c41a' }} />
                <Tag color={kpiGlobaux.evolutionPonctualite >= 0 ? 'success' : 'error'}>
                  {kpiGlobaux.evolutionPonctualite >= 0 ? <UpOutlined /> : <DownOutlined />}
                  {Math.abs(kpiGlobaux.evolutionPonctualite)}%
                </Tag>
              </Space>
              <Statistic 
                title="Taux de Ponctualité"
                value={kpiGlobaux.tauxPonctualite}
                precision={1}
                suffix="%"
              />
              <Text type="secondary">{Math.round(kpiGlobaux.retardMoyen)} min de retard moyen</Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                <Avatar size={48} icon={<DashboardOutlined />} style={{ backgroundColor: '#722ed1' }} />
                <Tag color={kpiGlobaux.evolutionActivite >= 0 ? 'success' : 'error'}>
                  {kpiGlobaux.evolutionActivite >= 0 ? <UpOutlined /> : <DownOutlined />}
                  {Math.abs(kpiGlobaux.evolutionActivite)}%
                </Tag>
              </Space>
              <Statistic 
                title="Taux d'Activité"
                value={kpiGlobaux.tauxActivite}
                precision={1}
                suffix="%"
              />
              <Text type="secondary">Heures travaillées vs attendues</Text>
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
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Table 
          columns={columnsSites} 
          dataSource={performancesSites}
          pagination={false}
          bordered
          rowClassName={(record, index) => index < 3 ? 'ant-table-row-top' : ''}
        />
        <div style={{ marginTop: '16px' }}>
          <Tag color="gold">🏆 Top 3 performeurs</Tag>
        </div>
      </Card>

      {/* Classement des Employés */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <CrownOutlined style={{ color: '#faad14' }} />
                <span>Top Performeurs</span>
              </Space>
            }
          >
            <Table 
              columns={columnsTop} 
              dataSource={classementEmployes.topPerformeurs}
              pagination={false}
              showHeader={false}
              size="small"
            />
            {classementEmployes.topPerformeurs.length === 0 && (
              <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '20px' }}>
                Aucun top performeur ce mois-ci
              </Text>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <WarningOutlined style={{ color: '#f5222d' }} />
                <span>Agents à Problème</span>
              </Space>
            }
          >
            <Table 
              columns={columnsProbleme} 
              dataSource={classementEmployes.agentsProbleme}
              pagination={false}
              showHeader={false}
              size="small"
            />
            {classementEmployes.agentsProbleme.length === 0 && (
              <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '20px' }}>
                Aucun agent à problème identifié
              </Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Synthèse Direction */}
      <Card style={{ 
        marginTop: '24px', 
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        border: 'none'
      }}>
        <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
          Synthèse Direction
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Présence globale</span>}
              value={kpiGlobaux.tauxPresence}
              precision={1}
              suffix="%"
              valueStyle={{ color: 'white' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Ponctualité</span>}
              value={kpiGlobaux.tauxPonctualite}
              precision={1}
              suffix="%"
              valueStyle={{ color: 'white' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Top performeurs</span>}
              value={classementEmployes.topPerformeurs.length}
              valueStyle={{ color: 'white' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Agents à problème</span>}
              value={classementEmployes.agentsProbleme.length}
              valueStyle={{ color: 'white' }}
            />
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
        `}
      </style>
    </div>
  );
};

export default RapportPresencePerformance;