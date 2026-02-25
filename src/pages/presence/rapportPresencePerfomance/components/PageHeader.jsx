import { Row, Col, Tag, Space, Typography } from 'antd';
import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PageHeader = ({ 
  title, 
  periode, 
  loading, 
  onReload, 
  alertThreshold = 50,
  currentValue 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (e) {
      return 'Date invalide';
    }
  };

  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
      <Col>
        <Title level={2}>
          {title}
          {currentValue < alertThreshold && (
            <Tag color="error" style={{ marginLeft: '12px' }}>
              ALERTE CRITIQUE
            </Tag>
          )}
        </Title>
      </Col>
      <Col>
        <Space>
          <Tag icon={<CalendarOutlined />} color="blue">
            {formatDate(periode?.debut)} - {formatDate(periode?.fin)}
          </Tag>
          <Tag color="geekblue">{periode?.jours_ouvrables || 0} jours ouvrés</Tag>
          <ReloadOutlined 
            onClick={onReload} 
            style={{ cursor: 'pointer', fontSize: '16px', color: '#1890ff' }} 
            spin={loading}
          />
        </Space>
      </Col>
    </Row>
  );
};

export default PageHeader;