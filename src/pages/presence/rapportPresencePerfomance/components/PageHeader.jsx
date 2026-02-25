import { Row, Col, Tag, Space, Typography, Button, Tooltip } from 'antd';
import { 
  CalendarOutlined, 
  ReloadOutlined,
  AlertOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const PageHeader = ({ 
  title, 
  periode, 
  loading, 
  onReload, 
  onPrevPeriod,
  onNextPeriod,
  alertThreshold = 50,
  currentValue 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return '—';
    }
  };

  // Fonction pour formater le mois et l'année
  const formatMonthYear = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  const moisDebut = formatMonthYear(periode?.debut);
  const moisFin = formatMonthYear(periode?.fin);
  const memeMois = moisDebut === moisFin;

  return (
    <div style={{ 
      marginBottom: '24px',
      padding: '16px 20px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      border: '1px solid #f0f0f0'
    }}>
      <Row justify="space-between" align="middle">
        {/* Titre et alerte */}
        <Col>
          <Space size="middle" align="center">
            <Title level={3} style={{ 
              margin: 0, 
              fontSize: '20px',
              fontWeight: 500,
              color: '#1f1f1f'
            }}>
              {title}
            </Title>
            {currentValue < alertThreshold && (
              <Tag 
                icon={<AlertOutlined />} 
                color="error" 
                style={{ 
                  margin: 0,
                  padding: '4px 12px',
                  borderRadius: '30px',
                  fontWeight: 500,
                  fontSize: '12px',
                  border: 'none'
                }}
              >
                ALERTE CRITIQUE
              </Tag>
            )}
          </Space>
        </Col>

        {/* Contrôles de période */}
        <Col>
          <Space size={16}>
            {/* Période avec navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fafafa',
              borderRadius: '30px',
              padding: '2px',
              border: '1px solid #f0f0f0'
            }}>
              <Button 
                type="text"
                icon={<LeftOutlined />}
                size="small"
                onClick={onPrevPeriod}
                style={{ 
                  border: 'none',
                  color: '#8c8c8c'
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 12px'
              }}>
                <CalendarOutlined style={{ color: '#1890ff', fontSize: '14px' }} />
                <Text style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1f1f1f'
                }}>
                  {memeMois ? (
                    // Si même mois : "Janvier 2026"
                    moisDebut
                  ) : (
                    // Si mois différents : "31 Jan - 27 Fév 2026"
                    `${new Date(periode?.debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${new Date(periode?.fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
                  )}
                </Text>
              </div>
              <Button 
                type="text"
                icon={<RightOutlined />}
                size="small"
                onClick={onNextPeriod}
                style={{ 
                  border: 'none',
                  color: '#8c8c8c'
                }}
              />
            </div>

            {/* Badge jours ouvrés */}
            <div style={{
              background: '#f0f5ff',
              padding: '4px 12px',
              borderRadius: '30px',
              border: '1px solid #d6e4ff'
            }}>
              <Text style={{ 
                fontSize: '13px',
                fontWeight: 500,
                color: '#1890ff'
              }}>
                {periode?.jours_ouvrables || 0} jours
              </Text>
            </div>

            {/* Bouton rechargement */}
            <Tooltip title="Actualiser">
              <Button 
                type="text"
                icon={<ReloadOutlined spin={loading} />}
                onClick={onReload}
                style={{ 
                  color: '#8c8c8c',
                  fontSize: '16px'
                }}
              />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      {/* Indicateurs supplémentaires */}
      {periode && (
        <div style={{ 
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f5f5f5',
          display: 'flex',
          gap: '24px',
          alignItems: 'center'
        }}>
          <Space size={8}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Du</Text>
            <Text strong style={{ fontSize: '13px' }}>
              {new Date(periode?.debut).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </Space>
          <Space size={8}>
            <Text type="secondary" style={{ fontSize: '12px' }}>au</Text>
            <Text strong style={{ fontSize: '13px' }}>
              {new Date(periode?.fin).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </Space>
          <Space size={8}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Durée</Text>
            <Text strong style={{ fontSize: '13px', color: '#1890ff' }}>
              {periode?.jours_ouvrables} jours
            </Text>
          </Space>
          {periode?.jours_ouvrables === 28 && (
            <Tag color="processing" style={{ marginLeft: '8px' }}>
              Mois complet
            </Tag>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;