import { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotatedmarker';
import vehiculeIconImg from './../../assets/vehicule01.png';
import { getSpeedColor } from '../../utils/getSpeedColor';

export const VehicleMarker = ({ vehicle, address, zoomLevel = 15 }) => {
  const markerRef = useRef(null);
  const lastPos = useRef([vehicle?.lat, vehicle?.lng]);
  const targetPos = useRef([vehicle?.lat, vehicle?.lng]);
  const map = useMap();

  useEffect(() => {
    if (!vehicle) return;
    targetPos.current = [vehicle?.lat, vehicle?.lng];
    map.flyTo([vehicle.lat, vehicle.lng], zoomLevel, { duration: 0.5 });

    if (markerRef.current) markerRef.current.openPopup();
  }, [vehicle, map, zoomLevel]);

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
          const angle = Math.atan2(latTarget - latPrev, lngTarget - lngPrev) * (180 / Math.PI);
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
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -20],
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
      <Popup>
        <strong>{vehicle.name}</strong><br />
        Statut: {vehicle.online}<br />
        Vitesse: {vehicle.speed} km/h<br />
        Course: {vehicle.course}°<br />
        Dernier signal: {vehicle.time}<br />
        Stop durée: {vehicle.stop_duration || '-'}<br />
        Adresse: {address || '-'}
      </Popup>
    </Marker>
  );
};
