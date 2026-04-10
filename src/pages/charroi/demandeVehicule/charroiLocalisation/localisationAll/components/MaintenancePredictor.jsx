// components/MaintenancePredictor.jsx
import { Card, List, Progress, Tag, Button, Space, Badge, Statistic, Row, Col, Timeline, Modal, Alert, Divider, Tooltip, Avatar, Collapse, Table, Tabs } from 'antd';
import { 
  ToolOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  CarOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  AlertOutlined,
  HeartOutlined,
  BulbOutlined,
  LineChartOutlined,
  BellOutlined,
  SettingOutlined,
  FileTextOutlined,
  TrophyOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useState, useMemo } from 'react';

const MaintenancePredictor = ({ vehicles }) => {
  const [activeTab, setActiveTab] = useState('urgent');

  // Analyse complète des maintenances
  const maintenanceData = useMemo(() => {
    const data = vehicles.map(v => {
      const odometer = v.sensors?.find(s => s.type === 'odometer')?.val || 0;
      const engineHours = v.engine_hours || 0;
      
      // Seuils de maintenance
      const nextOilChange = 5000 - (odometer % 5000);
      const nextGeneralService = 10000 - (odometer % 10000);
      const nextTireChange = 30000 - (odometer % 30000);
      const nextBrakePad = 25000 - (odometer % 25000);
      const nextAirFilter = 15000 - (odometer % 15000);
      
      // Niveaux de criticité
      const oilStatus = nextOilChange <= 500 ? 'critical' : nextOilChange <= 1000 ? 'warning' : 'good';
      const serviceStatus = nextGeneralService <= 1000 ? 'critical' : nextGeneralService <= 2000 ? 'warning' : 'good';
      const tireStatus = nextTireChange <= 5000 ? 'warning' : 'good';
      
      const isCritical = oilStatus === 'critical' || serviceStatus === 'critical';
      const isWarning = oilStatus === 'warning' || serviceStatus === 'warning';
      
      // Score de santé (0-100)
      let healthScore = 100;
      if (oilStatus === 'critical') healthScore -= 30;
      else if (oilStatus === 'warning') healthScore -= 15;
      if (serviceStatus === 'critical') healthScore -= 25;
      else if (serviceStatus === 'warning') healthScore -= 10;
      if (tireStatus === 'warning') healthScore -= 10;
      
      return {
        id: v.id,
        name: v.name,
        odometer: Math.round(odometer),
        engineHours: Math.round(engineHours),
        nextOilChange: Math.max(0, nextOilChange),
        nextGeneralService: Math.max(0, nextGeneralService),
        nextTireChange: Math.max(0, nextTireChange),
        nextBrakePad: Math.max(0, nextBrakePad),
        nextAirFilter: Math.max(0, nextAirFilter),
        oilStatus,
        serviceStatus,
        tireStatus,
        isCritical,
        isWarning,
        healthScore: Math.max(0, healthScore),
        lastMaintenance: v.time || new Date().toISOString(),
        totalDistance: v.total_distance || 0
      };
    });

    return {
      all: data,
      critical: data.filter(v => v.isCritical),
      warning: data.filter(v => v.isWarning && !v.isCritical),
      good: data.filter(v => !v.isWarning && !v.isCritical),
      stats: {
        total: data.length,
        critical: data.filter(v => v.isCritical).length,
        warning: data.filter(v => v.isWarning && !v.isCritical).length,
        good: data.filter(v => !v.isWarning && !v.isCritical).length,
        avgHealthScore: Math.round(data.reduce((acc, v) => acc + v.healthScore, 0) / data.length)
      }
    };
  }, [vehicles]);

  const getHealthColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getHealthStatus = (score) => {
    if (score >= 80) return { text: 'Excellent', icon: <TrophyOutlined /> };
    if (score >= 60) return { text: 'Bon', icon: <CheckCircleOutlined /> };
    if (score >= 40) return { text: 'Attention', icon: <WarningOutlined /> };
    return { text: 'Critique', icon: <CloseCircleOutlined /> };
  };

  const columns = [
    {
      title: 'Véhicule',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar 
            icon={<CarOutlined />} 
            style={{ 
              background: `linear-gradient(135deg, ${getHealthColor(record.healthScore)}20, ${getHealthColor(record.healthScore)}40)`,
              color: getHealthColor(record.healthScore)
            }} 
          />
          <div>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 11, color: '#8c8c8c' }}>
              {Math.round(record.odometer / 1000)}k km
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Santé',
      dataIndex: 'healthScore',
      key: 'healthScore',
      render: (score) => (
        <div style={{ width: 80 }}>
          <Progress 
            percent={score} 
            size="small" 
            strokeColor={getHealthColor(score)}
            format={() => `${score}%`}
          />
        </div>
      )
    },
    {
      title: 'Prochaines maintenances',
      key: 'maintenances',
      render: (_, record) => (
        <Space size={4} wrap>
          {record.nextOilChange <= 1000 && (
            <Tag color={record.nextOilChange <= 500 ? 'red' : 'orange'}>
              Vidange: {record.nextOilChange} km
            </Tag>
          )}
          {record.nextGeneralService <= 2000 && (
            <Tag color={record.nextGeneralService <= 1000 ? 'red' : 'orange'}>
              Révision: {record.nextGeneralService} km
            </Tag>
          )}
          {record.nextTireChange <= 5000 && (
            <Tag color="orange">
              Pneus: {record.nextTireChange} km
            </Tag>
          )}
        </Space>
      )
    },
    {
      title: 'Urgence',
      key: 'urgent',
      render: (_, record) => (
        record.isCritical ? (
          <Tag color="red" icon={<WarningOutlined />}>Urgent</Tag>
        ) : record.isWarning ? (
          <Tag color="orange">Attention</Tag>
        ) : (
          <Tag color="green" icon={<CheckCircleOutlined />}>OK</Tag>
        )
      )
    }
  ];


  return (
    <>
      <Card 
        title={
          <Space>
            <ToolOutlined style={{ color: '#1890ff' }} />
            <span>Maintenance prédictive</span>
            <Badge count={maintenanceData.stats.critical} showZero color="#ff4d4f" />
          </Space>
        }
        style={{ borderRadius: 16, marginBottom: 16 }}
      >
        {/* Statistiques */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <div style={{ 
              background: '#f6ffed', 
              padding: 16, 
              borderRadius: 12,
              borderLeft: `4px solid ${getHealthColor(maintenanceData.stats.avgHealthScore)}`
            }}>
              <Statistic 
                title="Santé moyenne"
                value={maintenanceData.stats.avgHealthScore}
                suffix="%"
                prefix={<HeartOutlined />}
                valueStyle={{ color: getHealthColor(maintenanceData.stats.avgHealthScore) }}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ background: '#fff1f0', padding: 16, borderRadius: 12, borderLeft: '4px solid #ff4d4f' }}>
              <Statistic 
                title="Urgent" 
                value={maintenanceData.stats.critical} 
                suffix="véhicules"
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ background: '#fff7e6', padding: 16, borderRadius: 12, borderLeft: '4px solid #faad14' }}>
              <Statistic 
                title="Attention" 
                value={maintenanceData.stats.warning} 
                suffix="véhicules"
                prefix={<AlertOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ background: '#f6ffed', padding: 16, borderRadius: 12, borderLeft: '4px solid #52c41a' }}>
              <Statistic 
                title="OK" 
                value={maintenanceData.stats.good} 
                suffix="véhicules"
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </div>
          </Col>
        </Row>

        {/* Tabs pour filtrer */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'urgent',
              label: (
                <Space>
                  <WarningOutlined />
                  Urgent
                  <Badge count={maintenanceData.stats.critical} size="small" />
                </Space>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={maintenanceData.critical}
                  pagination={false}
                  size="middle"
                  rowKey="id"
                />
              )
            },
            {
              key: 'warning',
              label: (
                <Space>
                  <AlertOutlined />
                  Attention
                  <Badge count={maintenanceData.stats.warning} size="small" />
                </Space>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={maintenanceData.warning}
                  pagination={false}
                  size="middle"
                  rowKey="id"
                />
              )
            },
            {
              key: 'all',
              label: (
                <Space>
                  <CarOutlined />
                  Tous
                </Space>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={maintenanceData.all}
                  pagination={false}
                  size="middle"
                  rowKey="id"
                />
              )
            }
          ]}
        />
      </Card>
    </>
  );
};

export default MaintenancePredictor;