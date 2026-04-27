import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Divider, Col, Statistic, DatePicker, Button, Space, Select, 
  Typography, Alert, Progress, Badge, Tooltip, Dropdown, Menu
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
  ExportOutlined,
  DownloadOutlined,
  PrinterOutlined
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

  // Menu export
  const exportMenu = (
    <Menu>
      <Menu.Item key="excel" icon={<FileExcelOutlined />}>Excel (.xlsx)</Menu.Item>
      <Menu.Item key="csv" icon={<DownloadOutlined />}>CSV</Menu.Item>
      <Menu.Item key="print" icon={<PrinterOutlined />}>Imprimer</Menu.Item>
    </Menu>
  );

  return (
    <div className="controle-sorties-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <DashboardOutlined className="header-icon" />
          <div>
            <Title level={4} className="header-title">Contrôle des sorties</Title>
            <Text type="secondary" className="header-subtitle">
              Bons de sortie • Pointages tablette • Géolocalisation Falcon
            </Text>
          </div>
        </div>
        <div className="header-right">
          <Badge count={stats.sans_bon} offset={[10, -5]}>
            <Button icon={<WarningOutlined />} className="alert-btn">
              Alertes
            </Button>
          </Badge>
        </div>
      </div>

      {/* Statistiques */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card stat-card-primary" hoverable>
            <Statistic 
              title="Total sorties" 
              value={stats.total || 0} 
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card stat-card-success" hoverable>
            <Statistic 
              title="Conformes" 
              value={stats.conformes || 0} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card stat-card-danger" hoverable>
            <Statistic 
              title="Sorties sans bon" 
              value={stats.sans_bon || 0} 
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card stat-card-warning" hoverable>
            <Statistic 
              title="Non pointées" 
              value={stats.non_pointees || 0} 
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card stat-card-info" hoverable>
            <Statistic 
              title="Bons non exécutés" 
              value={stats.bon_non_execute || 0} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="stat-card stat-card-score" hoverable>
            <div className="score-content">
              <Progress 
                type="circle" 
                percent={tauxConformite} 
                width={50}
                strokeColor="#1890ff"
                format={(percent) => `${percent}%`}
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
          message={
            <Space>
              <WarningOutlined style={{ fontSize: 16 }} />
              <span style={{ fontWeight: 'bold' }}>{stats.sans_bon} sortie(s) sans bon détectée(s)</span>
            </Space>
          }
          description="Ces véhicules ont quitté leur zone de base sans bon de sortie valide. Une régularisation est nécessaire."
          type="warning"
          showIcon
          closable
          className="alert-premium"
          action={
            <Button size="small" type="primary" ghost onClick={() => setStatutFilter('SORTIE_SANS_BON')}>
              Voir les détails
            </Button>
          }
        />
      )}

      {/* Filtres */}
      <Card className="filters-card">
        <div className="filters-header">
          <Space>
            <FilterOutlined className="filter-icon" />
            <Text strong>Filtres avancés</Text>
          </Space>
          <Button type="link" onClick={() => {
            setStatutFilter('tous');
            setDate(moment());
          }}>
            Réinitialiser
          </Button>
        </div>
        <Divider style={{ margin: '12px 0' }} />
        
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
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
                  style={{ width: 200 }}
                  value={statutFilter}
                  onChange={setStatutFilter}
                  className="status-select"
                >
                  <Option value="tous">📊 Tous les statuts</Option>
                  <Option value="CONFORME">🟢 Conforme</Option>
                  <Option value="SORTIE_SANS_BON">🔴 Sortie sans bon</Option>
                  <Option value="SORTIE_NON_POINTEE">🟠 Non pointée</Option>
                  <Option value="BON_NON_EXECUTE">🟡 Bon non exécuté</Option>
                  <Option value="SORTIE_NON_AUTORISEE">🔴 Non autorisée</Option>
                </Select>
              </div>
            </Space>
          </Col>
          
          <Col>
            <Space>
              <Tooltip title="Rafraîchir les données">
                <Button 
                  type="primary" 
                  onClick={fetchData} 
                  icon={<ReloadOutlined />} 
                  loading={loading}
                  className="action-btn"
                >
                  Rafraîchir
                </Button>
              </Tooltip>
              <Dropdown overlay={exportMenu} placement="bottomRight">
                <Button icon={<ExportOutlined />} className="action-btn">
                  Exporter
                </Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tableau */}
      <Card className="table-card">
        <div className="table-header">
          <Space>
            <DashboardOutlined className="table-header-icon" />
            <Text strong style={{ fontSize: 16 }}>Liste des sorties</Text>
            <Badge count={filteredData.length} showZero className="count-badge" />
          </Space>
        </div>
        
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