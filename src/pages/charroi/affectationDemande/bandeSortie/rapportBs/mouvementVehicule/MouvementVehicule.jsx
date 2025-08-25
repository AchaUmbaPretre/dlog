import { Card, Row, Col, Statistic, Tooltip, Typography, Divider } from "antd";
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
      setData(res); // stocke les KPIs reçus du backend
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Statistiques principales
  const stats = [
    {
      title: "Bons en attente",
      value: data ? data.total_bons - parseInt(data.bons_valides.split("/")[0]) : 0,
      icon: <FileTextOutlined />,
      tooltip: "Nombre total de bons en attente de validation",
      className: "attente",
    },
    {
      title: "Véhicules hors site",
      value: data ? data.vehicules_hors_site : 0,
      icon: <CarOutlined />,
      tooltip: "Véhicules actuellement hors site",
      className: "hors_site",
    },
    {
      title: "Disponibles",
      value: data ? data.departs_effectues - data.vehicules_hors_site : 0,
      icon: <CheckCircleOutlined />,
      tooltip: "Véhicules disponibles sur site",
      className: "dispo",
    },
  ];

  // Mini statistiques avec ratios X / Y
  const miniStats = [
    {
      value: data ? data.bons_valides : "0 / 0",
      label: "Bons validés",
      icon: <CheckCircleOutlined />,
      color: "success",
    },
    {
      value: data ? data.departs_effectues : "0 / 0",
      label: "Départs effectués",
      icon: <CarOutlined />,
      color: "blue",
    },
    {
      value: data ? data.retours_confirmes : "0 / 0",
      label: "Retours confirmés",
      icon: <RollbackOutlined />,
      color: "cyan",
    },
    {
      value: data ? data.departs_hors_timing : "0 / 0",
      label: "Départs hors timing",
      icon: <ClockCircleOutlined />,
      color: "orange",
    },
    {
      value: data ? data.retours_hors_timing : "0 / 0",
      label: "Retours hors timing",
      icon: <ExclamationCircleOutlined />,
      color: "volcano",
    },
    {
      value: data ? data.courses_annulees : "0 / 0",
      label: "Courses annulées",
      icon: <CloseCircleOutlined />,
      color: "red",
    },
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
                <Card bordered={false} className={`mouv_vehicule_card ${stat.className}`}>
                  <Statistic title={stat.title} value={stat.value} prefix={stat.icon} />
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
              <Card bordered={false} className={`mini_stat_card ${item.color}`}>
                <div className="mini_icon">{item.icon}</div>
                <span className="mini_stat_value">{item.value}</span>
                <span className="mini_stat_label">{item.label}</span>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default MouvementVehicule;
