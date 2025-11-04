import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import vehiculeIconImg from "./../../assets/vehicule01.png";
import { getSpeedColor } from "../../utils/getSpeedColor";
import "./vehicleMarker.scss";

export const VehicleMarker = ({ vehicle, address, zoomLevel = 15 }) => {
  const markerRef = useRef(null);
  const lastPos = useRef([vehicle?.lat, vehicle?.lng]);
  const targetPos = useRef([vehicle?.lat, vehicle?.lng]);
  const map = useMap();
  const frameRef = useRef(null); // pour gérer la boucle d’animation

  // --- Focus et mise à jour de la position cible ---
// --- Focus et mise à jour de la position cible ---
// --- Focus et mise à jour de la position cible ---
useEffect(() => {
  if (!vehicle || !markerRef.current) return;

  // Mettre à jour la position cible
  targetPos.current = [vehicle.lat, vehicle.lng];

  // Ne recentre la carte que si online
  if (vehicle.online === "online") {
    map.flyTo([vehicle.lat, vehicle.lng], zoomLevel, { duration: 0.7 });
  }

  // Ouvre le popup toujours
  markerRef.current.openPopup();
}, [vehicle, map, zoomLevel]);

// --- Animation fluide ---
useEffect(() => {
  const animate = () => {
    if (!markerRef.current) return;

    const [latPrev, lngPrev] = lastPos.current;
    const [latTarget, lngTarget] = targetPos.current;

    // Si le véhicule est offline → on gèle la position actuelle et on arrête la boucle
    if (vehicle.online !== "online") {
      cancelAnimationFrame(frameRef.current);
      markerRef.current.setLatLng([latPrev, lngPrev]);
      return;
    }

    // Calcul d’interpolation
    const newLat = latPrev + (latTarget - latPrev) * 0.08;
    const newLng = lngPrev + (lngTarget - lngPrev) * 0.08;

    // Déplacement du marqueur
    markerRef.current.setLatLng([newLat, newLng]);

    // Calcul de la direction
    const angle =
      Math.atan2(latTarget - latPrev, lngTarget - lngPrev) * (180 / Math.PI);
    markerRef.current.setRotationAngle(angle);

    lastPos.current = [newLat, newLng];
    frameRef.current = requestAnimationFrame(animate);
  };

  // 🧠 On ne démarre la boucle que si le véhicule est online
  if (vehicle.online === "online") {
    frameRef.current = requestAnimationFrame(animate);
  }

  // Nettoyage
  return () => cancelAnimationFrame(frameRef.current);
}, [vehicle.online]); // ⚠️ ne pas mettre lat/lng ici

  // --- Icône dynamique ---
const vehicleIcon = L.icon({
  iconUrl: vehiculeIconImg,
  iconSize: [60, 60],
  iconAnchor: [30, 30],
  popupAnchor: [0, -25],
  className: `vehicle-marker-${
    vehicle.online === "online" ? getSpeedColor(vehicle.speed) : "offline"
  }`,
});


  return (
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
                vehicle.online === "online"
                  ? "status-online"
                  : "status-offline"
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
        </div>
      </Popup>
    </Marker>
  );
};
