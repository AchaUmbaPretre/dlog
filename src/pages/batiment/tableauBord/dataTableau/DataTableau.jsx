import React, { useEffect, useState } from 'react';
import './dataTableau.scss';
import { getTableauOne } from '../../../../services/batimentService';
import { notification, Card, Row, Col, Spin, Badge } from 'antd';
import { ToolOutlined, ApartmentOutlined, CheckCircleOutlined,BankOutlined, SettingOutlined, WarningOutlined } from '@ant-design/icons';

const DataTableau = ({ idBatiment }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [nameBatiment, setNameBatiment] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getTableauOne(idBatiment);
      setData(data[0]);
      setNameBatiment(data[0].nom_batiment)
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
  }, [idBatiment]);

  const renderDataCards = () => (
    <Row gutter={[16, 16]} justify="center" className="data-cards">
      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_equipement || 0} showZero>
            <ToolOutlined style={{ fontSize: '40px', color: '#1890ff', marginBottom: '10px' }} />
          </Badge>
          <h3>Total Équipements</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_operationnel || 0} showZero>
            <CheckCircleOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '10px' }} />
          </Badge>
          <h3>Opérationnels</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_entretien || 0} showZero>
            <SettingOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '10px' }} />
          </Badge>
          <h3>En Entretien</h3>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_enpanne || 0} showZero>
            <WarningOutlined style={{ fontSize: '40px', color: '#f5222d', marginBottom: '10px' }} />
          </Badge>
          <h3>En Panne</h3>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_enpanne || 0} showZero>
            <ApartmentOutlined style={{ fontSize: '40px', color: 'blue', marginBottom: '10px' }} />
          </Badge>
          <h3>Niveau</h3>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          className="data-card"
          hoverable
          style={{ textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
        >
          <Badge count={data.nbre_enpanne || 0} showZero>
            <BankOutlined style={{ fontSize: '40px', color: 'black', marginBottom: '10px' }} />
          </Badge>
          <h3>Dénomination</h3>
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

export default DataTableau;
