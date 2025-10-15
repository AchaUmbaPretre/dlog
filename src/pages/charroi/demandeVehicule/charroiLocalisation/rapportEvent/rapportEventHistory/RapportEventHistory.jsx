import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Button,
  Timeline,
  Spin,
  message,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Typography,
  Divider,
  Statistic,
} from "antd";
import {
  ClockCircleOutlined,
  CarOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  DashboardOutlined,
  CalendarOutlined,
  StopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getEventHistory } from "../../../../../../services/rapportService";
import config from "../../../../../../config";
import "./rapportEventHistory.scss";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const RapportEventHistory = ({ idDevice }) => {
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [summary, setSummary] = useState({
    distance: 0,
    top_speed: 0,
    avg_speed: 0,
    engine_duration: 0,
    stops: 0,
  });
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("day"),
    dayjs().endOf("day"),
  ]);

  const apiHash = config.api_hash;

  // ====== UTILS ======
  const formatSecondsToTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "—";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}min`;
  };

  // ====== FETCH DATA ======
  const fetchData = async (from, to) => {
    try {
      setLoading(true);
      const { data } = await getEventHistory({
        device_id: idDevice,
        from_date: from.split(" ")[0],
        from_time: from.split(" ")[1],
        to_date: to.split(" ")[0],
        to_time: to.split(" ")[1],
        lang: "fr",
        limit: 1000,
        user_api_hash: apiHash,
      });

      if (data?.items?.length > 0) {
        setVehicleData(data.items);

        // ====== SYNTHÈSE ======
        const distance = data.items.reduce((sum, e) => sum + (e.distance || 0), 0);
        const top_speed = Math.max(...data.items.map((e) => e.top_speed || 0));
        const avg_speed = Math.round(
          data.items.reduce((sum, e) => sum + (e.average_speed || 0), 0) /
            data.items.length
        );
        const engine_duration = data.items.reduce(
          (sum, e) => sum + (e.engine_work || 0),
          0
        );
        const stops = data.items.filter((e) => e.engine_work === 0).length;

        setSummary({
          distance: distance.toFixed(2),
          top_speed,
          avg_speed,
          engine_duration,
          stops,
        });
      } else {
        setVehicleData([]);
        setSummary({
          distance: 0,
          top_speed: 0,
          avg_speed: 0,
          engine_duration: 0,
          stops: 0,
        });
        message.info("Aucun historique trouvé pour cette période.");
      }
    } catch (error) {
      console.error("Erreur lors du fetch:", error);
      message.error("Erreur lors du chargement des événements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const start = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const end = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    fetchData(start, end);
  }, [idDevice]);

  // ====== GESTION DES DATES ======
  const handleDateChange = (values) => {
    setDateRange(values);
    if (values && values.length === 2) {
      const from = values[0].format("YYYY-MM-DD HH:mm:ss");
      const to = values[1].format("YYYY-MM-DD HH:mm:ss");
      fetchData(from, to);
    }
  };

  const quickFilter = (type) => {
    let from, to;
    const now = dayjs();

    switch (type) {
      case "lastHour":
        from = now.subtract(1, "hour");
        to = now;
        break;
      case "today":
        from = now.startOf("day");
        to = now.endOf("day");
        break;
      case "yesterday":
        from = now.subtract(1, "day").startOf("day");
        to = now.subtract(1, "day").endOf("day");
        break;
      case "thisWeek":
        from = now.startOf("week");
        to = now;
        break;
      case "thisMonth":
        from = now.startOf("month");
        to = now.endOf("month");
        break;
      default:
        return;
    }

    setDateRange([from, to]);
    fetchData(from.format("YYYY-MM-DD HH:mm:ss"), to.format("YYYY-MM-DD HH:mm:ss"));
  };

  return (
    <div className="rapport-event-history">
      {/* ==== 🔍 FILTRES RAPIDES ==== */}
      <Card className="filters-card" bordered={false} style={{ marginBottom: 20 }}>
        <Title level={4}>
          <CalendarOutlined style={{ color: "#1677ff", marginRight: 8 }} />
          Filtres rapides
        </Title>
        <Space wrap>
          <Button onClick={() => quickFilter("lastHour")} icon={<ClockCircleOutlined />}>
            Dernière heure
          </Button>
          <Button onClick={() => quickFilter("today")} icon={<CalendarOutlined />}>
            Aujourd’hui
          </Button>
          <Button onClick={() => quickFilter("yesterday")} icon={<CalendarOutlined />}>
            Hier
          </Button>
          <Button onClick={() => quickFilter("thisWeek")} icon={<CalendarOutlined />}>
            Cette semaine
          </Button>
          <Button onClick={() => quickFilter("thisMonth")} icon={<CalendarOutlined />}>
            Ce mois
          </Button>
          <RangePicker
            showTime
            value={dateRange}
            onChange={handleDateChange}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Space>
      </Card>

      {/* ==== 📊 SYNTHÈSE ==== */}
      <Card className="summary-card" bordered={false} style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              title="Distance totale"
              value={summary.distance}
              suffix="km"
              prefix={<CarOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="Vitesse max"
              value={summary.top_speed}
              suffix="km/h"
              prefix={<DashboardOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="Vitesse moyenne"
              value={summary.avg_speed}
              suffix="km/h"
              prefix={<DashboardOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Durée moteur"
              value={formatSecondsToTime(summary.engine_duration)}
              prefix={<ThunderboltOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* ==== 🕓 HISTORIQUE ==== */}
      <Card
        title={
          <Space>
            <CarOutlined style={{ color: "#1677ff" }} />
            <span>Historique du véhicule</span>
          </Space>
        }
        bordered={false}
      >
        {loading ? (
          <div className="text-center" style={{ padding: "40px 0" }}>
            <Spin tip="Chargement de l’historique..." size="large" />
          </div>
        ) : vehicleData.length === 0 ? (
          <div className="text-center" style={{ padding: 20 }}>
            <Text type="secondary">Aucune donnée disponible pour cette période.</Text>
          </div>
        ) : (
          <Timeline mode="left" style={{ marginTop: 20 }}>
            {vehicleData.map((event, index) => {
              const engineOn = event.engine_work > 0;
              return (
                <Timeline.Item
                  key={index}
                  dot={
                    engineOn ? (
                      <ThunderboltOutlined style={{ color: "green" }} />
                    ) : (
                      <ClockCircleOutlined style={{ color: "red" }} />
                    )
                  }
                >
                  <Card
                    size="small"
                    hoverable
                    className="event-card"
                    style={{
                      borderLeft: engineOn ? "4px solid green" : "4px solid red",
                    }}
                  >
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>{event.show || event.time}</Text>
                      </Col>
                      <Col>
                        <Tag color={engineOn ? "green" : "red"}>
                          {engineOn ? "Moteur actif" : "Moteur arrêté"}
                        </Tag>
                      </Col>
                    </Row>
                    <Divider style={{ margin: "8px 0" }} />
                    <Space direction="vertical" size={2}>
                      <Text>
                        <DashboardOutlined /> <strong>Vitesse :</strong> max {event.top_speed} km/h, moy{" "}
                        {event.average_speed} km/h
                      </Text>
                      <Text>
                        <CarOutlined /> <strong>Distance :</strong> {event.distance} km
                      </Text>
                      <Text>
                        <ClockCircleOutlined /> <strong>Durée moteur :</strong>{" "}
                        {formatSecondsToTime(event.engine_work)}
                      </Text>
                      {event.items?.[0] && (
                        <Text>
                          <EnvironmentOutlined /> <strong>Position :</strong>{" "}
                          <a
                            href={`https://www.google.com/maps?q=${event.items[0].lat},${event.items[0].lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Cliquez ici pour voir la position
                          </a>
                        </Text>
                      )}
                    </Space>
                  </Card>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default RapportEventHistory;
