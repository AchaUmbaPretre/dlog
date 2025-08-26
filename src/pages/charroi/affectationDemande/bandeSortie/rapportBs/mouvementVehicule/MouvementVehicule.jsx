import { Card, Row, Col, Statistic, Tooltip, Typography, Divider, Badge } from "antd";
import {
  CarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MouvementFilter from "./mouvementFilter/MouvementFilter";
import "./mouvementVehicule.scss";
import { useEffect, useState } from "react";
import { getMouvementVehicule } from "../../../../../../services/rapportService";

const { Title } = Typography;

const MouvementVehicule = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getMouvementVehicule();
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Fonction de parsing sécurisée X / Y ---
  const parseRatio = (str) => {
    if (!str) return [0, 0];
    const parts = str.split("/").map((v) => parseInt(v.trim(), 10));
    return parts.length === 2 ? parts : [0, 0];
  };

  // --- Extraction sécurisée des valeurs ---
  const [bonsValides, totalBons] = parseRatio(data?.bons_valides);
  const [departsEffectues, totalDeparts] = parseRatio(data?.departs_effectues);
  const [retoursConfirmes, totalRetours] = parseRatio(data?.retours_confirmes);
  const [departsHorsTiming] = parseRatio(data?.departs_hors_timing);
  const [retoursHorsTiming] = parseRatio(data?.retours_hors_timing);
  const [coursesAnnulees] = parseRatio(data?.courses_annulees);
  const vehiculesHorsSite = data?.vehicules_hors_site ?? 0;

  // Couleur dynamique selon gravité
  const getColor = (label) => {
    if (label.includes("hors timing")) return "orange";
    if (label.includes("annulées")) return "red";
    if (label.includes("validés") || label.includes("effectués") || label.includes("confirmés")) return "green";
    return "blue";
  };

  // --- Statistiques principales ---
  const stats = [
    {
      title: "Bons en attente",
      value: 0,
      icon: <FileTextOutlined />,
      tooltip: "Nombre total de bons en attente de validation",
    },
    {
      title: "Véhicules hors site",
      value: vehiculesHorsSite,
      icon: <CarOutlined />,
      tooltip: "Véhicules actuellement hors site",
    },
    {
      title: "Disponibles",
      value: 0,
      icon: <CheckCircleOutlined />,
      tooltip: "Véhicules disponibles sur site",
    },
  ];

  // --- Mini statistiques ---
  const miniStats = [
    { value: `${bonsValides} / ${totalBons}`, label: "Bons validés", icon: <CheckCircleOutlined /> },
    { value: `${departsEffectues} / ${totalDeparts}`, label: "Départs effectués", icon: <CarOutlined /> },
    { value: `${retoursConfirmes} / ${totalRetours}`, label: "Retours confirmés", icon: <RollbackOutlined /> },
    { value: data?.departs_hors_timing ?? "0 / 0", label: "Départs hors timing", icon: <ClockCircleOutlined /> },
    { value: data?.retours_hors_timing ?? "0 / 0", label: "Retours hors timing", icon: <ExclamationCircleOutlined /> },
    { value: data?.courses_annulees ?? "0 / 0", label: "Courses annulées", icon: <CloseCircleOutlined /> },
  ];

  return (
    <div className="mouvement_vehicule">
      <div className="mouv_vehicule_wrapper">
        {/* Filtres */}
        <MouvementFilter />

        {/* Statistiques principales */}
        <Row gutter={[24, 24]} className="mouv_vehicule_row">
          {stats.map((stat, index) => (
            <Col xs={24} md={8} key={index}>
              <Tooltip title={stat.tooltip}>
                <Card bordered={false} className="mouv_vehicule_card">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                    valueStyle={{ fontSize: 24, fontWeight: 600 }}
                  />
                </Card>
              </Tooltip>
            </Col>
          ))}
        </Row>

        {/* Section compteur absolu */}
        <Divider />
        <Title level={4} className="mouv_h3">
          Compteur absolu
        </Title>

        <Row gutter={[16, 16]} className="mouv_cards_row">
          {miniStats.map((item, index) => (
            <Col xs={12} md={8} lg={4} key={index}>
              <Badge.Ribbon
                text={item.label.includes("hors timing") || item.label.includes("annulées") ? "⚠️" : ""}
                color={getColor(item.label)}
              >
                <Card bordered={false} className={`mini_stat_card ${getColor(item.label)}`}>
                  <div className="mini_icon">{item.icon}</div>
                  <Statistic
                    value={item.value}
                    valueStyle={{ fontSize: 20, fontWeight: 600 }}
                  />
                  <div className="mini_stat_label">{item.label}</div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default MouvementVehicule;
