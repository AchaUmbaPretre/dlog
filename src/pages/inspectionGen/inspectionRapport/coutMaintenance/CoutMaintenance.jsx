import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Spin,
  Button,
  Space,
  message,
  Skeleton,
  Empty,
} from "antd";
import {
  ReloadOutlined,
  DownloadOutlined,
  CarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { getRapportInspectionCout } from "../../../../services/rapportService";

const { Title, Text } = Typography;

const RapportInspectionCout = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getRapportInspectionCout();
      setData(res.data || null);
    } catch (error) {
      console.error("Erreur API :", error);
      message.error("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columnsTopVehicules = [
    {
      title: "Immatriculation",
      dataIndex: "immatriculation",
      key: "immatriculation",
    },
    { title: "Marque", dataIndex: "nom_marque", key: "nom_marque" },
    {
      title: "Coût cumulé (USD)",
      dataIndex: "cout_cumule",
      key: "cout_cumule",
      render: (val) => (
        <Text strong style={{ color: "#1890ff" }}>
          {val?.toLocaleString()} $
        </Text>
      ),
    },
    { title: "Nb Interv.", dataIndex: "nb_interventions", key: "nb_interventions" },
  ];

  const kpiCardStyle = (gradient) => ({
    borderRadius: 20,
    background: gradient,
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    padding: "14px",
    position: "relative",
    overflow: "hidden",
  });

  const kpiIconStyle = {
    fontSize: 42,
    background: "rgba(255,255,255,0.25)",
    borderRadius: "50%",
    padding: 12,
    marginRight: 16,
  };

  return (
    <Spin spinning={loading} tip="Chargement des données..." size="large">
      <div style={{ padding: 20 }}>
        <Row gutter={[24, 24]}>
          {/* Header actions */}
          <Col span={24} style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={3} style={{ margin: 0 }}>
              📊 Rapport Coûts Inspection
            </Title>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchData}
                type="default"
                ghost
              >
                Rafraîchir
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => message.success("Export lancé !")}
              >
                Exporter
              </Button>
            </Space>
          </Col>

          {/* KPIs */}
          <Col xs={24} sm={12} md={12}>
            <Card
              hoverable
              style={kpiCardStyle("linear-gradient(135deg, #6e8efb, #a777e3)")}
            >
              <Space align="center">
                <CarOutlined style={kpiIconStyle} />
                <div>
                  <Title level={4} style={{ color: "#fff", marginBottom: 4 }}>
                    Coût Total
                  </Title>
                  {loading ? (
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                  ) : (
                    <Text strong style={{ fontSize: 26 }}>
                      {data?.cout_total_usd?.toLocaleString()} USD
                    </Text>
                  )}
                </div>
              </Space>
              <div className="kpi-hover-overlay" />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <Card
              hoverable
              style={kpiCardStyle("linear-gradient(135deg, #43e97b, #38f9d7)")}
            >
              <Space align="center">
                <DollarOutlined style={kpiIconStyle} />
                <div>
                  <Title level={4} style={{ color: "#fff", marginBottom: 4 }}>
                    Coût Moyen / Intervention
                  </Title>
                  {loading ? (
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                  ) : (
                    <Text strong style={{ fontSize: 26 }}>
                      {data?.cout_moyen_par_intervention?.toLocaleString()} USD
                    </Text>
                  )}
                </div>
              </Space>
              <div className="kpi-hover-overlay" />
            </Card>
          </Col>

          {/* Graphiques */}
          <Col xs={24} md={12}>
            <Card
              title="Coût par type de véhicule"
              bordered={false}
              style={{
                borderRadius: 18,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ height: 360 }}>
                {!loading && data?.cout_par_type_vehicule?.length ? (
                  <ResponsiveBar
                    data={data.cout_par_type_vehicule.map((item) => ({
                      type: item.nom_cat,
                      valeur: item.cout_total,
                    }))}
                    keys={["valeur"]}
                    indexBy="type"
                    margin={{ top: 40, right: 20, bottom: 60, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: "set2" }}
                    axisBottom={{ tickRotation: -30 }}
                    animate
                    motionConfig="wobbly"
                  />
                ) : (
                  <Empty description="Pas de données" />
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title="Coût par type de panne"
              bordered={false}
              style={{
                borderRadius: 18,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ height: 360 }}>
                {!loading && data?.cout_par_type_panne?.length ? (
                    <ResponsiveBar
                    data={data.cout_par_type_panne.map((item) => ({
                        type: item.type_rep,
                        valeur: item.cout_total,
                    }))}
                    keys={["valeur"]}
                    indexBy="type"
                    margin={{ top: 40, right: 20, bottom: 80, left: 60 }}
                    padding={0.6}   // 👈 plus la valeur est grande, plus les barres sont espacées
                    colors={{ scheme: "set3" }}
                    axisBottom={{
                        tickRotation: -45,
                        tickPadding: 10,
                    }}
                    animate
                    motionConfig="wobbly"
                    />
                ) : (
                  <Empty description="Pas de données" />
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title="Répartition Pièces vs Main d’œuvre"
              bordered={false}
              style={{
                borderRadius: 18,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ height: 320 }}>
                {!loading ? (
                  <ResponsivePie
                    data={[
                      {
                        id: "Pièces",
                        label: "Pièces",
                        value:
                          data?.repartition_pieces_manoeuvre?.pct_pieces || 0,
                      },
                      {
                        id: "Main d’œuvre",
                        label: "Main d’œuvre",
                        value:
                          data?.repartition_pieces_manoeuvre?.pct_manoeuvre ||
                          0,
                      },
                    ]}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    innerRadius={0.6}
                    padAngle={1.2}
                    cornerRadius={8}
                    colors={{ scheme: "paired" }}
                    arcLinkLabelsSkipAngle={10}
                    animate
                    motionConfig="wobbly"
                  />
                ) : (
                  <Skeleton active paragraph={{ rows: 6 }} />
                )}
              </div>
            </Card>
          </Col>

          {/* Top 10 Table */}
          <Col xs={24} md={12}>
            <Card
              title="Top 10 Véhicules les plus coûteux"
              bordered={false}
              style={{
                borderRadius: 18,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              {data?.top_10_vehicules_cout?.length ? (
                <Table
                  dataSource={data.top_10_vehicules_cout.map((v) => ({
                    key: v.id_vehicule,
                    ...v,
                  }))}
                  columns={columnsTopVehicules}
                  pagination={false}
                  size="middle"
                  bordered
                  rowClassName={() => "hover-row"}
                />
              ) : (
                <Empty description="Pas de données" />
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* Custom styles */}
      <style>{`
        .hover-row:hover {
          background: linear-gradient(90deg, #e6f7ff, #f0f5ff);
        }
        .ant-card-hoverable:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 28px rgba(0,0,0,0.18);
        }
        .kpi-hover-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(255,255,255,0.08);
          opacity: 0;
          transition: opacity 0.4s;
          border-radius: 20px;
        }
        .ant-card-hoverable:hover .kpi-hover-overlay {
          opacity: 1;
        }
      `}</style>
    </Spin>
  );
};

export default RapportInspectionCout;
