import { useEffect, useState } from "react";
import {
  DatePicker,
  message,
  Table,
  Spin,
  Empty,
  Typography,
  Space,
  Tooltip,
  Button,
  Collapse
} from "antd";
import dayjs from "dayjs";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

import { getEvent, getEventHistory } from "../../../../../services/rapportService";
import config from "../../../../../config";
import VehicleCard from "../../../../../components/vehicleCard/VehicleCard";
import { EnvironmentOutlined } from '@ant-design/icons';
import VehicleMap from "../../../../../components/vehicleMap/VehicleMap";
import { calculateZoneDurations } from "../../../../../utils/calculateZoneDurations";
import GetDetailCheckpZone from "./getDetailCheckpZone/GetDetailCheckpZone";

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
const { Panel } = Collapse;

const GetHistory = ({ id }) => {
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [activePanels, setActivePanels] = useState([]);
  const [events, setEvents] = useState([]);

  const apiHash = config.api_hash;

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
        limit: 1000,
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

    const fetchDatas = async (from, to) => {
      try {
        const { data } = await getEvent({
          date_from: from,
          date_to: to,
          lang: "fr",
          limit: 2000,
          user_api_hash: apiHash
        });
  
        const eventsData = data?.items?.data || [];
        const eventFiltre = eventsData.filter((ids) => ids.device_id === id);
        const durations = calculateZoneDurations(eventFiltre);

        const mapped = durations.map(e => ({ ...e, vehicule: e.vehicule }));
        setEvents(mapped);
      } catch (error) {
        console.error("Erreur lors du fetch:", error);
      }
    };
  useEffect(() => {
    const startOfDay = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const endOfDay = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    setDateRange([dayjs().startOf("day"), dayjs().endOf("day")]);
    fetchData(startOfDay, endOfDay);
    fetchDatas(startOfDay, endOfDay)
  }, [id]);

  const handleDateChange = (values) => {
    setDateRange(values);
    if (values && values.length === 2) {
      const from = values[0].format("YYYY-MM-DD HH:mm:ss");
      const to = values[1].format("YYYY-MM-DD HH:mm:ss");
      fetchData(from, to);
    }
  };

  // Gérer l'ouverture/fermeture des panels
  const handlePanelChange = (keys) => {
    setActivePanels(keys);
  };

  // Positions pour la carte
  const positions =
    vehicleData?.items?.flatMap((i) => i.items?.map((it) => [it.lat, it.lng]) || []) ||
    [];

  // Données pour le graphique
  const chartData = {
    labels:
      vehicleData?.items?.flatMap((i) =>
        i.items?.map((it) => it.show || it.time || "Date inconnue")
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
            i.items?.map((it, idx, arr) => {
              const allItems = vehicleData.items.flatMap(x => x.items);
              const currentIndex = allItems.findIndex(item => item.id === it.id);
              return allItems
                .slice(0, currentIndex + 1)
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

  const itemColumns = [
    { title: "Heure", dataIndex: "time", key: "time" },
    { title: "Vitesse (kph)", dataIndex: "speed", key: "speed" },
    { title: "Carburant (L)", dataIndex: "fuel", key: "fuel" },
    { title: "Ignition", dataIndex: "ignition", key: "ignition" },
    { title: "Porte", dataIndex: "door", key: "door" },
    { title: "Distance (km)", dataIndex: "distance", key: "distance" },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {record.lat && record.lng && (
            <Tooltip title="Voir la position sur Google Maps">
              <Button
                type="link"
                icon={<EnvironmentOutlined style={{ color: '#f5222d' }} />}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${record.lat},${record.lng}`,
                    '_blank'
                  )
                }
              />
            </Tooltip>
          )}
        </Space>
      ),
    }
  ];

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
          <VehicleCard vehicleData={vehicleData} tableData={tableData} totalDistance={totalDistance} />

          {/* Carte */}
          <VehicleMap positions={positions}/>

          {/* Collapse pour Graphiques et Table événements */}
          <Collapse 
            activeKey={activePanels} 
            onChange={handlePanelChange}
            style={{ width: "100%" }}
          >
            {/* Graphiques */}
            <Panel header="📈 Graphiques" key="graphiques">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </Panel>

            {/* Table événements */}
            <Panel header="📝 Historiques" key="historiques">
              <Table
                columns={itemColumns}
                dataSource={tableData}
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
              />
            </Panel>

            <Panel header="📝 Detail" key="detail">
              <GetDetailCheckpZone events={events} />
            </Panel>
          </Collapse>
        </Space>
      )}
    </div>
  );
};

export default GetHistory;