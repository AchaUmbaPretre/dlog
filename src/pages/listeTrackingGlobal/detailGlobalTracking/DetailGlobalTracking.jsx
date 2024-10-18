import { notification, Spin, Card, Col, Row, Typography } from 'antd';
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
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Aucune donnée disponible.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Détails du Suivi</Title>
      <Row gutter={[16, 16]}>
        {data.map(item => (
          <Col span={8} key={item.id_suivi}>
            <Card
              title={item.nom_tache}
              bordered={true}
              style={{ borderRadius: '8px' }}
            >
              <Text strong>Commentaire :</Text>
              <p>{item.commentaire}</p>
              <Text strong>Status :</Text>
              <p>
                <Text type="success">{item.nom_type_statut}</Text>
              </p>
              <Text strong>Pourcentage d'avancement :</Text>
              <p>{item.pourcentage_avancement}%</p>
              <Text strong>Effectué par :</Text>
              <p>{item.nom}</p>
              <Text strong>Date de suivi :</Text>
              <p>{new Date(item.date_suivi).toLocaleString()}</p>
              <Text strong>Terminé :</Text>
              <p>{item.est_termine}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DetailGlobalTracking;
