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
        <Card style={{margin:0}}>
          <h2 className="detail_global_h2">Détails du Suivi</h2>
        </Card>
        
        <Card>
          <div className="detail_global_bottom_wrapper">
          {data.map(item => (
            
            <div className="detail_global_bottom">
              <h2 className="detail_global_title">Titre : {item.nom_tache}</h2>

              <Divider style={{margin:'0'}} />

              <div className="detail_global_bottom_rows">
                <span className="detail_global_txt"><strong>👤 Effectué par : </strong>{item.nom}</span>
                <Divider style={{margin:'0'}} />
                <span className="detail_global_txt"><strong>🗓️ Date de suivi : </strong>{new Date(item.date_suivi).toLocaleString()}</span>
                <Divider style={{margin:'0'}} />
                <span className="detail_global_txt"><strong>✅ Statut : </strong><Tag color={item.est_termine === 'Oui' ? 'green' : 'volcano'}>{item.nom_type_statut}</Tag></span>
                <Divider style={{margin:'0'}} />
                <span className="detail_global_txt"><strong>💬 Commentaire :</strong>{item.commentaire}</span>
              </div>
            </div>
          ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DetailGlobalTracking;
