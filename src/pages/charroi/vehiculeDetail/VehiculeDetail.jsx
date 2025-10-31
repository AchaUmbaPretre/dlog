import { useEffect, useState } from "react";
import {
  Descriptions,
  Card,
  Image,
  Spin,
  Row,
  Col,
  notification,
  Empty,
  Typography,
  Space,
  Divider,
  Tag,
  Tooltip,
} from "antd";
import {
  CarOutlined,
  CalendarOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { getVehiculeOne } from "../../../services/charroiService";
import config from "../../../config";
import vehiculeImg from "../../../assets/vehicule.png";
import "./vehiculeDetail.scss";

const { Title, Text } = Typography;

const VehiculeDetail = ({ idVehicule }) => {
  const [loading, setLoading] = useState(true);
  const [vehicule, setVehicule] = useState(null);
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  const fetchVehiculeData = async () => {
    setLoading(true);
    try {
      const { data } = await getVehiculeOne(idVehicule);
      setVehicule(data?.data?.[0] || null);
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de récupérer les informations du véhicule.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idVehicule) fetchVehiculeData();
  }, [idVehicule]);

  if (loading) {
    return (
      <div className="vehicule-detail__loading">
        <Spin size="large" tip="Chargement du véhicule..." />
      </div>
    );
  }

  if (!vehicule) {
    return (
      <Empty
        description="Aucune information disponible pour ce véhicule"
        imageStyle={{ height: 100 }}
        style={{ padding: "80px 0" }}
      />
    );
  }

  return (
    <div className="vehicule-detail">
      <Card
        bordered={false}
        className="vehicule-detail__card"
        title={
          <Space align="center" size={10}>
            <CarOutlined className="vehicule-detail__icon" />
            <Title level={4} className="vehicule-detail__title">
              Détails du véhicule
            </Title>
          </Space>
        }
        extra={
          <Tooltip title="Informations complètes du véhicule">
            <InfoCircleOutlined className="vehicule-detail__info" />
          </Tooltip>
        }
      >
        <Row gutter={[40, 40]} align="top">
          {/* ------- IMAGE ------- */}
          <Col xs={24} md={9}>
            <div className="vehicule-detail__image-wrapper">
              <Image
                src={vehicule.img ? `${DOMAIN}/${vehicule.img}` : vehiculeImg}
                alt="Image du véhicule"
                className="vehicule-detail__image"
                preview={true}
                placeholder
              />
            </div>

            <Divider />

            <Space wrap size={[8, 8]}>
              <Tag color="blue">{vehicule.nom_marque}</Tag>
              <Tag color="green">{vehicule.nom_cat}</Tag>
              <Tag color="volcano">{vehicule.nom_couleur}</Tag>
            </Space>
          </Col>

          {/* ------- INFORMATIONS ------- */}
          <Col xs={24} md={15}>
            <Descriptions
              bordered
              column={1}
              size="middle"
              className="vehicule-detail__desc"
              labelStyle={{
                fontWeight: 600,
                width: 220,
                background: "#f9fafc",
                color: "#555",
              }}
              contentStyle={{
                background: "#fff",
                color: "#222",
              }}
            >
              <Descriptions.Item label="Modèle">{vehicule.modele}</Descriptions.Item>
              <Descriptions.Item label="Immatriculation">
                <Text strong>{vehicule.immatriculation}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Numéro de châssis">
                <Text code>{vehicule.num_chassis}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Date mise en service">
                <CalendarOutlined style={{ marginRight: 6 }} />
                {vehicule.date_service
                  ? new Date(vehicule.date_service).toLocaleDateString()
                  : "Non renseignée"}
              </Descriptions.Item>

              <Descriptions.Item label="Année de fabrication">
                {vehicule.annee_fabrication || "—"}
              </Descriptions.Item>

              <Descriptions.Item label="Année de circulation">
                {vehicule.annee_circulation || "—"}
              </Descriptions.Item>

              <Descriptions.Item label="Configuration">
                <Text>
                  {vehicule.nbre_portes} portes • {vehicule.nbre_place} places •{" "}
                  {vehicule.nbre_moteur} moteur(s)
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Caractéristiques">
                <ul className="vehicule-detail__list">
                  <li>Pneus : {vehicule.pneus || "—"}</li>
                  <li>Carburant : {vehicule.capacite_carburant || "—"} L</li>
                  <li>Carter : {vehicule.capacite_carter || "—"} L</li>
                  <li>Radiateur : {vehicule.capacite_radiateur || "—"} L</li>
                </ul>
              </Descriptions.Item>

              <Descriptions.Item label="Dimensions">
                {vehicule.longueur} × {vehicule.largeur} × {vehicule.hauteur} mm
              </Descriptions.Item>

              <Descriptions.Item label="Poids">
                <DashboardOutlined style={{ marginRight: 6 }} />
                {vehicule.poids} kg
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default VehiculeDetail;
