import { Card, Col, Row, Statistic, Tag, Space, Avatar, Progress, Typography } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  DashboardOutlined,
  FieldTimeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { formatDuration } from '../../../../utils/renderTooltip';

const { Text } = Typography;

const accentColors = {
  presence: '#1890ff',
  ponctualite: '#52c41a',
  activite: '#722ed1'
};

export const KPICards = ({ kpiGlobaux, globalColor, localStats }) => {
  
  const cards = [
    {
      id: 'presence',
      title: 'Présence',
      icon: <UserOutlined />,
      value: kpiGlobaux?.tauxPresence ?? 0, // Add fallback
      evolution: kpiGlobaux?.evolutionPresence ?? 0, // Add fallback
      subtext: `${localStats?.employesAbsents ?? 0} absents • ${kpiGlobaux?.absencesJustifiees ?? 0} justifiés`,
      accentColor: accentColors.presence
    },
    {
      id: 'ponctualite',
      title: 'Ponctualité',
      icon: <ClockCircleOutlined />,
      value: kpiGlobaux?.tauxPonctualite ?? 0, // Add fallback
      evolution: kpiGlobaux?.evolutionPonctualite ?? 0, // Add fallback
      subtext: (
        <>
          <FieldTimeOutlined style={{ marginRight: 4, fontSize: '12px' }} />
          {formatDuration(kpiGlobaux?.retardMoyen)} • {kpiGlobaux?.totalRetards ?? 0} retards
        </>
      ),
      accentColor: accentColors.ponctualite
    },
    {
      id: 'activite',
      title: 'Activité',
      icon: <DashboardOutlined />,
      value: kpiGlobaux?.tauxActivite ?? 0, // Add fallback
      evolution: kpiGlobaux?.evolutionActivite ?? 0, // Add fallback
      subtext: `${kpiGlobaux?.totalHeuresSup ?? 0}h supplémentaires`,
      accentColor: accentColors.activite
    }
  ];

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      {cards.map((card) => (
        <Col xs={24} sm={24} md={8} key={card.id}>
          <Card
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.2s ease'
            }}
            bodyStyle={{ padding: '16px' }}
            hoverable
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {/* En-tête compact */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <Space size={8}>
                  <Avatar 
                    size={32} 
                    icon={card.icon} 
                    style={{ 
                      backgroundColor: '#f5f5f5',
                      color: card.accentColor,
                      fontSize: '16px'
                    }} 
                  />
                  <Text style={{ 
                    color: '#1f1f1f', 
                    fontSize: '14px', 
                    fontWeight: 500
                  }}>
                    {card.title}
                  </Text>
                </Space>
                
                {/* Badge d'évolution minimal */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: '#fafafa',
                  padding: '2px 8px',
                  borderRadius: '20px'
                }}>
                  {card.evolution >= 0 ? (
                    <ArrowUpOutlined style={{ color: '#52c41a', fontSize: '10px' }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: '#f5222d', fontSize: '10px' }} />
                  )}
                  <Text style={{ 
                    color: card.evolution >= 0 ? '#52c41a' : '#f5222d',
                    fontWeight: 500,
                    fontSize: '12px'
                  }}>
                    {Math.abs(card.evolution || 0)}% {/* Add fallback */}
                  </Text>
                </div>
              </div>

              {/* Valeur principale */}
              <div>
                <Text style={{ 
                  color: '#000000', 
                  fontSize: '28px', 
                  fontWeight: 600,
                  lineHeight: 1.2
                }}>
                  {card.value !== undefined && card.value !== null ? card.value : 0}% {/* Safer check */}
                </Text>
              </div>

              {/* Barre de progression fine */}
              <div style={{ margin: '4px 0' }}>
                <div style={{
                  width: '100%',
                  height: '3px',
                  background: '#f0f0f0',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, card.value || 0)}%`, // Add fallback
                    height: '100%',
                    background: card.accentColor,
                    borderRadius: '2px',
                    transition: 'width 0.8s ease',
                    opacity: 0.8
                  }} />
                </div>
              </div>

              {/* Informations complémentaires compactes */}
              <div style={{
                marginTop: '4px',
                padding: '8px 0',
                borderTop: '1px solid #f5f5f5'
              }}>
                <Text style={{ 
                  color: '#8c8c8c', 
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    width: '4px',
                    height: '4px',
                    background: card.accentColor,
                    borderRadius: '50%'
                  }} />
                  {card.subtext}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
};