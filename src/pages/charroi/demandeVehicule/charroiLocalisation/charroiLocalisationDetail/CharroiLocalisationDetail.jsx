import React, { useEffect, useState, useRef } from 'react';
import './charroiLocalisationDetail.scss';
import { InteractionOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { notification, Spin, Alert } from 'antd';
import { getFalcon } from '../../../../../services/rapportService';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotatedmarker';
import vehiculeIconImg from './../../../../../assets/vehicule01.png';

// Icônes alertes
const alertIcons = {
  speed: L.icon({ iconUrl: '/assets/icons/speed.png', iconSize: [30, 30], iconAnchor: [15, 30] }),
  geofence: L.icon({ iconUrl: '/assets/icons/geofence.png', iconSize: [30, 30], iconAnchor: [15, 30] }),
  battery: L.icon({ iconUrl: '/assets/icons/battery.png', iconSize: [30, 30], iconAnchor: [15, 30] }),
  default: L.icon({ iconUrl: '/assets/icons/alert.png', iconSize: [30, 30], iconAnchor: [15, 30] }),
};

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

const CharroiLocalisationDetail = ({ id }) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const { data } = await getFalcon();
        const items = data?.[0]?.items || [];
        const selected = items.find(v => v.id === id);
        if (!selected) throw new Error('Véhicule introuvable');
        setVehicle(selected);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des données.');
        notification.error({
          message: 'Erreur de chargement',
          description: err.message || 'Impossible de charger les données véhicules.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <Spin tip="Chargement..." style={{ width: '100%', marginTop: 50 }} />;
  if (error) return <Alert message={error} type="error" style={{ marginTop: 20 }} />;
  if (!vehicle || !vehicle.lat || !vehicle.lng) return <Alert message="Coordonnées manquantes" type="warning" />;

  return (
    <div className="charroi_local_detail">
      <div className="charroi_top">
        <div className="charroi_top_left">
          <h3 className="charroi_h3">{vehicle.name}</h3>
          <span className="charroi_desc">{vehicle.address || '-'}</span>
        </div>
        <div className="charroi_top_right">
          <h3 className="statut_h3">{vehicle.online.toUpperCase()}</h3>
          <span className="charroi_desc">Dernier signal : {vehicle.time}</span>
        </div>
      </div>

      <div className="charroi_local">
        <div className="charroi_local_left">
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

        <div className="charroi_local_right">
          <h1 className="charroi_h1">{vehicle.speed || 0} Km/h</h1>
          <div className="charroi_row">
            <InteractionOutlined />
            <span className="name">Statut : {vehicle.online === 'online' ? 'En mouvement' : 'Arrêté'}</span>
          </div>
          <div className="charroi_row">
            <UserOutlined />
            <span className="name">Course : {vehicle.course}°</span>
          </div>
          <div className="charroi_row">
            <ClockCircleOutlined />
            <span className="name">Stop durée : {vehicle.stop_duration || '-'}</span>
          </div>
          <div className="charroi_row">
            <InteractionOutlined />
            <span className="name">Odomètre virtuel : {vehicle.odometer || 0} Km</span>
          </div>
          <div className="charroi_row">
            <InteractionOutlined />
            <span className="name">Distance totale : {vehicle.total_distance || 0} Km</span>
          </div>

          <h2 className="title">Dernières positions</h2>
          {vehicle.latest_positions?.split(';').map((pos, i) => {
            const [lat, lng] = pos.split('/');
            return (
              <div className="charroi_row" key={i}>
                <span className="name">{`#${i + 1}: Lat ${lat}, Lng ${lng}`}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CharroiLocalisationDetail;
