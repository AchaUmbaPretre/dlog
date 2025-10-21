import React from "react";
import { Card, Collapse, Timeline, Row, Col, Tag, Divider, Typography, Space } from "antd";
import {
  ThunderboltOutlined,
  StopOutlined,
  DashboardOutlined,
  CarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { formatSecondsToTime } from "../../../../../utils/formatSecondsToTime";

const { Text } = Typography;
const { Panel } = Collapse;

const EventDetailsPanel = ({ vehicleData }) => (
  <Card bordered={false} style={{ marginTop: 20 }}>
    {vehicleData.length === 0 ? (
      <Text type="secondary">Aucune donnée détaillée disponible.</Text>
    ) : (
      <Collapse defaultActiveKey={["moving", "stopped"]} ghost>
        {["moving", "stopped"].map((type) => {
          const isMoving = type === "moving";
          const color = isMoving ? "#52c41a" : "#f5222d";
          const events = vehicleData.filter((e) => (isMoving ? e.engine_work > 0 : e.engine_work === 0));

          return (
            <Panel header={`${isMoving ? "En mouvement" : "Inactif"} - ${events.length} événements`} key={type}>
              <Timeline mode="left">
                {events.map((event, idx) => (
                  <Timeline.Item key={idx} dot={isMoving ? <ThunderboltOutlined style={{ color }} /> : <StopOutlined style={{ color }} />}>
                    <Card size="small" bordered hoverable style={{ marginBottom: 10, borderLeft: `4px solid ${color}` }}>
                      <Row justify="space-between" align="middle">
                        <Col><Text strong>{event.show || event.time}</Text></Col>
                        <Col><Tag color={color}>{isMoving ? "En mouvement" : "Inactif"}</Tag></Col>
                      </Row>
                      <Divider style={{ margin: "8px 0" }} />
                      <Space direction="vertical" size={2}>
                        <Text><DashboardOutlined /> <strong>Vitesse :</strong> max {event.top_speed} km/h, moy {event.average_speed} km/h</Text>
                        <Text><CarOutlined /> <strong>Distance :</strong> {event.distance} km</Text>
                        <Text><ClockCircleOutlined /> <strong>Durée moteur :</strong> {formatSecondsToTime(event.engine_work)}</Text>
                        {event.items?.[0] && (
                          <Text>
                            <EnvironmentOutlined /> <strong>Position :</strong>{" "}
                            <a href={`https://www.google.com/maps?q=${event.items[0].lat},${event.items[0].lng}`} target="_blank" rel="noopener noreferrer">
                              Voir sur Google Maps
                            </a>
                          </Text>
                        )}
                      </Space>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Panel>
          );
        })}
      </Collapse>
    )}
  </Card>
);

export default EventDetailsPanel;
