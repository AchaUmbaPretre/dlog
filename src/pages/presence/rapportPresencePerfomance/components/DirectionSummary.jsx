import React from 'react';
import { Card, Row, Col, Statistic, Tag, Space, Typography } from 'antd';

const { Title } = Typography;

const DirectionSummary = ({ 
  globalColor, 
  metadata, 
  kpiGlobaux, 
  classementEmployes, 
  users 
}) => {
  return (
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
            {metadata.periode.jours_ouvrables} jours analysés
          </Tag>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Présence globale</span>}
            value={kpiGlobaux.tauxPresence}
            precision={1}
            suffix="%"
            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Ponctualité</span>}
            value={kpiGlobaux.tauxPonctualite}
            precision={1}
            suffix="%"
            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Top performeurs</span>}
            value={classementEmployes.topPerformeurs.length}
            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic 
            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Agents à problème</span>}
            value={classementEmployes.agentsProbleme.length}
            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
          />
        </Col>
      </Row>

      {/* Indicateurs supplémentaires */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Space size={[16, 8]} wrap>
            <Tag color="white" style={{ color: globalColor }}>
              ⏱ Retard moyen: {Math.round(kpiGlobaux.retardMoyen)} min
            </Tag>
            <Tag color="white" style={{ color: globalColor }}>
              📊 Total retards: {kpiGlobaux.totalRetards}
            </Tag>
            <Tag color="white" style={{ color: globalColor }}>
              💪 Heures sup: {kpiGlobaux.totalHeuresSup}h
            </Tag>
            <Tag color="white" style={{ color: globalColor }}>
              👥 Employés actifs: {users?.length || 0}
            </Tag>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default DirectionSummary;