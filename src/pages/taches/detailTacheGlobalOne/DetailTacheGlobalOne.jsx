import React, { useEffect, useState } from 'react';
import './detailTacheGlobalOne.scss';
import { notification, Card, Row, Col, Spin, Badge } from 'antd';
import { InfoCircleOutlined, HistoryOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';

const DetailTacheGlobalOne = ({ idTache }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [nameBatiment, setNameBatiment] = useState('');


  const fetchData = async () => {
    try {
      // Uncomment and use this once your data fetching logic is ready
      // const { data } = await getTableauOne(idBatiment);
      // setData(data[0]);
      // setNameBatiment(data[0].nom_batiment)
      // setLoading(false);
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
  }, [idTache]);

  const renderDataCards = () => (
    <Row gutter={[16, 16]} justify="center" className="data-cards">
      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_info || 0} showZero>
            <InfoCircleOutlined style={{ fontSize: '40px', color: '#1890ff', marginBottom: '10px' }} />
          </Badge>
          <h3>Infos Générales</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_tracking || 0} showZero>
            <HistoryOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '10px' }} />
          </Badge>
          <h3>Tracking</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_documents || 0} showZero>
            <FileTextOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '10px' }} />
          </Badge>
          <h3>Documents</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_timing || 0} showZero>
            <ClockCircleOutlined style={{ fontSize: '40px', color: '#f5222d', marginBottom: '10px' }} />
          </Badge>
          <h3>Timing</h3>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="dataTableau">
        <div className="title_row">
            <h1 className="title_h1"> { nameBatiment ? `Rapport de ${nameBatiment}` : ''}</h1>
        </div>
      {loading ? (
        <div className="spinner-container">
          <Spin size="large" />
        </div>
      ) : (
        renderDataCards()
      )}
    </div>
  );
};

export default DetailTacheGlobalOne;
