import React, { useEffect, useState } from "react";
import {
  ClockCircleOutlined,
  CarOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  CalendarOutlined,
  StopOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  DatePicker,
  Card,
  Row,
  Col,
  Select,
  Spin,
  message,
  Typography,
  Progress,
  Tag,
  Statistic,
} from "antd";
import "./rapportMoniUtilitaire.scss";
import { getEventHistory, getFalcon } from "../../../../services/rapportService";
import config from "../../../../config";
import { formatSecondsToTime } from "../../../../utils/formatSecondsToTime";

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

const RapportMoniUtilitaire = () => {
  const [vehicles, setVehicles] = useState([]);
  const [idDevice, setIdDevice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    moving: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 },
    stopped: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 }
  });
  const [dateRange, setDateRange] = useState([dayjs().startOf("day"), dayjs().endOf("day")]);
  const apiHash = config.api_hash;

  useEffect(() => {
    (async () => {
      try {
        const falconData = await getFalcon();
        setVehicles(falconData.data[0].items || []);
      } catch (e) {
        console.error(e);
      }
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
        setSummary({
          moving: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 },
          stopped: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 }
        });
        message.info("Aucun historique trouvé.");
        return;
      }

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
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="rapport-event-history" style={{ padding: 20 }}>
      {/* Filtre */}
      <Card bordered={false} style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]} align="middle">
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
          <Col>
            <RangePicker showTime value={dateRange} onChange={handleDateChange} format="YYYY-MM-DD HH:mm:ss" />
          </Col>
        </Row>
      </Card>

      {/* Dashboard synthèse */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <Row gutter={24}>
          {["moving", "stopped"].map(type => {
            const isMoving = type === "moving";
            const group = summary[type];
            const color = isMoving ? "#52c41a" : "#f5222d";

            return (
              <Col xs={24} md={12} key={type}>
                <Card hoverable bordered style={{ marginBottom: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                  <Title level={5}>{isMoving ? "En mouvement" : "Inactif"} (Regroupé)</Title>

                  <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                    <Col span={12}>
                      <Statistic title="Distance" value={group.distance.toFixed(2)} suffix="km" prefix={<CarOutlined style={{ color }} />} />
                      <Progress percent={Math.min((group.distance / 500) * 100, 100)} strokeColor={color} showInfo={false} style={{ marginTop: 8 }} />
                    </Col>

                    <Col span={12}>
                      <Statistic title="Durée moteur" value={formatSecondsToTime(group.engine_duration)} prefix={<ThunderboltOutlined style={{ color }} />} />
                      <Progress percent={Math.min((group.engine_duration / 3600) * 100, 100)} strokeColor={color} showInfo={false} style={{ marginTop: 8 }} />
                    </Col>

                    <Col span={12} style={{ marginTop: 10 }}>
                      <Statistic title="Vitesse max" value={group.top_speed} suffix="km/h" prefix={<DashboardOutlined style={{ color }} />} />
                    </Col>
                    <Col span={12} style={{ marginTop: 10 }}>
                      <Statistic title="Vitesse moy." value={group.avg_speed} suffix="km/h" prefix={<DashboardOutlined style={{ color }} />} />
                    </Col>
                  </Row>

                  <Tag color={color} style={{ marginTop: 12, fontWeight: 'bold' }}>
                    {group.stops} {isMoving ? "arrêts" : "périodes inactives"}
                  </Tag>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default RapportMoniUtilitaire;
