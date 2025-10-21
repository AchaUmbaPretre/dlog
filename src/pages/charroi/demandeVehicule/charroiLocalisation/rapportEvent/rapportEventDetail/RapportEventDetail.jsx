import React, { useEffect, useState } from "react";
import {
  Table,
  notification,
  Spin,
  Typography,
  Progress,
  Card,
  Row,
  Col,
  Tag,
  Tooltip,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { getConnectivityDetail } from "../../../../../../services/eventService";
import moment from "moment";
import "moment/locale/fr";

const { Title, Text } = Typography;

// 🔹 Fonction utilitaire : format des durées
const formatDurations = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  return `${years} an${years > 1 ? "s" : ""}`;
};

const RapportEventDetail = ({ idDevice, dateRange }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const fetchData = async () => {
    if (!idDevice) return;
    setLoading(true);
    try {
      const params = {
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
        deviceId: idDevice,
      };

      const { data } = await getConnectivityDetail(params);

      if (!data) throw new Error("Aucune donnée reçue");

      setReportData(data.details || []);
      setSummary({
        device_name: data.device_name,
        taux: data.taux_connectivite_pourcent,
        score: data.score_percent,
        total_snapshots: data.total_snapshots,
        connected_snapshots: data.connected_snapshots,
      });
    } catch (err) {
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de récupérer les données du rapport",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idDevice, dateRange]);

  const columns = [
    {
      title: "Heure de Vérification",
      dataIndex: "check_time",
      key: "check_time",
      render: (value) => moment(value).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (value) =>
        value === "connected" ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Connecté
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Déconnecté
          </Tag>
        ),
    },
    {
      title: "Dernière Connexion",
      dataIndex: "last_connection",
      key: "last_connection",
      render: (value) =>
        value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : "-",
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      {summary && (
        <Card
          style={{
            borderRadius: 16,
            marginBottom: 24,
            background: "#fafafa",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Title level={4} style={{ marginBottom: 8 }}>
                {summary.device_name}
              </Title>
              <Text type="secondary">
                Période : {dateRange[0].format("DD/MM/YYYY")} -{" "}
                {dateRange[1].format("DD/MM/YYYY")}
              </Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Tooltip title="Pourcentage de snapshots connectés">
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  Taux de Connectivité
                </Text>
              </Tooltip>
              <Progress
                percent={Number(summary.taux)}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                format={(p) => `${p}%`}
              />
              <Text type="secondary">
                {summary.connected_snapshots} sur {summary.total_snapshots}{" "}
                snapshots connectés
              </Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Tooltip title="Score journalier basé sur la connectivité">
                <Text strong style={{ display: "block", marginBottom: 4 }}>
                  Score Journalier
                </Text>
              </Tooltip>
              <Progress
                percent={Number(summary.score)}
                strokeColor={{
                  "0%": "#f50",
                  "50%": "#faad14",
                  "100%": "#52c41a",
                }}
                format={(p) => `${p}%`}
              />
              <Text type="secondary">
                Niveau de performance :{" "}
                <Tag
                  color={
                    summary.score >= 75
                      ? "green"
                      : summary.score >= 50
                      ? "orange"
                      : "red"
                  }
                >
                  {summary.score}%
                </Tag>
              </Text>
            </Col>
          </Row>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin tip="Chargement des données..." size="large" />
        </div>
      ) : (
        <Table
          dataSource={reportData}
          columns={columns}
          rowKey="check_time"
          pagination={{ pageSize: 20 }}
          bordered
          size="middle"
        />
      )}
    </div>
  );
};

export default RapportEventDetail;
