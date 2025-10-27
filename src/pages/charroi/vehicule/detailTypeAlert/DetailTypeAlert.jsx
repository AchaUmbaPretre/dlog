import React, { useEffect, useState } from "react";
import { getDetailAlerteType } from "../../../../services/eventService";
import {
  Card,
  Tag,
  Space,
  Tooltip,
  Typography,
  Spin,
  Empty,
  Modal,
  Button,
  Row,
  Col,
} from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  WifiOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  WarningOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const DetailTypeAlert = ({ idVehicule }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await getDetailAlerteType(idVehicule);
      setData(data || []);
    } catch (error) {
      console.error("❌ Erreur récupération alertes :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idVehicule) fetchData();
  }, [idVehicule]);

  const getStatusTag = (status) =>
    status === "connected" ? (
      <Tag icon={<WifiOutlined />} color="green">
        Connecté
      </Tag>
    ) : (
      <Tag icon={<CloseCircleOutlined />} color="volcano">
        Déconnecté
      </Tag>
    );

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case "overspeed":
        return "red";
      case "lowBattery":
        return "orange";
      case "fuelLeak":
        return "volcano";
      case "powerCut":
        return "red";
      default:
        return "green";
    }
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case "overspeed":
        return <ThunderboltOutlined />;
      case "lowBattery":
        return <WarningOutlined />;
      case "fuelLeak":
        return <WarningOutlined />;
      case "powerCut":
        return <StopOutlined />;
      default:
        return <CheckCircleOutlined />;
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <Card
      title={
        <Space>
          <ThunderboltOutlined style={{ color: "#1890ff" }} />
          <Text strong style={{ fontSize: 16 }}>
            Dernières positions et alertes du traceur
          </Text>
        </Space>
      }
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        marginTop: 10,
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" tip="Chargement des données..." />
        </div>
      ) : data.length === 0 ? (
        <Empty
          description="Aucune donnée disponible pour ce véhicule"
          imageStyle={{ height: 100 }}
        />
      ) : (
        <>
          {/* Timeline horizontale miniature */}
          <Row gutter={12} style={{ marginBottom: 16 }}>
            {data.map((item, index) => (
              <Col key={index}>
                <Tooltip
                  title={
                    <>
                      <div><strong>Date :</strong> {item.date_heure}</div>
                      <div><strong>Statut :</strong> {item.statut}</div>
                      <div><strong>Alerte :</strong> {item.alerte || "OK"}</div>
                      <div><strong>Position :</strong> {item.position || "N/A"}</div>
                      <div style={{ fontStyle: "italic" }}>Cliquez pour détails</div>
                    </>
                  }
                >
                  <div
                    onClick={() => openModal(item)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      backgroundColor: getAlertColor(item.alerte),
                      border: item.statut === "connected" ? "2px solid #52c41a" : "2px solid #ff4d4f",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.4)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </Tooltip>
              </Col>
            ))}
          </Row>

          {/* Cartes détaillées */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.map((item, index) => (
              <Card
                key={index}
                size="small"
                style={{
                  borderRadius: 10,
                  background: index === 0 ? "#f0f5ff" : "#ffffff",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                }}
              >
                <Space direction="vertical" style={{ width: "100%", gap: 8 }}>
                  <Space
                    align="center"
                    style={{ justifyContent: "space-between", width: "100%" }}
                  >
                    <Text strong style={{ fontSize: 15 }}>
                      {item.device_name}
                    </Text>
                    {getStatusTag(item.statut)}
                  </Space>

                  <Space wrap>
                    <Tooltip title="Date et heure">
                      <Tag icon={<ClockCircleOutlined />} color="blue">
                        {item.date_heure}
                      </Tag>
                    </Tooltip>

                    <Tooltip title="Position GPS">
                      {item.position !== "N/A" ? (
                        <Button
                          type="link"
                          icon={<EnvironmentOutlined />}
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps?q=${item.position}`,
                              "_blank"
                            )
                          }
                          style={{ padding: 0 }}
                        >
                          {item.position}
                        </Button>
                      ) : (
                        <Tag color="default">Position inconnue</Tag>
                      )}
                    </Tooltip>

                    <Tag icon={getAlertIcon(item.alerte)} color={getAlertColor(item.alerte)}>
                      {item.alerte || "OK"}
                    </Tag>
                  </Space>
                </Space>
              </Card>
            ))}
          </div>

          {/* Modal détails */}
          {selectedItem && (
            <Modal
              visible={modalVisible}
              title={`Détails du traceur ${selectedItem.device_name}`}
              onCancel={closeModal}
              footer={[
                <Button key="close" onClick={closeModal}>
                  Fermer
                </Button>,
              ]}
              centered
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text><strong>Date :</strong> {selectedItem.date_heure}</Text>
                <Text><strong>Statut :</strong> {selectedItem.statut}</Text>
                <Text><strong>Alerte :</strong> {selectedItem.alerte || "OK"}</Text>
                <Text><strong>Position :</strong> {selectedItem.position || "N/A"}</Text>
                {selectedItem.position && selectedItem.position !== "N/A" && (
                  <Button
                    type="primary"
                    icon={<EnvironmentOutlined />}
                    onClick={() =>
                      window.open(`https://www.google.com/maps?q=${selectedItem.position}`, "_blank")
                    }
                  >
                    Voir sur la carte
                  </Button>
                )}
              </Space>
            </Modal>
          )}
        </>
      )}
    </Card>
  );
};

export default DetailTypeAlert;
