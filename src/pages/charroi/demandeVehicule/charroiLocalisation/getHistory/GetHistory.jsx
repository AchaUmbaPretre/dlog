import { useEffect, useState } from 'react';
import { DatePicker, message, Card, Row, Col, Badge, Table, Divider, Spin } from 'antd';
import axios from 'axios';
import config from '../../../../../config';
import dayjs from 'dayjs';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const { RangePicker } = DatePicker;

const GetHistory = ({ id }) => {
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const apiHash = config.api_hash;

  const fetchData = async (from, to) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://falconeyesolutions.com/api/get_history?device_id=${id}&from_date=${from.split(' ')[0]}&from_time=${from.split(' ')[1]}&to_date=${to.split(' ')[0]}&to_time=${to.split(' ')[1]}&lang=fr&limit=50&user_api_hash=${apiHash}`
      );

      if (data) {
        setVehicleData(data);
      } else {
        message.info("Aucun historique trouvé pour cette période.");
      }
    } catch (error) {
      console.error('Erreur lors du fetch:', error);
      message.error("Erreur lors du chargement des événements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const startOfDay = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfDay = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    setDateRange([dayjs().startOf('day'), dayjs().endOf('day')]);
    fetchData(startOfDay, endOfDay);
  }, []);

  const handleDateChange = (values) => {
    setDateRange(values);
    if (values && values.length === 2) {
      const from = values[0].format('YYYY-MM-DD HH:mm:ss');
      const to = values[1].format('YYYY-MM-DD HH:mm:ss');
      fetchData(from, to);
    }
  };

  // Préparer positions pour la carte
  const positions = vehicleData?.items?.flatMap(i =>
    i.items?.map(it => [it.lat, it.lng]) || []
  ) || [];

  // Préparer données pour le graphique
  const chartData = {
    labels: vehicleData?.items?.flatMap((i, idx) =>
      i.items?.map((it, j) => `Ev ${idx + 1}-${j + 1}`)
    ) || [],
    datasets: [
      {
        label: 'Vitesse (kph)',
        data: vehicleData?.items?.flatMap(i =>
          i.items?.map(it => it.sensors_data?.find(s => s.id === 'speed')?.value || 0)
        ) || [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
      {
        label: 'Carburant (L)',
        data: vehicleData?.items?.flatMap(i =>
          i.items?.map(it => it.sensors_data?.find(s => s.id === 'sensor_1728')?.value || 0)
        ) || [],
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
      },
    ],
  };

  // Préparer données pour la table des événements
  const tableData = vehicleData?.items?.flatMap((i, idx) =>
    i.items?.map((it, j) => ({
      key: `${idx}-${j}`,
      time: it.time || 'N/A',
      speed: it.sensors_data?.find(s => s.id === 'speed')?.value || 0,
      fuel: it.sensors_data?.find(s => s.id === 'sensor_1728')?.value || 0,
      ignition: it.other_arr?.find(x => x.includes('ignition'))?.split(': ')[1] || 'N/A',
      door: it.other_arr?.find(x => x.includes('door'))?.split(': ')[1] || 'N/A',
      lat: it.lat,
      lng: it.lng,
      distance: it.distance || 0,
    })) || []
  ) || [];

  const itemColumns = [
    { title: 'Heure', dataIndex: 'time', key: 'time' },
    { title: 'Vitesse (kph)', dataIndex: 'speed', key: 'speed' },
    { title: 'Carburant (L)', dataIndex: 'fuel', key: 'fuel' },
    { title: 'Ignition', dataIndex: 'ignition', key: 'ignition' },
    { title: 'Porte', dataIndex: 'door', key: 'door' },
    { title: 'Distance', dataIndex: 'distance', key: 'distance' },
    { title: 'Lat', dataIndex: 'lat', key: 'lat' },
    { title: 'Lng', dataIndex: 'lng', key: 'lng' },
  ];

  return (
    <div className="event_container">
      <h2 className="title_event">📊 Détail du device</h2>
      <div className="event_wrapper">
        <div className="event_top" style={{ marginBottom: 20 }}>
          <RangePicker
            style={{ width: '100%' }}
            value={dateRange}
            onChange={handleDateChange}
            allowClear
            showTime={{ format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            placeholder={['Date et heure début', 'Date et heure fin']}
          />
        </div>

        {loading && <Spin tip="Chargement des données..." style={{ width: '100%' }} />}

        {vehicleData && (
          <>
            {/* Informations générales */}
            <Card title={`🚗 ${vehicleData.device?.name || 'N/A'}`} bordered style={{ marginBottom: 20 }}>
              <Row gutter={16}>
                <Col span={8}><b>ID Device:</b> {vehicleData.device?.id || 'N/A'}</Col>
                <Col span={8}><b>IMEI:</b> {vehicleData.device?.imei || 'N/A'}</Col>
                <Col span={8}>
                  <b>Status:</b>
                  <Badge status={vehicleData.status ? 'success' : 'error'} text={vehicleData.status ? 'Actif' : 'Inactif'} />
                </Col>
              </Row>
            </Card>

            <Divider />

            {/* Carte */}
            <Card title="🗺️ Trajectoire">
              <MapContainer
                center={positions[0] || [0, 0]}
                zoom={positions.length > 0 ? 13 : 2}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {positions.length > 0 && (
                  <>
                    <Polyline positions={positions} color="blue" />
                    <Marker position={positions[0]}>
                      <Tooltip>Départ</Tooltip>
                    </Marker>
                    <Marker position={positions[positions.length - 1]}>
                      <Tooltip>Arrivée</Tooltip>
                    </Marker>
                  </>
                )}
              </MapContainer>
            </Card>

            <Divider />

            {/* Graphiques */}
            <Card title="📈 Graphiques">
              <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </Card>

            <Divider />

            {/* Table événements */}
            <Card title="📝 Événements" bordered>
              <Table
                columns={itemColumns}
                dataSource={tableData}
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default GetHistory;
