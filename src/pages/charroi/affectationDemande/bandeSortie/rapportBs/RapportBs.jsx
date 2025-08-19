import { Card, Divider, Tabs, notification, Row, Col, Statistic } from 'antd';
import './rapportBs.scss';
import { useEffect, useState } from 'react';
import PerformanceOp from './performance_op/Performance_op';
import SuiviStatutBs from './suiviStatutBs/SuiviStatutBs';
import IndicateursLog from './Indicateurs_log/Indicateurs_log';
import { getRapportBonGlobal } from '../../../../../services/rapportService';

const { TabPane } = Tabs;

const RapportBs = () => {
  const [activeKey, setActiveKey] = useState('1');
  const [globals, setGlobals] = useState({});
  const [vehicules, setVehicules] = useState([]);
  const [services, setServices] = useState([]);

  const fetchData = async () => {
    try {
      const [globalData] = await Promise.all([getRapportBonGlobal()]);
      setGlobals(globalData.data.global || {});
      setVehicules(globalData.data.repartitionVehicule || []);
      setServices(globalData.data.repartitionService || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="rapport_bs">
      <Card bordered={false} className="rapport_bs_card">
        <h2 className="rapport_h2">Rapport de Bon de sortie</h2>
        <Tabs activeKey={activeKey} onChange={setActiveKey} type="card" tabPosition="top">
          
          <TabPane tab="Volume global des activités" key="1" style={{background: "#f0f2f5", padding: 24 }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24, background: "#f0f2f5" }}>
              <Col xs={24} sm={8}>
                <Card className="kpi_card">
                  <Statistic title="Nombre total de bons de sortie" value={globals.total_bons || 0} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="kpi_card">
                  <Statistic title="Nombre total de véhicules mobilisés" value={globals.total_vehicules || 0} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="kpi_card">
                  <Statistic title="Nombre de chauffeurs impliqués" value={globals.total_chauffeurs || 0} />
                </Card>
              </Col>
            </Row>

            <Divider />

            <Card type="inner" title="Répartition par type de véhicule" className="inner_card">
              {vehicules.map((v, idx) => (
                <Row key={idx} justify="space-between" className="row_item">
                  <Col>{v.nom_cat}</Col>
                  <Col><strong>{v.nbre}</strong></Col>
                </Row>
              ))}
            </Card>

            <Card type="inner" title="Répartition par service" className="inner_card">
              {services.map((s, idx) => (
                <Row key={idx} justify="space-between" className="row_item">
                  <Col>{s.nom_service}</Col>
                  <Col><strong>{s.nbre}</strong></Col>
                </Row>
              ))}
            </Card>
          </TabPane>

          <TabPane tab="Performance opérationnelle" key="2">
            <PerformanceOp />
          </TabPane>

          <TabPane tab="Suivi des statuts" key="3">
            <SuiviStatutBs />
          </TabPane>

          <TabPane tab="Indicateurs logistiques spécifiques" key="4">
            <IndicateursLog />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default RapportBs;
