import React from "react";
import { Card, Row, Col, Statistic, Tag, Progress, Typography, Space } from "antd";
import {
  CarOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  PauseCircleOutlined
} from "@ant-design/icons";
import { formatSecondsToTime } from "../../../../../utils/formatSecondsToTime";

const { Title } = Typography;

const SummaryCard = ({ type, data }) => {
  const isMoving = type === "moving";
  const color = isMoving ? "#52c41a" : "#f5222d";

  return (
    <Col xs={24} md={12}>
      <Card
        hoverable
        bordered
        style={{ marginBottom: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      >
        <Space align="center">
          {isMoving ? (
            <CarOutlined style={{ color, fontSize: 18 }} />
          ) : (
            <PauseCircleOutlined style={{ color, fontSize: 18 }} />
          )}
          <Title level={5} style={{ margin: 0 }}>
            {isMoving ? "En mouvement" : "Inactif"} (Regroupé)
          </Title>
        </Space>

        <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
          <Col span={12}>
            <Statistic title="Distance" value={data.distance.toFixed(2)} suffix="km" prefix={<CarOutlined style={{ color }} />} />
            <Progress percent={Math.min((data.distance / 500) * 100, 100)} strokeColor={color} showInfo={false} style={{ marginTop: 8 }} />
          </Col>
          <Col span={12}>
            <Statistic title="Durée moteur" value={formatSecondsToTime(data.engine_duration)} prefix={<ThunderboltOutlined style={{ color }} />} />
            <Progress percent={Math.min((data.engine_duration / 3600) * 100, 100)} strokeColor={color} showInfo={false} style={{ marginTop: 8 }} />
          </Col>
          <Col span={12}>
            <Statistic title="Vitesse max" value={data.top_speed} suffix="km/h" prefix={<DashboardOutlined style={{ color }} />} />
          </Col>
          <Col span={12}>
            <Statistic title="Vitesse moy." value={data.avg_speed} suffix="km/h" prefix={<DashboardOutlined style={{ color }} />} />
          </Col>
        </Row>

        <Tag color={color} style={{ marginTop: 12, fontWeight: "bold" }}>
          {data.stops} {isMoving ? "arrêts" : "périodes inactives"}
        </Tag>
      </Card>
    </Col>
  );
};

export default SummaryCard;
