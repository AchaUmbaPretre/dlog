// ✅ Composant principal ultra pro
import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import {
  Card,
  Divider,
  Tag,
  notification,
  Spin,
  Alert,
  Descriptions,
} from "antd";
import {
  InteractionOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import vehiculeIconImg from "./../../../../../assets/vehicule01.png";
import { getFalcon } from "../../../../../services/rapportService";
import "./charroiLocalisationDetail.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTooltip,
  Legend
);

// ===  Couleur selon vitesse ===
const speedToColor = (speed) => {
  if (speed <= 10) return "green";
  if (speed <= 40) return "orange";
  if (speed <= 80) return "darkorange";
  return "red";
};

// ===  Marker véhicule animé ===
const VehicleMarker = ({ vehicle }) => {
  const markerRef = useRef(null);
  const lastPos = useRef([vehicle.lat, vehicle.lng]);
  const targetPos = useRef([vehicle.lat, vehicle.lng]);
  const map = useMap();

  useEffect(() => {
    if (vehicle?.online === "online") {
      targetPos.current = [vehicle.lat, vehicle.lng];
      map.flyTo([vehicle.lat, vehicle.lng], map.getZoom(), { duration: 0.5 });
    }
  }, [vehicle, map]);

  useEffect(() => {
    const animate = () => {
      if (!markerRef.current) {
        requestAnimationFrame(animate);
        return;
      }
      if (vehicle.online === "online") {
        const [latPrev, lngPrev] = lastPos.current;
        const [latTarget, lngTarget] = targetPos.current;

        const deltaLat = (latTarget - latPrev) * 0.1;
        const deltaLng = (lngTarget - lngPrev) * 0.1;

        if (Math.abs(deltaLat) > 0.00001 || Math.abs(deltaLng) > 0.00001) {
          const newLat = latPrev + deltaLat;
          const newLng = lngPrev + deltaLng;
          markerRef.current.setLatLng([newLat, newLng]);

          // rotation calculée
          const angle =
            Math.atan2(latTarget - latPrev, lngTarget - lngPrev) *
            (180 / Math.PI);
          markerRef.current.setRotationAngle(angle);
          lastPos.current = [newLat, newLng];
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [vehicle.online]);

  const vehicleIcon = L.icon({
    iconUrl: vehiculeIconImg,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: `vehicle-marker-${speedToColor(vehicle.speed)}`,
  });

  return (
    <Marker
      ref={markerRef}
      position={[vehicle.lat, vehicle.lng]}
      icon={vehicleIcon}
      rotationAngle={vehicle.course || 0}
      rotationOrigin="center center"
    >
      <Popup>
        <strong>{vehicle.name}</strong>
        <br />
        Statut: {vehicle.online}
        <br />
        Vitesse: {vehicle.speed} km/h
        <br />
        Course: {vehicle.course}°
        <br />
        Dernier signal: {vehicle.time}
        <br />
        Stop durée: {vehicle.stop_duration || "-"}
      </Popup>
    </Marker>
  );
};

// ===  Carte Leaflet ===
const CharroiLeaflet = ({ vehicle }) => {
  const tailPositions =
    vehicle.tail?.map((t) => [parseFloat(t.lat), parseFloat(t.lng)]) || [];

  return (
    <MapContainer
      center={[vehicle.lat, vehicle.lng]}
      zoom={14}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <VehicleMarker vehicle={vehicle} />

      {tailPositions.map((pos, i) => {
        if (i === tailPositions.length - 1) return null;
        return (
          <Polyline
            key={i}
            positions={[tailPositions[i], tailPositions[i + 1]]}
            color={speedToColor(vehicle.speed)}
            weight={5}
            opacity={0.8}
          />
        );
      })}
    </MapContainer>
  );
};

// ===  Page principale ===
const CharroiLocalisationDetail = ({ id }) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speedData, setSpeedData] = useState([]);
  const [engineData, setEngineData] = useState([]);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const { data } = await getFalcon();
        const items = data?.[0]?.items || [];
        const selected = items.find((v) => v.id === id);
        if (!selected) throw new Error("Véhicule introuvable");
        setVehicle(selected);

        setSpeedData((prev) => [...prev.slice(-9), selected.speed || 0]);
        setEngineData((prev) => [
          ...prev.slice(-9),
          selected.sensors?.find((s) => s.type === "engine")?.val ? 1 : 0,
        ]);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement.");
        notification.error({
          message: "Erreur de chargement",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading)
    return <Spin tip="Chargement..." style={{ width: "100%", marginTop: 50 }} />;
  if (error) return <Alert message={error} type="error" style={{ marginTop: 20 }} />;
  if (!vehicle)
    return <Alert message="Véhicule introuvable" type="warning" />;

  const chartData = {
    labels: speedData.map((_, i) => i + 1),
    datasets: [
      {
        label: "Vitesse (km/h)",
        data: speedData,
        borderColor: "blue",
        tension: 0.3,
      },
      {
        label: "Moteur (1=On, 0=Off)",
        data: engineData,
        borderColor: "red",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true, max: 120 } },
  };

  return (
    <div className="charroi_local_detail">
      <div className="charroi_top">
        <h3>
          {vehicle.name}{" "}
          <Tag color={vehicle.online === "online" ? "green" : "red"}>
            {vehicle.online.toUpperCase()}
          </Tag>
        </h3>
        <span>Dernier signal : {vehicle.time}</span>
      </div>

      <Divider />

      <div className="charroi_local">
        <div className="charroi_local_left">
          <CharroiLeaflet vehicle={vehicle} />
        </div>

        <div className="charroi_local_right">
          <Card title="Informations générales" bordered style={{ marginBottom: 20 }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Statut">
                {vehicle.online}
              </Descriptions.Item>
              <Descriptions.Item label="Vitesse">
                {vehicle.speed} km/h
              </Descriptions.Item>
              <Descriptions.Item label="Course">
                {vehicle.course}°
              </Descriptions.Item>
              <Descriptions.Item label="Stop durée">
                {vehicle.stop_duration}
              </Descriptions.Item>
              <Descriptions.Item label="Distance totale">
                {vehicle.total_distance} km
              </Descriptions.Item>
              <Descriptions.Item label="Alarm">
                {vehicle.alarm}
              </Descriptions.Item>
            </Descriptions>
            {/* Sensors dynamiques */}
            <div style={{ marginTop: 12 }}>
              {vehicle.sensors?.map((s) => (
                <Tag
                  key={s.id}
                  color={
                    s.type === "engine"
                      ? s.val
                        ? "green"
                        : "red"
                      : s.type === "door"
                      ? s.value === "Fermé"
                        ? "green"
                        : "volcano"
                      : "blue"
                  }
                >
                  {s.name}: {s.value}
                </Tag>
              ))}
            </div>
          </Card>

          <Card title="Graphique vitesse / moteur" bordered>
            <Line data={chartData} options={chartOptions} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CharroiLocalisationDetail;
