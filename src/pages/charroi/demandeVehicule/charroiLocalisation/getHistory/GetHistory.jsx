import { useEffect, useState } from "react";
import {
  DatePicker,
  message,
  Card,
  Row,
  Col,
  Badge,
  Table,
  Spin,
  Empty,
  Typography,
  Space,
  Tooltip
} from "antd";
import dayjs from "dayjs";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip as MapTooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  CarOutlined,
  FlagOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

import { getEventHistory } from "../../../../../services/rapportService";
import { fetchAddress } from "../../../../../utils/fetchAddress";
import config from "../../../../../config";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const { RangePicker } = DatePicker;
const { Title: AntTitle, Text } = Typography;

const GetHistory = ({ id }) => {
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [addressMap, setAddressMap] = useState({});

  const apiHash = config.api_hash; // Remplace par ton config

  const fetchData = async (from, to) => {
    try {
      setLoading(true);
      const { data } = await getEventHistory({
        device_id: id,
        from_date: from.split(" ")[0],
        from_time: from.split(" ")[1],
        to_date: to.split(" ")[0],
        to_time: to.split(" ")[1],
        lang: "fr",
        limit: 50,
        user_api_hash: apiHash,
      });
      if (data) setVehicleData(data);
      else message.info("Aucun historique trouvé pour cette période.");
    } catch (error) {
      console.error("Erreur lors du fetch:", error);
      message.error("Erreur lors du chargement des événements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const startOfDay = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const endOfDay = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    setDateRange([dayjs().startOf("day"), dayjs().endOf("day")]);
    fetchData(startOfDay, endOfDay);
  }, [id]);

  const handleDateChange = (values) => {
    setDateRange(values);
    if (values && values.length === 2) {
      const from = values[0].format("YYYY-MM-DD HH:mm:ss");
      const to = values[1].format("YYYY-MM-DD HH:mm:ss");
      fetchData(from, to);
    }
  };

  // Positions pour la carte
  const positions =
    vehicleData?.items?.flatMap((i) => i.items?.map((it) => [it.lat, it.lng]) || []) ||
    [];

  // Données pour le graphique
  const chartData = {
    labels:
      vehicleData?.items?.flatMap((i, idx) =>
        i.items?.map((_, j) => `Ev ${idx + 1}-${j + 1}`)
      ) || [],
    datasets: [
      {
        label: "Vitesse (kph)",
        data:
          vehicleData?.items?.flatMap((i) =>
            i.items?.map(
              (it) => it.sensors_data?.find((s) => s.id === "speed")?.value || 0
            )
          ) || [],
        borderColor: "#1890ff",
        backgroundColor: "rgba(24,144,255,0.2)",
        tension: 0.3,
        pointRadius: 3,
      },
      {
        label: "Carburant (L)",
        data:
          vehicleData?.items?.flatMap((i) =>
            i.items?.map(
              (it) =>
                it.sensors_data?.find((s) => s.id === "sensor_1728")?.value || 0
            )
          ) || [],
        borderColor: "#52c41a",
        backgroundColor: "rgba(82,196,26,0.2)",
        tension: 0.3,
        pointRadius: 3,
      },
      {
        label: "Distance cumulée (km)",
        data:
          vehicleData?.items?.flatMap((i) =>
            i.items?.map((it, idx) => {
              return vehicleData.items
                .flatMap((x) => x.items)
                .slice(0, idx + 1)
                .reduce((sum, y) => sum + (y.distance || 0), 0);
            })
          ) || [],
        borderColor: "#fa541c",
        backgroundColor: "rgba(250,84,28,0.2)",
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  // Table événements
  const tableData =
    vehicleData?.items?.flatMap((i, idx) =>
      i.items?.map((it, j) => ({
        key: `${idx}-${j}`,
        time: it.time || "N/A",
        speed: it.sensors_data?.find((s) => s.id === "speed")?.value || 0,
        fuel: it.sensors_data?.find((s) => s.id === "sensor_1728")?.value || 0,
        ignition:
          it.other_arr?.find((x) => x.includes("ignition"))?.split(": ")[1] || "N/A",
        door:
          it.other_arr?.find((x) => x.includes("door"))?.split(": ")[1] || "N/A",
        lat: it.lat,
        lng: it.lng,
        distance: it.distance || 0,
      }))
    ) || [];

  const totalDistance = tableData.reduce((acc, item) => acc + (item.distance || 0), 0);

  useEffect(() => {
    const fetchAllAddresses = async () => {
      for (const item of tableData) {
        const key = `${item.lat}_${item.lng}`;
        if (!addressMap[key]) {
          const addr = await fetchAddress(item);
          setAddressMap((prev) => ({ ...prev, [key]: addr || "Adresse inconnue" }));
        }
      }
    };
    if (tableData.length > 0) fetchAllAddresses();
  }, [tableData]);

  const itemColumns = [
    { title: "Heure", dataIndex: "time", key: "time" },
    { title: "Vitesse (kph)", dataIndex: "speed", key: "speed" },
    { title: "Carburant (L)", dataIndex: "fuel", key: "fuel" },
    { title: "Ignition", dataIndex: "ignition", key: "ignition" },
    { title: "Porte", dataIndex: "door", key: "door" },
    { title: "Distance (km)", dataIndex: "distance", key: "distance" },
    {
      title: "Adresse",
      key: "address",
      render: (_, record) => {
        const key = `${record.lat}_${record.lng}`;
        return addressMap[key] || <Spin size="small" />;
      },
    },
  ];

  // Badge dynamique carburant
  const getFuelStatus = (fuel) => {
    if (fuel > 50) return "success";
    if (fuel > 20) return "warning";
    return "error";
  };

  return (
    <div className="event_container" style={{ padding: 20 }}>
      <AntTitle level={3} style={{ marginBottom: 20 }}>
        📊 Détails du véhicule
      </AntTitle>

      <div className="event_top" style={{ marginBottom: 20 }}>
        <RangePicker
          style={{ width: "100%" }}
          value={dateRange}
          onChange={handleDateChange}
          allowClear
          showTime={{ format: "HH:mm" }}
          format="DD/MM/YYYY HH:mm"
          placeholder={["Date début", "Date fin"]}
        />
      </div>

      {loading && (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Spin size="large" tip="Chargement des données..." />
        </div>
      )}

      {!loading && !vehicleData && <Empty description="Aucune donnée disponible" />}

      {vehicleData && (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Infos générales */}
          <Card
            bordered
            style={{
              borderRadius: 12,
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              backgroundColor: "#fff",
            }}
            title={
              <Space>
                <CarOutlined style={{ color: "#1890ff" }} />
                <Text strong style={{ fontSize: 18 }}>
                  {vehicleData.device?.name || "N/A"}
                </Text>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Tooltip title="État du véhicule">
                  <Text strong>Status: </Text>
                  <Badge
                    status={vehicleData.status ? "success" : "error"}
                    text={vehicleData.status ? "Actif 🚀" : "Inactif ❌"}
                  />
                </Tooltip>
              </Col>
              <Col span={8}>
                <Tooltip title="Nombre total d'événements enregistrés">
                  <Text strong>
                    <FlagOutlined style={{ color: "#faad14", marginRight: 4 }} />
                    Événements:
                  </Text>{" "}
                  {tableData.length}
                </Tooltip>
              </Col>
              <Col span={8}>
                <Tooltip title="Distance totale parcourue">
                  <Text strong>
                    <DashboardOutlined style={{ color: "#52c41a", marginRight: 4 }} />
                    Distance:
                  </Text>{" "}
                  {totalDistance.toLocaleString(undefined, { minimumFractionDigits: 2 })} km
                </Tooltip>
              </Col>
              <Col span={8}>
                <Tooltip title="Carburant restant">
                  <Text strong>Carburant: </Text>
                  <Badge
                    status={getFuelStatus(vehicleData.device?.fuel_quantity || 0)}
                    text={`${vehicleData.device?.fuel_quantity || 0} L`}
                  />
                </Tooltip>
              </Col>
              <Col span={8}>
                <Tooltip title="Vitesse max aujourd'hui">
                  <Text strong>Top Speed: </Text> {vehicleData.top_speed || "N/A"}
                </Tooltip>
              </Col>
              <Col span={8}>
                <Tooltip title="Durée en mouvement / arrêt">
                  <Text strong>Mouvement: </Text> {vehicleData.move_duration || "0"} / 
                  <Text strong> Arrêt: </Text> {vehicleData.stop_duration || "0"}
                </Tooltip>
              </Col>
              <Col span={24}>
                <Tooltip title="Dernière mise à jour">
                  <Text strong>
                    <ClockCircleOutlined style={{ color: "#1890ff", marginRight: 4 }} />
                    Dernière activité:
                  </Text>{" "}
                  {vehicleData.lastUpdate ? new Date(vehicleData.lastUpdate).toLocaleString() : "N/A"}
                </Tooltip>
              </Col>
            </Row>
          </Card>

          {/* Carte */}
          <Card bordered style={{ borderRadius: 12 }} title="🗺️ Trajectoire">
            <MapContainer
              center={positions[0] || [0, 0]}
              zoom={positions.length > 0 ? 13 : 2}
              style={{ height: "400px", width: "100%", borderRadius: 8 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {positions.length > 0 && (
                <>
                  <Polyline positions={positions} color="blue" />
                  <Marker position={positions[0]}>
                    <MapTooltip>🚩 Départ</MapTooltip>
                  </Marker>
                  <Marker position={positions[positions.length - 1]}>
                    <MapTooltip>🏁 Arrivée</MapTooltip>
                  </Marker>
                </>
              )}
            </MapContainer>
          </Card>

          {/* Graphiques */}
          <Card bordered style={{ borderRadius: 12 }} title="📈 Graphiques">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </Card>

          {/* Table événements */}
          <Card bordered style={{ borderRadius: 12 }} title="📝 Événements">
            <Table
              columns={itemColumns}
              dataSource={tableData}
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </Card>
        </Space>
      )}
    </div>
  );
};

export default GetHistory;
