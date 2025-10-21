import React, { useEffect, useState } from "react";
import {
  ClockCircleOutlined,
  CarOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  CalendarOutlined,
  StopOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  DatePicker,
  Card,
  Button,
  Row,
  Col,
  Select,
  Spin,
  message,
  Typography,
  Progress,
  Tag,
  Statistic,
  Collapse,
  Timeline,
  Divider,
  Space,
} from "antd";
import "./rapportMoniUtilitaire.scss";
import { getEventHistory, getFalcon } from "../../../../services/rapportService";
import config from "../../../../config";
import { formatSecondsToTime } from "../../../../utils/formatSecondsToTime";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const RapportMoniUtilitaire = () => {
  const [vehicles, setVehicles] = useState([]);
  const [idDevice, setIdDevice] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    moving: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 },
    stopped: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 }
  });
  const [dateRange, setDateRange] = useState([dayjs().startOf("day"), dayjs().endOf("day")]);
  const apiHash = config.api_hash;

  // Fetch vehicles
  useEffect(() => {
    (async () => {
      try {
        const falconData = await getFalcon();
        setVehicles(falconData.data[0].items || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const fetchData = async (from, to) => {
    if (!idDevice) return;
    setLoading(true);
    try {
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

      if (!data?.items?.length) {
        setVehicleData([]);
        setSummary({
          moving: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 },
          stopped: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 }
        });
        message.info("Aucun historique trouvé.");
        return;
      }

      setVehicleData(data.items);

      const moving = data.items.filter(e => e.engine_work > 0);
      const stopped = data.items.filter(e => e.engine_work === 0);

      const summarize = (arr) => ({
        distance: arr.reduce((sum, e) => sum + (e.distance || 0), 0),
        top_speed: Math.max(...arr.map(e => e.top_speed || 0)),
        avg_speed: arr.length ? Math.round(arr.reduce((sum, e) => sum + (e.average_speed || 0), 0) / arr.length) : 0,
        engine_duration: arr.reduce((sum, e) => sum + (e.engine_work || 0), 0),
        stops: arr.length
      });

      setSummary({
        moving: summarize(moving),
        stopped: summarize(stopped)
      });

    } catch (e) {
      console.error(e);
      message.error("Erreur lors du chargement des données.");
    } finally { setLoading(false); }
  };

  const handleDateChange = (values) => {
    setDateRange(values);
    if (values && values.length === 2 && idDevice) {
      fetchData(values[0].format("YYYY-MM-DD HH:mm:ss"), values[1].format("YYYY-MM-DD HH:mm:ss"));
    }
  };

  useEffect(() => {
    if (!idDevice) return;
    fetchData(dateRange[0].format("YYYY-MM-DD HH:mm:ss"), dateRange[1].format("YYYY-MM-DD HH:mm:ss"));
  }, [idDevice]);

  useEffect(() => {
    if (!idDevice) return; // ne pas fetch si aucun véhicule sélectionné
    const start = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const end = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    fetchData(start, end);
  }, [idDevice]);

  const quickFilter = (type) => {
    if (!idDevice) return;
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
    <div className="rapport-event-history" style={{ padding: 20 }}>
        {/*FILTRES RAPIDES + SELECT VÉHICULE ==== */}
      <Card className="filters-card" bordered={false} style={{ marginBottom: 20 }}>
        <Title level={4}>
          <CalendarOutlined style={{ color: "#1677ff", marginRight: 8 }} />
          Filtres rapides
        </Title>
        <Space wrap>
        <Col>
            <Select
              showSearch
              style={{ width: 250 }}
              value={idDevice}
              onChange={setIdDevice}
              placeholder="Sélectionnez un véhicule"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              allowClear
            >
              {vehicles.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)}
            </Select>
          </Col>

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
      {/* ==== FILTRES ==== */}

      {/* ==== DASHBOARD SYNTHÈSE ==== */}
      {loading ? (
        <div style={{ textAlign:'center', padding:50 }}><Spin size="large"/></div>
      ) : (
        <Row gutter={24}>
          {["moving","stopped"].map(type => {
            const isMoving = type==="moving";
            const group = summary[type];
            const color = isMoving?"#52c41a":"#f5222d";

            return (
              <Col xs={24} md={12} key={type}>
                <Card hoverable bordered style={{ marginBottom:20, boxShadow:"0 4px 12px rgba(0,0,0,0.05)" }}>
                  <Title level={5}>{isMoving?"En mouvement":"Inactif"} (Regroupé)</Title>

                  <Row gutter={[16,16]} style={{ marginTop:10 }}>
                    <Col span={12}>
                      <Statistic title="Distance" value={group.distance.toFixed(2)} suffix="km" prefix={<CarOutlined style={{color}}/>}/>
                      <Progress percent={Math.min((group.distance/500)*100,100)} strokeColor={color} showInfo={false} style={{marginTop:8}}/>
                    </Col>
                    <Col span={12}>
                      <Statistic title="Durée moteur" value={formatSecondsToTime(group.engine_duration)} prefix={<ThunderboltOutlined style={{color}}/>}/>
                      <Progress percent={Math.min((group.engine_duration/3600)*100,100)} strokeColor={color} showInfo={false} style={{marginTop:8}}/>
                    </Col>
                    <Col span={12} style={{ marginTop:10 }}>
                      <Statistic title="Vitesse max" value={group.top_speed} suffix="km/h" prefix={<DashboardOutlined style={{color}}/>}/>
                    </Col>
                    <Col span={12} style={{ marginTop:10 }}>
                      <Statistic title="Vitesse moy." value={group.avg_speed} suffix="km/h" prefix={<DashboardOutlined style={{color}}/>}/>
                    </Col>
                  </Row>

                  <Tag color={color} style={{ marginTop:12, fontWeight:'bold' }}>
                    {group.stops} {isMoving?"arrêts":"périodes inactives"}
                  </Tag>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* ==== DÉTAILS DES ÉVÉNEMENTS ==== */}
      <Card bordered={false} style={{ marginTop:20 }}>
        {vehicleData.length===0 ? (
          <Text type="secondary">Aucune donnée détaillée disponible.</Text>
        ) : (
          <Collapse defaultActiveKey={["moving","stopped"]} ghost>
            {["moving","stopped"].map(type => {
              const isMoving = type==="moving";
              const color = isMoving?"#52c41a":"#f5222d";
              const events = vehicleData.filter(e => isMoving? e.engine_work>0 : e.engine_work===0);
              return (
                <Panel header={`${isMoving?"En mouvement":"Inactif"} - ${events.length} événements`} key={type}>
                  <Timeline mode="left">
                    {events.map((event,idx)=>(
                      <Timeline.Item key={idx} dot={isMoving?<ThunderboltOutlined style={{color}}/>:<StopOutlined style={{color}}/>}>
                        <Card size="small" bordered hoverable style={{ marginBottom:10, borderLeft:`4px solid ${color}` }}>
                          <Row justify="space-between" align="middle">
                            <Col><Text strong>{event.show || event.time}</Text></Col>
                            <Col><Tag color={color}>{isMoving?"En mouvement":"Inactif"}</Tag></Col>
                          </Row>
                          <Divider style={{margin:"8px 0"}}/>
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
              )
            })}
          </Collapse>
        )}
      </Card>

    </div>
  );
};

export default RapportMoniUtilitaire;
