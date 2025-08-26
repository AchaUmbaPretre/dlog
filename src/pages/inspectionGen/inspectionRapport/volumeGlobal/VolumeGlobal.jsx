import React, { useEffect, useState } from "react";
import { getRapportInspectionRep } from "../../../../services/rapportService";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Divider,
  Progress,
  Space,
} from "antd";
import {
  CarOutlined,
  ToolOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./volumeGlobal.scss";

const { Title } = Typography;

const VolumeGlobal = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await getRapportInspectionRep();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p>Chargement...</p>;

  // total pour calculer % des pannes
  const totalPannes = data.repartition_type_panne?.reduce(
    (acc, item) => acc + item.total,
    0
  );

  return (
    <div className="volumeGlobal">
      <Title level={3} className="dashboard-title">
        📊 Volume global des activités
      </Title>
      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="card-indicator blue" hoverable>
            <Statistic
              title="Réparations totales"
              value={data.total_reparations}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="card-indicator purple" hoverable>
            <Statistic
              title="cat-réparations"
              value={data.total_sous_reparations}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="card-indicator green" hoverable>
            <Statistic
              title="Véhicules inspectés"
              value={data.vehicules_inspectes}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="card-indicator orange" hoverable>
            <Statistic
              title="Taux couverture parc"
              value={data.taux_couverture_parc}
              suffix="%"
              prefix={<BarChartOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title="🔧 Répartition par type de panne" className="card-repartition">
        <Space direction="vertical" style={{ width: "100%" }}>
          {data.repartition_type_panne?.map((item) => {
            const percent = ((item.total / totalPannes) * 100).toFixed(1);
            return (
              <div key={item.id_type_reparation} className="panne-item">
                <div className="panne-header">
                  <span className="panne-type">{item.type_rep}</span>
                  <span className="panne-value">{item.total} ({percent}%)</span>
                </div>
                <Progress
                  percent={percent}
                  showInfo={false}
                  strokeColor="#1890ff"
                />
              </div>
            );
          })}
        </Space>
      </Card>
    </div>
  );
};

export default VolumeGlobal;
