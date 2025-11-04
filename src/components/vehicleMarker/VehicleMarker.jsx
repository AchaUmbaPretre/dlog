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

  // Déplacement fluide + focus auto
  useEffect(() => {
    if (!vehicle) return;
    targetPos.current = [vehicle.lat, vehicle.lng];
    map.flyTo([vehicle.lat, vehicle.lng], zoomLevel, { duration: 0.7 });
    markerRef.current?.openPopup();
  }, [vehicle, map, zoomLevel]);

  // Animation continue de la position
useEffect(() => {
  let frameId;

  const animate = () => {
    if (!markerRef.current) return;

    if (vehicle.online !== "online") {
      cancelAnimationFrame(frameId);
      return;
    }

    const [latPrev, lngPrev] = lastPos.current;
    const [latTarget, lngTarget] = targetPos.current;

    const newLat = latPrev + (latTarget - latPrev) * 0.08;
    const newLng = lngPrev + (lngTarget - lngPrev) * 0.08;

    markerRef.current.setLatLng([newLat, newLng]);

    const angle =
      Math.atan2(latTarget - latPrev, lngTarget - lngPrev) * (180 / Math.PI);
    markerRef.current.setRotationAngle(angle);

    lastPos.current = [newLat, newLng];
    frameId = requestAnimationFrame(animate);
  };

  frameId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(frameId);
}, [vehicle.online]);

  // Icône dynamique
  const vehicleIcon = L.icon({
    iconUrl: vehiculeIconImg,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -25],
    className: `vehicle-marker-${getSpeedColor(vehicle.speed)}`,
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
            <span className={vehicle.online === "online" ? "status-online" : "status-offline"}>
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
