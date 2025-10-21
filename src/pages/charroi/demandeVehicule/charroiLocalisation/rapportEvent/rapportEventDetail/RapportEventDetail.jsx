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
} from "@ant-design/icons";
import { getConnectivityDetail } from "../../../../../../services/eventService";
import moment from "moment";
import "moment/locale/fr";
import "./rapportEventDetail.scss"; // 💅 Ajoute un style SCSS moderne

const { Title, Text } = Typography;

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
      render: (value) => (
        <Text strong>{moment(value).format("YYYY-MM-DD HH:mm:ss")}</Text>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (value) =>
        value === "connected" ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Actif
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Inactif
          </Tag>
        ),
    },
    {
      title: "Dernière Connexion",
      dataIndex: "last_connection",
      key: "last_connection",
      render: (value) =>
        value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
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
