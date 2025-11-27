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
  Tooltip,
  Legend,
} from 'chart.js';
import { getFalcon } from '../../../../../services/rapportService';
import './charroiLocalisationDetail.scss';
import { fetchAddress } from '../../../../../utils/fetchAddress';
import { CharroiLeaflet } from '../../../../../components/charroiLeaflet/CharroiLeaflet';
import TailAddresses from './tailAddresses/TailAddresses';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const CharroiLocalisationDetail = ({ id }) => {
  const [vehicle, setVehicle] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [speedData, setSpeedData] = useState([]);
  const [engineData, setEngineData] = useState([]);

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

        // Mise à jour des datas proprement
        setSpeedData(prev => [...prev.slice(-9), Number(selected?.speed || 0)]);
        const engineVal = selected.sensors?.find(s => s.type === 'engine')?.val ? 1 : 0;
        setEngineData(prev => [...prev.slice(-9), engineVal]);
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

  const chartData = {
    labels: Array.from({ length: Math.max(speedData.length, engineData.length) }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Vitesse (km/h)',
        data: speedData,
        borderColor: 'blue',
        backgroundColor: 'blue',
        yAxisID: 'y',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Moteur (On=1, Off=0)',
        data: engineData,
        borderColor: 'red',
        backgroundColor: 'red',
        yAxisID: 'y1',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // très important pour que le chart s'affiche
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: { display: true, text: 'Vitesse (km/h)' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        max: 1,
        title: { display: true, text: 'Moteur' },
        grid: { drawOnChartArea: false },
      },
      x: { title: { display: true, text: 'Derniers signaux' } },
    },
  };

  return (
    <div className="charroi_local_detail">
      <div className="charroi_top">
        <div className="charroi_top_left">
          <h3 className="charroi_h3">
            {vehicle.name}{' '}
            <Tag color={vehicle.online === 'online' ? 'green' : 'red'}>{vehicle.online.toUpperCase()}</Tag>
          </h3>
          <span className="charroi_desc">{address || '-'}</span>
        </div>
        <div className="charroi_top_right">
          <span className="charroi_desc">Dernier signal : {vehicle.time}</span>
        </div>
      </div>

      <Divider />

      <div className="charroi_local">
        <div className="charroi_local_left">
          <CharroiLeaflet vehicle={vehicle} address={address} />
        </div>
        <div className="charroi_infos">
          <Card title="Informations générales" bordered style={{ marginTop: 20 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)'}}>
              <p>
                <InteractionOutlined /> Statut: {vehicle.online === 'online' ? 'En mouvement' : 'Arrêté'}
              </p>
              <p>
                <UserOutlined /> Course: {vehicle.course}°
              </p>
              <p>
                <ClockCircleOutlined /> Stop durée: {vehicle.stop_duration}
              </p>
              <p>
                <DashboardOutlined /> Distance totale: {vehicle.total_distance} km
              </p>
              <p>
                <DashboardOutlined /> Odomètre virtuel: {vehicle.odometer || 0} km
              </p>
              <p>
                <AlertOutlined /> Alarm: {vehicle.alarm}
              </p>
              {sensors && <div className="sensors">{sensors}</div>}
            </div>
          </Card>
        </div>
        <div className="charroi_local_right">
          <Card title="Graphique vitesse / moteur" bordered style={{ marginBottom: 20, flex: 2 }}>
            <Line data={chartData} options={chartOptions} />
          </Card>
          <TailAddresses vehicle={vehicle} />
        </div>
      </div>
    </div>
  );
};

export default CharroiLocalisationDetail;
