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
                  {formatDate(periode?.debut)} — {formatDate(periode?.fin)}
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
                {periode?.jours_ouvrables || 0} jours ouvrés
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

      {/* Indicateurs supplémentaires optionnels */}
      {periode && (
        <div style={{ 
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f5f5f5',
          display: 'flex',
          gap: '24px'
        }}>
          <Space size={8}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Début</Text>
            <Text strong style={{ fontSize: '13px' }}>{formatDate(periode?.debut)}</Text>
          </Space>
          <Space size={8}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Fin</Text>
            <Text strong style={{ fontSize: '13px' }}>{formatDate(periode?.fin)}</Text>
          </Space>
          <Space size={8}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Jours analysés</Text>
            <Text strong style={{ fontSize: '13px' }}>{periode?.jours_ouvrables || 0}</Text>
          </Space>
        </div>
      )}
    </div>
  );
};

export default PageHeader;