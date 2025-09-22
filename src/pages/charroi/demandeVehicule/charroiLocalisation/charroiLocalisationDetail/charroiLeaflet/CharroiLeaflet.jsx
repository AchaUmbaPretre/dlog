import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotatedmarker';
import vehiculeIconImg from './../../../../../../assets/vehicule01.png';

// Vehicle marker avec interpolation fluide et rotation
const VehicleMarker = ({ vehicle }) => {
  const markerRef = useRef(null);
  const lastPos = useRef([vehicle.lat, vehicle.lng]);
  const targetPos = useRef([vehicle.lat, vehicle.lng]);
  const map = useMap();

  // Met à jour la cible uniquement si online
  useEffect(() => {
    if (!vehicle) return;
    if (vehicle.online === "online") {
      targetPos.current = [vehicle.lat, vehicle.lng];
      map.flyTo([vehicle.lat, vehicle.lng], map.getZoom(), { duration: 0.5 });
    }
  }, [vehicle, map]);

  // Animation fluide, uniquement quand online
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

          // Calcul rotation pour pointer dans la bonne direction
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
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
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
        Stop durée: {vehicle.stop_duration || '-'}
      </Popup>
    </Marker>
  );
};

const CharroiLeaflet = ({vehicle}) => {

  return (
    <div>
        <MapContainer
            center={[vehicle.lat, vehicle.lng]}
            zoom={14}
            style={{ height: '400px', width: '100%' }}
            scrollWheelZoom={false}
        >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <VehicleMarker vehicle={vehicle} />

            {vehicle.tail?.length > 0 && (
              <Polyline
                positions={vehicle.tail.map(t => [parseFloat(t.lat), parseFloat(t.lng)])}
                color={vehicle.tail_color || 'blue'}
                weight={4}
              />
            )}
        </MapContainer>
    </div>
  )
}

export default CharroiLeaflet