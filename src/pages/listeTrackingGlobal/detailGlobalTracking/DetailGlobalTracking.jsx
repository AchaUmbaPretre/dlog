import { notification, Spin, Card, Col, Row, Typography, Tag, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getSuiviTacheUne } from '../../../services/suiviService';

const { Title, Text } = Typography;

const DetailGlobalTracking = ({ idTrack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await getSuiviTacheUne(idTrack);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idTrack]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem' }}>Aucune donnée disponible.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem', color: '#333' }}>Détails du Suivi</Title>
      <Divider />
      <Row gutter={[24, 24]} justify="center" style={{ width: '100%' }}>
        {data.map(item => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id_suivi}>
            <Card
              title={<Text strong style={{ fontSize: '1.3rem', color: '#007bff' }}>{item.nom_tache}</Text>}
              bordered={false}
              hoverable
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s',
                width: '100%', // Ensure the card takes full width
              }}
              bodyStyle={{ padding: '20px', minHeight: '250px' }} // Added minHeight for better layout
            >
              <Text strong style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <UserOutlined style={{ marginRight: '8px', color: '#555' }} /> Effectué par :
              </Text>
              <p style={{ margin: 0, fontSize: '1rem', color: '#555' }}>{item.nom}</p>
              
              <Text strong style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <ClockCircleOutlined style={{ marginRight: '8px', color: '#555' }} /> Date de suivi :
              </Text>
              <p style={{ margin: 0, fontSize: '1rem', color: '#555' }}>{new Date(item.date_suivi).toLocaleString()}</p>
              
              <Text strong style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <CheckCircleOutlined style={{ marginRight: '8px', color: '#555' }} /> Statut :
              </Text>
              <p style={{ margin: 0 }}>
                <Tag color={item.est_termine === 'Oui' ? 'green' : 'volcano'}>
                  {item.nom_type_statut}
                </Tag>
              </p>
              
              <Text strong style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <EditOutlined style={{ marginRight: '8px', color: '#555' }} /> Commentaire :
              </Text>
              <p style={{ margin: 0, fontSize: '1rem', color: '#555', wordWrap: 'break-word' }}>
                {item.commentaire} {/* Allow comment to wrap */}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DetailGlobalTracking;
