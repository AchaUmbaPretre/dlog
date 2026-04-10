// components/DrivingBehaviorAnalysis.jsx
import { Card, Progress, Table, Tag, Timeline } from 'antd';
import { WarningOutlined, CheckCircleOutlined, CarOutlined } from '@ant-design/icons';

const DrivingBehaviorAnalysis = ({ vehicles }) => {
  // Analyser le comportement de conduite basé sur les données réelles
  const analysis = vehicles.map(v => {
    const overspeedAlerts = v.sensors?.filter(s => 
      s.type === 'textual' && s.value === 'overspeed'
    ).length || 0;
    
    const engineOnTime = v.engine_hours || 0;
    const totalDistance = v.total_distance || 0;
    
    // Score de conduite (0-100)
    let score = 100;
    if (overspeedAlerts > 0) score -= overspeedAlerts * 10;
    if (v.speed > 90) score -= 20;
    if (v.alarm === 1) score -= 15;
    
    return {
      name: v.name,
      score: Math.max(0, score),
      overspeedCount: overspeedAlerts,
      avgSpeed: v.speed,
      engineHours: engineOnTime,
      distance: totalDistance,
      riskLevel: score > 80 ? 'Sûr' : score > 60 ? 'Modéré' : 'Risqué'
    };
  });

  return (
    <Card title="📊 Analyse du comportement de conduite">
      <Table
        dataSource={analysis}
        columns={[
          { title: 'Véhicule', dataIndex: 'name' },
          { 
            title: 'Score conduite', 
            dataIndex: 'score',
            render: (score) => (
              <Progress percent={score} size="small" 
                strokeColor={score > 80 ? '#52c41a' : score > 60 ? '#faad14' : '#ff4d4f'} 
              />
            )
          },
          { 
            title: 'Excès vitesse', 
            dataIndex: 'overspeedCount',
            render: (count) => (
              <Tag color={count > 0 ? 'red' : 'green'}>
                {count} alertes
              </Tag>
            )
          },
          { title: 'Risque', dataIndex: 'riskLevel', 
            render: (risk) => (
              <Tag color={risk === 'Sûr' ? 'green' : risk === 'Modéré' ? 'orange' : 'red'}>
                {risk}
              </Tag>
            )
          }
        ]}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default DrivingBehaviorAnalysis;