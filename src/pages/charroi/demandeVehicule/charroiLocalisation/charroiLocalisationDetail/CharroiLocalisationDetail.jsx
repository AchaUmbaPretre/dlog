import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotatedmarker';
import { InteractionOutlined, UserOutlined, ClockCircleOutlined, DashboardOutlined, AlertOutlined } from '@ant-design/icons';
import { notification, Spin, Alert, Card, Divider, Tag } from 'antd';
import vehiculeIconImg from './../../../../../assets/vehicule01.png';
import { getFalcon } from '../../../../../services/rapportService';
import './charroiLocalisationDetail.scss';

// ---------------- VehicleMarker ----------------
const VehicleMarker = ({ vehicle }) => {
  const markerRef = useRef(null);
  const lastPos = useRef([vehicle.lat, vehicle.lng]);
  const targetPos = useRef([vehicle.lat, vehicle.lng]);
  const map = useMap();

  // Mise à jour de la position cible uniquement si online
  useEffect(() => {
    if (!vehicle) return;
    if (vehicle.online === "online") {
      targetPos.current = [vehicle.lat, vehicle.lng];
      map.flyTo([vehicle.lat, vehicle.lng], map.getZoom(), { duration: 0.5 });
    }
  }, [vehicle, map]);

  // Animation fluide de la position du véhicule
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

          // Rotation selon la direction
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

// ---------------- CharroiLeaflet ----------------
const CharroiLeaflet = ({ vehicle }) => {
  return (
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
  );
};

// ---------------- CharroiLocalisationDetail ----------------
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
    interval = setInterval(fetchData, 2000); // polling toutes les 2s
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <Spin tip="Chargement..." style={{ width: '100%', marginTop: 50 }} />;
  if (error) return <Alert message={error} type="error" style={{ marginTop: 20 }} />;
  if (!vehicle) return <Alert message="Véhicule introuvable ou coordonnées manquantes" type="warning" />;

  const sensors = vehicle.sensors?.map(s => (
    <Tag key={s.id} color={s.type === 'engine' ? (s.val ? 'green' : 'red') : 'blue'}>
      {s.name}: {s.value}
    </Tag>
  ));

  return (
    <div className="charroi_local_detail">
      <div className="charroi_top">
        <div className="charroi_top_left">
          <h3 className="charroi_h3">
            {vehicle.name} <Tag color={vehicle.online === 'online' ? 'green' : 'red'}>{vehicle.online.toUpperCase()}</Tag>
          </h3>
          <span className="charroi_desc">{vehicle.address || '-'}</span>
          <div>Plate: {vehicle.plate_number || vehicle.registration_number}</div>
        </div>
        <div className="charroi_top_right">
          <span className="charroi_desc">Dernier signal : {vehicle.time}</span>
        </div>
      </div>

      <Divider />

      <div className="charroi_local">
        <div className="charroi_local_left">
          <CharroiLeaflet vehicle={vehicle} />
        </div>

        <div className="charroi_local_right">
          <Card title="Informations générales" bordered style={{ marginBottom: 20 }}>
            <p><InteractionOutlined /> Statut: {vehicle.online === 'online' ? 'En mouvement' : 'Arrêté'}</p>
            <p><UserOutlined /> Course: {vehicle.course}°</p>
            <p><ClockCircleOutlined /> Stop durée: {vehicle.stop_duration}</p>
            <p><DashboardOutlined /> Distance totale: {vehicle.total_distance} km</p>
            <p><DashboardOutlined /> Odomètre virtuel: {vehicle.odometer || 0} km</p>
            <p><AlertOutlined /> Alarm: {vehicle.alarm}</p>
            {sensors && <div className="sensors">{sensors}</div>}
          </Card>

          <Card title="Dernières positions" bordered>
            {vehicle.latest_positions?.split(';').map((pos, i) => {
              const [lat, lng] = pos.split('/');
              return <p key={i}>#{i + 1}: Lat {lat}, Lng {lng}</p>;
            })}
          </Card>

          {vehicle.tail?.length > 0 && (
            <Card title="Trajectoire (tail)" bordered style={{ marginTop: 20 }}>
              {vehicle.tail.map((t, i) => (
                <p key={i}>#{i + 1}: Lat {t.lat}, Lng {t.lng}</p>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharroiLocalisationDetail;
