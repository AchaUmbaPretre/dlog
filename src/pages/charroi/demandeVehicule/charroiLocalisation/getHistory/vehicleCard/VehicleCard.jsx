import {
  CarOutlined,
  FlagOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  FireOutlined,
  RocketOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Tooltip, Typography, Badge, Space } from "antd";
import "./vehicleCard.scss";

const { Text } = Typography;

const VehicleCard = ({ vehicleData, tableData, totalDistance }) => {
  const getFuelStatus = (fuel) => {
    if (fuel > 50) return "success";
    if (fuel > 20) return "warning";
    return "error";
  };

  const getSpeedIcon = (speed) => {
    if (!speed) return <DashboardOutlined style={{ color: "#999" }} />;
    if (parseInt(speed) > 100) {
      return (
        <RocketOutlined
          style={{
            color: "#fa541c",
            marginRight: 4,
            animation: "pulseStat 1s infinite",
          }}
        />
      );
    }
    return <DashboardOutlined style={{ color: "#52c41a", marginRight: 4 }} />;
  };

  const lowFuel = vehicleData.device?.fuel_quantity < 20;
  const highSpeed =
    vehicleData.top_speed && parseInt(vehicleData.top_speed) > 100;
  const hasCriticalAlert = lowFuel || highSpeed;

  return (
    <Card
      className="vehicle-card"
      bordered={false}
      style={{
        boxShadow: hasCriticalAlert
          ? "0 0 20px rgba(250, 84, 28, 0.6)"
          : "0 6px 18px rgba(0,0,0,0.1)",
        backgroundColor: hasCriticalAlert ? "#fff7f0" : "#fff",
        animation: hasCriticalAlert ? "pulseCard 1.5s infinite" : "none",
      }}
      title={
        <Space>
          <CarOutlined style={{ color: "#fff", fontSize: 20 }} />
          <Text strong style={{ fontSize: 18, color: "#fff" }}>
            {vehicleData.device?.name || "N/A"}
          </Text>
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Row gutter={[12, 16]}>
            {/* Statut */}
            <Col span={12}>
              <Tooltip title="État du véhicule">
                <Text
                  strong
                  className={vehicleData.status ? "" : "pulseStat"}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <ThunderboltOutlined
                    style={{
                      color: vehicleData.status ? "#52c41a" : "#ff4d4f",
                      marginRight: 6,
                    }}
                  />
                  Statut:
                </Text>
                <Badge
                  status={vehicleData.status ? "success" : "error"}
                  text={vehicleData.status ? "Actif 🚀" : "Inactif ❌"}
                />
              </Tooltip>
            </Col>

            {/* Événements */}
            <Col span={12}>
              <Tooltip title="Nombre total d'événements">
                <Text strong>
                  <FlagOutlined style={{ color: "#faad14", marginRight: 6 }} />
                  Événements:
                </Text>{" "}
                {tableData.length}
              </Tooltip>
            </Col>

            {/* Distance */}
            <Col span={12}>
              <Tooltip title="Distance totale parcourue">
                <Text strong>
                  <DashboardOutlined style={{ color: "#52c41a", marginRight: 6 }} />
                  Distance:
                </Text>{" "}
                {totalDistance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}{" "}
                km
              </Tooltip>
            </Col>

            {/* Carburant restant */}
            <Col span={12}>
              <Tooltip title="Carburant restant">
                <Text
                  strong
                  className={lowFuel ? "pulseStat" : ""}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FireOutlined style={{ color: "#fa8c16", marginRight: 6 }} />
                  Carburant:
                  {lowFuel && (
                    <ExclamationCircleOutlined
                      style={{ color: "#fa541c", marginLeft: 6 }}
                    />
                  )}
                </Text>{" "}
                <Badge
                  status={getFuelStatus(vehicleData.device?.fuel_quantity || 0)}
                  text={`${vehicleData.device?.fuel_quantity || 0} L`}
                />
              </Tooltip>
            </Col>

            {/* Carburant consommé */}
            <Col span={12}>
              <Tooltip title="Carburant consommé (trajet)">
                <Text strong style={{ display: "flex", alignItems: "center" }}>
                  <FireOutlined style={{ color: "#722ed1", marginRight: 6 }} />
                  Carburant consommé:
                </Text>{" "}
                {vehicleData?.fuel_consumption || "0 L"}
              </Tooltip>
            </Col>

            {/* Vitesse max */}
            <Col span={12}>
              <Tooltip title="Vitesse maximale du jour">
                <Text
                  strong
                  className={highSpeed ? "pulseStat" : ""}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {getSpeedIcon(vehicleData.top_speed)}
                  Vitesse max:
                </Text>{" "}
                {vehicleData.top_speed ? `${vehicleData.top_speed} km/h` : "N/A"}
              </Tooltip>
            </Col>

            {/* Mouvement / arrêt */}
            <Col span={12}>
              <Tooltip title="Durée en mouvement / arrêt">
                <Text strong>
                  <LoadingOutlined style={{ color: "#1890ff", marginRight: 6 }} />
                  Mouvement: {vehicleData.move_duration || "0"} /{" "}
                  <PauseCircleOutlined
                    style={{ color: "#722ed1", margin: "0 6px" }}
                  />
                  Arrêt: {vehicleData.stop_duration || "0"}
                </Text>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default VehicleCard;
