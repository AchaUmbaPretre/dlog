import { Card, Table, Statistic, Row, Col, Badge, Tag, Space } from 'antd';
import { RiseOutlined, ClockCircleOutlined, CalendarOutlined, CarOutlined } from '@ant-design/icons';

const DailyActivityReport = ({ vehicles }) => {
  const today = new Date().toDateString();
  
  const activityData = vehicles.map(v => {
    const lastUpdate = new Date(v.timestamp * 1000);
    const isActiveToday = lastUpdate.toDateString() === today;
    
    const fullDate = lastUpdate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      name: v.name,
      fullDate: fullDate,
      isActive: isActiveToday,
      totalDistance: v.total_distance || 0,
      speed: v.speed
    };
  });

  const activeToday = activityData.filter(a => a.isActive).length;
  const totalDistance = activityData.reduce((acc, a) => acc + (a.totalDistance || 0), 0);

  const columns = [
    { title: 'Véhicule', dataIndex: 'name', render: (name) => <Space><CarOutlined />{name}</Space> },
    { 
      title: 'Statut', 
      dataIndex: 'isActive',
      render: (active) => <Badge status={active ? 'success' : 'default'} text={active ? 'Actif' : 'Inactif'} />
    },
    { title: 'Dernière activité', dataIndex: 'fullDate', render: (date) => <Space><CalendarOutlined />{date}</Space> },
    { title: 'Distance (km)', dataIndex: 'totalDistance', render: (d) => d?.toFixed(0) || 0 },
    { title: 'Vitesse', dataIndex: 'speed', render: (s) => <Tag color={s > 0 ? 'blue' : 'default'}>{s} km/h</Tag> }
  ];

  return (
    <Card title={`📅 Rapport d'activité - ${new Date().toLocaleDateString('fr-FR')}`} style={{ borderRadius: 12 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Statistic title="Véhicules actifs" value={activeToday} suffix={`/${vehicles.length}`} prefix={<RiseOutlined />} />
        </Col>
        <Col span={12}>
          <Statistic title="Distance totale" value={totalDistance.toFixed(0)} suffix="km" prefix={<ClockCircleOutlined />} />
        </Col>
      </Row>
      
      <Table dataSource={activityData} columns={columns} pagination={{ pageSize: 5 }} size="small" rowKey="name" />
    </Card>
  );
};

export default DailyActivityReport;