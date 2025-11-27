import { useEffect, useRef, useMemo, useState } from "react";
import { Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import { Line } from "react-chartjs-2";
import vehiculeIconImg from "./../../assets/vehicule01.png";
import { getSpeedColor } from "../../utils/getSpeedColor";
import "./vehicleMarker.scss";

export const VehicleMarker = ({ vehicle, address, zoomLevel = 15 }) => {
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const map = useMap();
  const frameRef = useRef(null);

  // --- Refs pour animation et trace ---
  const lastPos = useRef([vehicle?.lat, vehicle?.lng]);
  const targetPos = useRef([vehicle?.lat, vehicle?.lng]);
  const pathRef = useRef([[vehicle.lat, vehicle.lng]]);

  // --- Historique des vitesses pour le mini-graph ---
  const [speedHistory, setSpeedHistory] = useState([vehicle.speed]);

  // --- Icône dynamique avec couleur selon vitesse ---
  const vehicleIcon = useMemo(() => {
    const colorClass =
      vehicle.online === "online"
        ? getSpeedColor(vehicle.speed)
        : "offline";

    return L.icon({
      iconUrl: vehiculeIconImg,
      iconSize: [60, 60],
      iconAnchor: [30, 30],
      popupAnchor: [0, -25],
      className: `vehicle-marker-${colorClass}`,
    });
  }, [vehicle.speed, vehicle.online]);

  // --- Animation fluide ---
  useEffect(() => {
    if (!markerRef.current) return;
    targetPos.current = [vehicle.lat, vehicle.lng];

    const animate = () => {
      if (!markerRef.current) return;

      const [latPrev, lngPrev] = lastPos.current;
      const [latTarget, lngTarget] = targetPos.current;

      if (vehicle.online !== "online") {
        cancelAnimationFrame(frameRef.current);
        markerRef.current.setLatLng([latPrev, lngPrev]);
        return;
      }

      // Interpolation
      const newLat = latPrev + (latTarget - latPrev) * 0.08;
      const newLng = lngPrev + (lngTarget - lngPrev) * 0.08;

      // Déplacement du marqueur
      markerRef.current.setLatLng([newLat, newLng]);

      // Rotation réaliste
      const angle =
        Math.atan2(latTarget - latPrev, lngTarget - lngPrev) * (180 / Math.PI);
      markerRef.current.setRotationAngle(angle);

      lastPos.current = [newLat, newLng];

      // --- Update trace directement sur Leaflet Polyline ---
      if (polylineRef.current) {
        pathRef.current.push([newLat, newLng]);
        polylineRef.current.setLatLngs(pathRef.current);
      }

      // --- Historique vitesse pour mini-graph ---
      setSpeedHistory((prev) => [...prev.slice(-20), vehicle.speed]);

      frameRef.current = requestAnimationFrame(animate);
    };

    if (vehicle.online === "online") frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [vehicle.online, vehicle.lat, vehicle.lng, vehicle.speed]);

  // --- Recentre carte si online ---
  useEffect(() => {
    if (vehicle.online === "online") {
      map.flyTo([vehicle.lat, vehicle.lng], zoomLevel, { duration: 0.7 });
    }
    markerRef.current?.openPopup();
  }, [vehicle, map, zoomLevel]);

  // --- Données pour mini-graph ---
  const speedChartData = {
    labels: speedHistory.map((_, i) => i + 1),
    datasets: [
      {
        label: "Vitesse km/h",
        data: speedHistory,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const speedChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { min: 0, max: 180 },
    },
  };

  return (
    <>
      {/* Trace animée */}
      <Polyline
        ref={polylineRef}
        positions={pathRef.current}
        color={getSpeedColor(vehicle.speed)}
        weight={4}
        opacity={0.7}
      />

      {/* Marqueur du véhicule */}
      <Marker
        ref={markerRef}
        position={[vehicle.lat, vehicle.lng]}
        icon={vehicleIcon}
        rotationAngle={vehicle.course || 0}
        rotationOrigin="center center"
      >
        <Popup className="vehicle-popup">
          <div className="popup-content">
            <h4>🚘 {vehicle.name}</h4>
            <p>
              📡 <b>Statut :</b>{" "}
              <span
                className={
                  vehicle.online === "online" ? "status-online" : "status-offline"
                }
              >
                {vehicle.online}
              </span>
            </p>
            <p>
              ⚡ <b>Vitesse :</b>{" "}
              <span className={`speed-${getSpeedColor(vehicle.speed)}`}>
                {vehicle.speed} km/h
              </span>
            </p>
            <p>🧭 <b>Course :</b> {vehicle.course}°</p>
            <p>⏱ <b>Signal :</b> {vehicle.time}</p>
            <p>⛔ <b>Stop :</b> {vehicle.stop_duration || "-"}</p>
            <p>🏠 <b>Adresse :</b> {address || "-"}</p>

            {/* Mini-graph de vitesse */}
            <div className="popup-chart">
              <Line data={speedChartData} options={speedChartOptions} />
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};
