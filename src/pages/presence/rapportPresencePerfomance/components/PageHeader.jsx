import { Row, Col, Tag, Space, Typography, Button, Tooltip, Select, DatePicker } from 'antd';
import { 
  CalendarOutlined, 
  ReloadOutlined,
  AlertOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/fr_FR';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PageHeader = ({ 
  title, 
  periode, 
  loading, 
  onReload,
  onSiteChange,
  onDateRangeChange,
  selectedSite,
  sites,
  alertThreshold = 50,
  currentValue
}) => {


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
      {/* Première ligne : Titre et alertes */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
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

        <Col>
          <Space size={16}>
            {/* Filtre par site */}
            <Space size={8}>
              <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
              <Select
                placeholder="Tous les sites"
                style={{ width: 200 }}
                onChange={onSiteChange}
                value={selectedSite}
                allowClear
                size="middle"
                dropdownStyle={{ borderRadius: '8px' }}
              >
                <Option value={null}>Tous les sites</Option>
                {sites?.map(site => (
                  <Option key={site.id_site || site.id} value={site.id_site || site.id}>
                    {site.nom_site || site.nom}
                  </Option>
                ))}
              </Select>
            </Space>

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

      {/* Deuxième ligne : Filtres de date */}
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Space size={16} wrap>
            {/* Sélecteur de période */}
            <RangePicker
              locale={locale}
              format="DD/MM/YYYY"
              value={[
                periode?.debut ? dayjs(periode.debut) : null,
                periode?.fin ? dayjs(periode.fin) : null
              ]}
              onChange={onDateRangeChange}
              allowClear={false}
              style={{ borderRadius: '30px' }}
              placeholder={['Date début', 'Date fin']}
            />

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
          </Space>
        </Col>

        <Col xs={24} md={8}>
          {/* Affichage de la période sélectionnée */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: '#fafafa',
            borderRadius: '30px',
            padding: '8px 16px',
            border: '1px solid #f0f0f0',
            width: 'fit-content',
            marginLeft: 'auto'
          }}>
            <CalendarOutlined style={{ color: '#1890ff', fontSize: '14px', marginRight: '8px' }} />
            <Text style={{ 
              fontSize: '14px',
              fontWeight: 500,
              color: '#1f1f1f'
            }}>
              {memeMois ? (
                moisDebut
              ) : (
                `${new Date(periode?.debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${new Date(periode?.fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
              )}
            </Text>
          </div>
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
          alignItems: 'center',
          flexWrap: 'wrap'
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