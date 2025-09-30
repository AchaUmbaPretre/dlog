import { useEffect, useState } from "react";
import {
  DatePicker,
  message,
  Card,
  Row,
  Col,
  Badge,
  Table,
  Divider,
  Spin,
  Empty,
  Typography,
  Space,
} from "antd";
import axios from "axios";
import config from "../../../../../config";
import dayjs from "dayjs";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip as MapTooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
import { Line } from "react-chartjs-2";
import './getHistory.scss'
import { fetchAddress } from "../../../../../utils/fetchAddress";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getEventHistory } from "../../../../../services/rapportService";

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
  const apiHash = config.api_hash;
  const [addressMap, setAddressMap] = useState({});

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

            if (data) {
            setVehicleData(data);
            } else {
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
    ],
  };

// Données pour la table
const tableData =
  vehicleData?.items?.flatMap((i, idx) =>
    i.items?.map((it, j) => ({
      key: `${idx}-${j}`,
      time: it.time || "N/A",
      speed: it.sensors_data?.find((s) => s.id === "speed")?.value || 0,
      fuel: it.sensors_data?.find((s) => s.id === "sensor_1728")?.value || 0,
      ignition:
        it.other_arr?.find((x) => x.includes("ignition"))?.split(": ")[1] ||
        "N/A",
      door:
        it.other_arr?.find((x) => x.includes("door"))?.split(": ")[1] ||
        "N/A",
      lat: it.lat,
      lng: it.lng,
      distance: it.distance || 0,
    }))
  ) || [];

const totalDistance = tableData.reduce(
  (acc, item) => acc + (item.distance || 0),
  0
);

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
    if (tableData.length > 0) {
      fetchAllAddresses();
    }
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

  return (
    <div className="event_container" style={{ padding: 20 }}>
      <AntTitle level={3} style={{ marginBottom: 20 }}>
        📊 Détails du device
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
                style={{ borderRadius: 12 }}
                title={`🚗 ${vehicleData.device?.name || "N/A"}`}
            >
                <Row gutter={16}>
                    <Col span={8}>
                    <Text strong>Status: </Text>
                    <Badge
                        status={vehicleData.status ? "success" : "error"}
                        text={vehicleData.status ? "Actif" : "Inactif"}
                    />
                    </Col>
                    <Col span={8}>
                    <Text strong>Nombre d’événements: </Text>
                    {tableData.length}
                    </Col>
                    <Col span={8}>
                    <Text strong>Total distance: </Text>
                    {totalDistance.toFixed(2)} km
                    </Col>
                </Row>
            </Card>

          {/* Carte */}
          <Card
  bordered
  style={{ borderRadius: 12 }}
  title="🗺️ Trajectoire"
>
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
          <MapTooltip>Départ</MapTooltip>
        </Marker>
        <Marker position={positions[positions.length - 1]}>
          <MapTooltip>Arrivée</MapTooltip>
        </Marker>
      </>
    )}
  </MapContainer>
</Card>


          {/* Graphiques */}
          <Card
            bordered
            style={{ borderRadius: 12 }}
            title="📈 Graphiques"
          >
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                },
              }}
            />
          </Card>

          {/* Table événements */}
          <Card
            bordered
            style={{ borderRadius: 12 }}
            title="📝 Événements"
          >
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
