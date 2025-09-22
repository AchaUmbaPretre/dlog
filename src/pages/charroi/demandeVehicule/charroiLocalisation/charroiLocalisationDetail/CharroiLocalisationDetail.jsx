import React, { useEffect, useState, useRef } from 'react';
import './charroiLocalisationDetail.scss';
import { InteractionOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { notification, Spin, Alert } from 'antd';
import { getFalcon } from '../../../../../services/rapportService';
import CharroiLeaflet from './charroiLeaflet/CharroiLeaflet';

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
            <CharroiLeaflet vehicle={vehicle} />
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
