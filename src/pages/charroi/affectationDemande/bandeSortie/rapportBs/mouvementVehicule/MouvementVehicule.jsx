import { Card, Row, Col, Statistic, Tooltip } from "antd";
import {
  CarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import MouvementFilter from "./mouvementFilter/MouvementFilter";
import "./mouvementVehicule.scss";

const MouvementVehicule = () => {
  return (
    <div className="mouvement_vehicule">
      <div className="mouv_vehicule_wrapper">
        {/* Filtres */}
        <MouvementFilter />

        {/* Statistiques */}
        <Row gutter={16} className="mouv_vehicule_row">
          <Col xs={24} sm={8}>
            <Tooltip title="Nombre total de bons en attente de validation">
              <Card bordered={false} className="mouv_vehicule_card attente">
                <Statistic
                  title="Bons en attente"
                  value={5}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Tooltip>
          </Col>

          <Col xs={24} sm={8}>
            <Tooltip title="Véhicules actuellement hors site">
              <Card bordered={false} className="mouv_vehicule_card hors_site">
                <Statistic
                  title="Véhicules hors site"
                  value={4}
                  prefix={<CarOutlined />}
                />
              </Card>
            </Tooltip>
          </Col>

          <Col xs={24} sm={8}>
            <Tooltip title="Véhicules disponibles sur site">
              <Card bordered={false} className="mouv_vehicule_card dispo">
                <Statistic
                  title="Disponibles"
                  value={2}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Tooltip>
          </Col>
        </Row>

        <h3 className="mouv_h3">Compteur absolu</h3>
        <div className="cards">
          <div className="card">
            <span>10</span>
            <span>Bons validé</span>
          </div>

          <div className="card">
            <span>10</span>
            <span>Départs effectués</span>
          </div>

          <div className="card">
            <span>10</span>
            <span>Retours confirmés</span>
          </div>

          <div className="card">
            <span>10</span>
            <span>Départs hors timing</span>
          </div>

          <div className="card">
            <span>10</span>
            <span>Retour hors timing</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MouvementVehicule;
