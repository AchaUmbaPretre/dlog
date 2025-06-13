import { useEffect, useState } from 'react';
import './detailGlobalTracking.scss'
import { notification, Spin, Card, Col, Row, Typography, Tag, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { getSuiviTacheUne } from '../../../services/suiviService';
const { Title, Text } = Typography;

const DetailGlobalTracking = ({ idTrack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await getSuiviTacheUne(idTrack);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idTrack]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem' }}>Aucune donnée disponible.</div>;
  }

  return (
    <div className='detail_global_tracking'>
      <div className="detail_global_wrapper">

        <h2 className="detail_global_h2">Détails du Suivi</h2>

        <div className="detail_global_bottom_wrapper">
        {data.map(item => (
          
          <div className="detail_global_bottom">
            <h2 className="detail_global_title">{item.nom_tache}</h2>

            <Divider style={{margin:'0', margin:'10px'}} />

            <div className="detail_global_bottom_rows">
              <span className="detail_global_txt">👤 Effectué par : <strong>{item.nom}</strong></span>
              <span className="detail_global_txt">🗓️ Date de suivi : <strong>{new Date(item.date_suivi).toLocaleString()}</strong></span>
              <span className="detail_global_txt">✅ Statut : <strong><Tag color={item.est_termine === 'Oui' ? 'green' : 'volcano'}>{item.nom_type_statut}</Tag></strong></span>
              <span className="detail_global_txt">💬 Commentaire : <strong>{item.commentaire}</strong></span>
            </div>
          </div>
        ))}
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default DetailGlobalTracking;
