import React, { useEffect, useState } from "react";
import { Timeline, Card, Typography, Tag } from "antd";
import {
  CarOutlined,
  ClockCircleOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import "./modelEvenementLive.scss";

const { Text } = Typography;

const ModelEvenementLive = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Simulation d’événements en temps réel
    const mockEvents = [
      {
        id: 1,
        time: "08:15",
        status: "Départ",
        immatriculation: "ABC-123",
        destination: "TFCE BUREAU",
      },
      {
        id: 2,
        time: "09:45",
        status: "Départ",
        immatriculation: "XYZ-987",
        destination: "CENTRE VILLE, Gombe (divers)",
      },
      {
        id: 3,
        time: "11:30",
        status: "Départ",
        immatriculation: "DEF-456",
        destination: "Matadi",
      },
      {
        id: 4,
        time: "11:45",
        status: "Départ",
        immatriculation: "DEF-400",
        destination: "Kinkole",
      },
    ];
    setEvents(mockEvents);
  }, []);

  const getIcon = (status) => {
    switch (status) {
      case "Départ":
        return <CarOutlined style={{ color: "#1890ff" }} />;
      case "En route":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "Arrivé":
        return <FlagOutlined style={{ color: "#52c41a" }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getTagColor = (status) => {
    switch (status) {
      case "Départ":
        return "blue";
      case "En route":
        return "orange";
      case "Arrivé":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <div className="modelEvenementLive">
      <Card
        title="🚦 Fil d'évènements live"
        bordered={false}
        className="event-card"
      >
        <Timeline mode="left">
          {events.map((event) => (
            <Timeline.Item key={event.id} dot={getIcon(event.status)}>
              <div className="event-item">
                <Text strong>{event.time}</Text>{" "}
                <Tag color={getTagColor(event.status)}>{event.status}</Tag>
                <br />
                <Text type="secondary">
                  🚘 {event.immatriculation} → 📍 {event.destination}
                </Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default ModelEvenementLive;
