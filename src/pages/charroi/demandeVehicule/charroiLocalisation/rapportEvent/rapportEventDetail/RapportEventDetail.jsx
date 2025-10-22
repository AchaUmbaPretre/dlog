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
  Space,
  Divider,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  WifiOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { getConnectivityDetail } from "../../../../../../services/eventService";
import moment from "moment-timezone";
import "moment/locale/fr";
import "./rapportEventDetail.scss"; // 💅 Ajoute un style SCSS moderne

const { Title, Text } = Typography;

const RapportEventDetail = ({ idDevice, dateRange }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
console.log(
  moment.utc("2025-10-21T22:00:00.000Z").tz("Africa/Kinshasa").format()
);
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

const { Text } = Typography;

const columns = [
  {
    title: "#",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 60,
    render: (text, record, index) => (
      <Text strong style={{ color: "#bfbfbf" }}>
        {index + 1}
      </Text>
    ),
  },
  {
    title: (
      <span>
        <ClockCircleOutlined style={{ color: "#1890ff", marginRight: 6 }} />
        Heure de Vérification
      </span>
    ),
    dataIndex: "check_time",
    key: "check_time",
    render: (value) => (
      <Tooltip title="Heure à laquelle la vérification a été effectuée">
        <Text strong >
          {moment.utc(value).add(2, "hours").format("YYYY-MM-DD HH:mm:ss")}
        </Text>
      </Tooltip>
    ),
  },
  {
    title: (
      <span>
        <WifiOutlined style={{ color: "#13c2c2", marginRight: 6 }} />
        Statut
      </span>
    ),
    dataIndex: "status",
    key: "status",
    render: (value) =>
      value === "connected" ? (
        <Tag
          icon={<CheckCircleOutlined />}
          color="success"
          style={{
            fontSize: 14,
            padding: "4px 10px",
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          Actif
        </Tag>
      ) : (
        <Tag
          icon={<CloseCircleOutlined />}
          color="error"
          style={{
            fontSize: 14,
            padding: "4px 10px",
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          Inactif
        </Tag>
      ),
  },
  {
    title: (
      <span>
        <CalendarOutlined style={{ color: "#faad14", marginRight: 6 }} />
        Dernière Connexion
      </span>
    ),
    dataIndex: "last_connection",
    key: "last_connection",
    render: (value) =>
      value ? (
        <Tooltip title="Date et heure de la dernière connexion">
          <Text type="secondary">
            {moment.utc(value).add(2, "hours").format("YYYY-MM-DD HH:mm:ss")}
          </Text>
        </Tooltip>
      ) : (
        <Text type="secondary">
          -
        </Text>
      ),
  }
];


  return (
    <div className="rapport-container">
      {summary && (
        <Card className="rapport-summary-card">
          <Row gutter={[32, 16]} align="middle" justify="space-between">
            <Col xs={24} md={8}>
              <div className="rapport-title">
                <ThunderboltOutlined className="rapport-icon" />
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {summary.device_name}
                  </Title>
                  <Text type="secondary">
                    {dateRange[0].format("DD/MM/YYYY")} →{" "}
                    {dateRange[1].format("DD/MM/YYYY")}
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <Tooltip title="Pourcentage de snapshots connectés">
                <Text strong>Taux de Connectivité</Text>
              </Tooltip>
              <Progress
                percent={Number(summary.taux)}
                strokeWidth={10}
                strokeColor={{
                  "0%": "#00bcd4",
                  "100%": "#4caf50",
                }}
                format={(p) => `${p}%`}
              />
              <Text type="secondary">
                {summary.connected_snapshots} sur {summary.total_snapshots}{" "}
                snapshots connectés
              </Text>
            </Col>

            <Col xs={24} md={8}>
              <Tooltip title="Score journalier basé sur la connectivité">
                <Text strong>Score Journalier</Text>
              </Tooltip>
              <Progress
                percent={Number(summary.score)}
                strokeWidth={10}
                strokeColor={{
                  "0%": "#f50",
                  "50%": "#faad14",
                  "100%": "#52c41a",
                }}
                format={(p) => `${p}%`}
              />
              <Space size={6} style={{ marginTop: 4 }}>
                <DashboardOutlined />
                <Tag
                  color={
                    summary.score >= 75
                      ? "green"
                      : summary.score >= 50
                      ? "orange"
                      : "red"
                  }
                >
                  {summary.score >= 75
                    ? "Excellente"
                    : summary.score >= 50
                    ? "Moyenne"
                    : "Faible"}
                </Tag>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      <Divider style={{ margin: "20px 0" }} />

      {loading ? (
        <div className="rapport-loading">
          <Spin tip="Chargement des données..." size="large" />
        </div>
      ) : (
        <Card
          bordered={false}
          className="rapport-table-card"
          title={<Text strong>Historique des Snapshots</Text>}
        >
          <Table
            dataSource={reportData}
            columns={columns}
            rowKey="check_time"
            pagination={{ pageSize: 10 }}
            bordered={false}
            size="middle"
          />
        </Card>
      )}
    </div>
  );
};

export default RapportEventDetail;
