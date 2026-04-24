import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, DatePicker, Button, Space, Select, 
  Typography, Alert, Segmented, Progress, Badge
} from 'antd';
import { 
  CarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  WarningOutlined, 
  ReloadOutlined,
  FileExcelOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  FilterOutlined,
  CalendarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './trueBonDeSortie.scss';
import { getStatistiques } from '../../../../services/controleGpsService';
import { useBonTrueData } from '../trueBonDeSortie/hooks/useBonTrueData';
import ControleTable from './components/ControleTable';

const { Title, Text } = Typography;
const { Option } = Select;

const TrueBonDeSortie = () => {
  const { data, loading, fetchData } = useBonTrueData();
  const [stats, setStats] = useState({});
  const [date, setDate] = useState(moment());
  const [statutFilter, setStatutFilter] = useState('tous');

  const fetchStats = async () => {
    try {
      const response = await getStatistiques(date.format('YYYY-MM-DD'));
      setStats(response.data || {});
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [date, data]);

  const filteredData = statutFilter === 'tous' 
    ? data 
    : data.filter(item => item.statut === statutFilter);

  const tauxConformite = stats.total > 0 
    ? ((stats.conformes / stats.total) * 100).toFixed(0) 
    : 0;

  return (
    <div className="controle-sorties-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <DashboardOutlined className="header-icon" />
          <div>
            <Title level={4} className="header-title">Contrôle des sorties</Title>
            <Text type="secondary" className="header-subtitle">
              Bons de sortie • Pointages tablette
            </Text>
          </div>
        </div>
        <Badge count={stats.sans_bon} offset={[10, -5]}>
          <Button icon={<WarningOutlined />}>Alertes</Button>
        </Badge>
      </div>

      {/* Statistiques */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card">
            <Statistic 
              title="Total sorties" 
              value={stats.total || 0} 
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card stat-card-success">
            <Statistic 
              title="Conformes" 
              value={stats.conformes || 0} 
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card stat-card-danger">
            <Statistic 
              title="Sorties sans bon" 
              value={stats.sans_bon || 0} 
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card">
            <Statistic 
              title="Non pointées" 
              value={stats.non_pointees || 0} 
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card">
            <Statistic 
              title="Bons non exécutés" 
              value={stats.bon_non_execute || 0} 
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card stat-card-score">
            <div className="score-content">
              <Progress 
                type="circle" 
                percent={tauxConformite} 
                width={50}
                strokeColor="#1890ff"
              />
              <Statistic 
                title="Conformité" 
                value={tauxConformite} 
                suffix="%" 
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Alerte */}
      {stats.sans_bon > 0 && (
        <Alert
          message={`${stats.sans_bon} sortie(s) sans bon détectée(s)`}
          description="Ces véhicules ont quitté leur zone sans bon de sortie valide."
          type="warning"
          showIcon
          closable
          className="alert-premium"
          action={
            <Button size="small" type="link" onClick={() => setStatutFilter('SORTIE_SANS_BON')}>
              Voir
            </Button>
          }
        />
      )}

      {/* Filtres */}
      <Card className="filters-card">
        <Space size="middle" wrap>
          <div className="filter-group">
            <CalendarOutlined />
            <DatePicker 
              value={date} 
              onChange={setDate}
              format="DD/MM/YYYY"
              allowClear={false}
              size="middle"
            />
          </div>
          
          <div className="filter-group">
            <FilterOutlined />
            <Select 
              style={{ width: 180 }}
              value={statutFilter}
              onChange={setStatutFilter}
            >
              <Option value="tous">Tous les statuts</Option>
              <Option value="CONFORME">Conforme</Option>
              <Option value="SORTIE_SANS_BON">Sortie sans bon</Option>
              <Option value="SORTIE_NON_POINTEE">Non pointée</Option>
              <Option value="BON_NON_EXECUTE">Bon non exécuté</Option>
            </Select>
          </div>

          <Button 
            type="primary" 
            onClick={fetchData} 
            icon={<ReloadOutlined />} 
            loading={loading}
          >
            Rafraîchir
          </Button>

          <Button icon={<FileExcelOutlined />}>
            Exporter
          </Button>
        </Space>
      </Card>

      {/* Tableau */}
      <Card className="table-cards">
        <ControleTable
          data={filteredData} 
          loading={loading} 
          onRefresh={fetchData}
        />
      </Card>
    </div>
  );
};

export default TrueBonDeSortie;