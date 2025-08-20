import React, { useEffect, useState } from 'react';
import { Card, Divider, Row, Col, Statistic, Skeleton, notification } from 'antd';
import {
  FileTextOutlined,
  CarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { getRapportBonGlobal } from '../../../../../../services/rapportService';
import VehiculeBarChart from './vehiculeBarChart/VehiculeBarChart';

const VolumeGlobal = () => {
  const [globals, setGlobals] = useState({});
  const [vehicules, setVehicules] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [globalData] = await Promise.all([getRapportBonGlobal()]);
      setGlobals(globalData.data.global || {});
      setVehicules(globalData.data.repartitionVehicule || []);
      setServices(globalData.data.repartitionService || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const KPIs = [
    {
      icon: <FileTextOutlined style={{ fontSize: 40, color: '#52c41a' }} />,
      label: 'Nombre total de bons de sortie',
      value: globals.total_bons || 0,
    },
    {
      icon: <CarOutlined style={{ fontSize: 40, color: '#faad14' }} />,
      label: 'Nombre total de véhicules mobilisés',
      value: globals.total_vehicules || 0,
    },
    {
      icon: <UserOutlined style={{ fontSize: 40, color: '#eb2f96' }} />,
      label: 'Nombre de chauffeurs impliqués',
      value: globals.total_chauffeurs || 0,
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {KPIs.map((kpi, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              className="kpi_card"
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
            >
              {loading ? (
                <Skeleton active paragraph={false} />
              ) : (
                <>
                  <div style={{ marginBottom: 12 }}>{kpi.icon}</div>
                  <Statistic value={kpi.value} />
                  <div style={{ marginTop: 8, color: '#595959' }}>{kpi.label}</div>
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Répartition par type de véhicule"
            type="inner"
            className="inner_card"
            bodyStyle={{ padding: '16px 24px' }}
          >
            {loading ? (
              <Skeleton active />
            ) : vehicules.length > 0 ? (
              vehicules.map((v, idx) => (
                <Row key={idx} justify="space-between" className="row_item">
                  <Col>{v.nom_cat}</Col>
                  <Col><strong>{v.nbre}</strong></Col>
                </Row>
              ))
            ) : (
              <div>Aucune donnée disponible.</div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Répartition par service"
            type="inner"
            className="inner_card"
            bodyStyle={{ padding: '16px 24px' }}
          >
            {loading ? (
              <Skeleton active />
            ) : services.length > 0 ? (
              services.map((s, idx) => (
                <Row key={idx} justify="space-between" className="row_item">
                  <Col>{s.nom_service}</Col>
                  <Col><strong>{s.nbre}</strong></Col>
                </Row>
              ))
            ) : (
              <div>Aucune donnée disponible.</div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
            <Card
                title="Répartition par type de véhicule"
                type="inner"
                className="inner_card"
                bodyStyle={{ padding: '16px 24px' }}
            >
                {loading ? (
                <Skeleton active />
                ) : vehicules.length > 0 ? (
                <VehiculeBarChart data={vehicules} />
                ) : (
                <div>Aucune donnée disponible.</div>
                )}
            </Card>
        </Col>
        
      </Row>
    </>
  );
};

export default VolumeGlobal;
