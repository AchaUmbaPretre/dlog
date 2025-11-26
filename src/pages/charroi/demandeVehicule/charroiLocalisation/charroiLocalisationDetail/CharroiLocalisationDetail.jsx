import { useEffect, useState } from 'react';
import { Card, Divider, Tag, notification, Spin, Alert } from 'antd';
import { InteractionOutlined, UserOutlined, ClockCircleOutlined, DashboardOutlined, AlertOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { getFalcon } from '../../../../../services/rapportService';
import './charroiLocalisationDetail.scss';
import { fetchAddress } from '../../../../../utils/fetchAddress';
import { CharroiLeaflet } from '../../../../../components/charroiLeaflet/CharroiLeaflet';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, Legend);

// -------- CACHE PERSISTANT --------
let addressCache = {};
try {
  const stored = localStorage.getItem('vehicleAddressCache');
  if (stored) addressCache = JSON.parse(stored);
} catch (err) {
  console.warn('Impossible de lire le cache localStorage', err);
}

const CharroiLocalisationDetail = ({ id }) => {
  const [vehicle, setVehicle] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [speedData, setSpeedData] = useState([]);
  const [engineData, setEngineData] = useState([]);
  const API_KEY = 'f7c5292b587d4fff9fb1d00f3b6f3f73';

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const { data } = await getFalcon();
        const items = Array.isArray(data) && data.length > 0 ? data[0].items || [] : [];
        const selected = items.find(v => v.id === id);
        if (!selected) throw new Error('Véhicule introuvable');
        setVehicle(selected);

        const addr = await fetchAddress(selected);
        setAddress(addr);

        setSpeedData(prev => [...prev.slice(-9), selected?.speed || 0]);
        setEngineData(prev => [...prev.slice(-9), selected.sensors?.find(s => s.type === 'engine')?.val ? 1 : 0]);
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
    interval = setInterval(fetchData, 2000);
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

  const safeSpeedData = (speedData && speedData.length > 0 ? speedData : [0]).map(v => Number(v) || 0);
  const safeEngineData = (engineData && engineData.length > 0 ? engineData : [0]).map(v => Number(v) || 0);

  const chartData = {
    labels: speedData.length ? speedData.map((_, i) => i + 1) : [0],
    datasets: [
      { label: 'Vitesse (km/h)', data: speedData.length ? speedData : [0], fill: false, borderColor: 'blue', tension: 0.3 },
      { label: 'Moteur (On=1, Off=0)', data: engineData.length ? engineData : [0], fill: false, borderColor: 'red', tension: 0.3 },
    ],
  };

  const chartOptions = { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { min: 0 } } };

  return (
    <div className="charroi_local_detail">
      <div className="charroi_top">
        <div className="charroi_top_left">
          <h3 className="charroi_h3">
            {vehicle.name} <Tag color={vehicle.online === 'online' ? 'green' : 'red'}>{vehicle.online.toUpperCase()}</Tag>
          </h3>
          <span className="charroi_desc">{address || '-'}</span>
          <div>Plate: {vehicle.plate_number || vehicle.registration_number}</div>
        </div>
        <div className="charroi_top_right">
          <span className="charroi_desc">Dernier signal : {vehicle.time}</span>
        </div>
      </div>

      <Divider />

      <div className="charroi_local">
        <div className="charroi_local_left">
          <CharroiLeaflet vehicle={vehicle} address={address} />

          {safeSpeedData.length > 0 && safeEngineData.length > 0 && (
            <Line data={chartData} options={chartOptions} />
          )}

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
                {vehicle?.tail.map((t, i) => {
                const lat = parseFloat(t.lat);
                const lng = parseFloat(t.lng);
                const key = `${lat}_${lng}`;
                // Vérifier si adresse déjà en cache
                const addr = addressCache[key] || '-';

                // Si pas en cache, lancer reverse geocoding async
                if (!addressCache[key]) {
                    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}&language=fr`                    )
                    .then(res => res.json())
                    .then(data => {
                        const a = data?.results?.[0]?.formatted || "";
                        addressCache[key] = a;
                        try { localStorage.setItem('vehicleAddressCache', JSON.stringify(addressCache)); } catch {}
                    })
                    .catch(err => console.error('Erreur reverse geocoding tail:', err));
                }

                return (
                    <p key={i}>
                    #{i + 1}: Adresse: {addr}
                    </p>
                );
                })}
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default CharroiLocalisationDetail;
