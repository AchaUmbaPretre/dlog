import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Typography,
  Skeleton,
} from "antd";
import {
  ClockCircleOutlined,
  ThunderboltOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getRapportPerformanceDelais } from "../../../../services/rapportService";

const { Title } = Typography;

const PerformanceM = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await getRapportPerformanceDelais();
      setData(data);
    } catch (error) {
      console.log("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;

  const columns = [
    {
      title: "Immatriculation",
      dataIndex: "immatriculation",
      key: "immatriculation",
    },
    {
      title: "Marque",
      dataIndex: "nom_marque",
      key: "nom_marque",
    },
    {
      title: "MTTR (jours)",
      dataIndex: "MTTR_jours",
      key: "MTTR_jours",
      render: (val) => (
        <span style={{ color: val > 0 ? "green" : "red", fontWeight: "bold" }}>
          {val} j
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>📊 Performance Maintenance</Title>
      <Row gutter={[16, 16]}>
        {/* KPI Cards */}
        <Col xs={24} sm={12} md={6}>
          <Card bordered className="shadow-md rounded-xl">
            <Statistic
              title="Downtime total"
              value={data?.downtimeResult?.[0]?.downtime_total_heures || 0}
              suffix="h"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered className="shadow-md rounded-xl">
            <Statistic
              title="Respect SLA"
              value={data?.respectSlaPct || 0}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <Progress
              percent={data?.respectSlaPct || 0}
              size="small"
              status="active"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered className="shadow-md rounded-xl">
            <Statistic
              title="Réparations rapides"
              value={data?.reparationsRapidesPct || 0}
              suffix="%"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <Progress
              percent={data?.reparationsRapidesPct || 0}
              size="small"
              strokeColor="#1890ff"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered className="shadow-md rounded-xl">
            <Statistic
              title="Taux de réouverture"
              value={data?.tauxReouverturePct || 0}
              suffix="%"
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <Progress
              percent={data?.tauxReouverturePct || 0}
              size="small"
              strokeColor="#faad14"
            />
          </Card>
        </Col>
      </Row>

      {/* Tableau des véhicules */}
      <Card
        title="Détails par véhicule"
        style={{ marginTop: 20 }}
        bordered
        className="shadow-md rounded-xl"
      >
        <Table
          columns={columns}
          dataSource={data?.mttrVehicule || []}
          pagination={false}
          rowKey="id_vehicule"
        />
      </Card>
    </div>
  );
};

export default PerformanceM;
