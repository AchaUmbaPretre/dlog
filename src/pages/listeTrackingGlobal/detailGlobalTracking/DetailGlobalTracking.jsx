import { useEffect, useState } from 'react';
import './detailGlobalTracking.scss'
import { notification, Spin, Button, Card, Tooltip, Typography, Tag, Divider } from 'antd';
import { RightCircleFilled, LeftCircleFilled, UserOutlined, EditOutlined } from '@ant-design/icons';
import { getSuiviTacheUne } from '../../../services/suiviService';
const { Title, Text } = Typography;

const DetailGlobalTracking = ({ idTrack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idTache, setIdTache] = useState(idTrack); 

  useEffect(() => {
    setIdTache(idTrack);
  }, [idTrack]);

  const fetchData = async () => {
    try {
      const response = await getSuiviTacheUne(idTache);
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
  }, [idTache]);

    const goToNext = () => {
    setIdTache((prevId) => prevId + 1);
  };

  const goToPrevious = () => {
    setIdTache((prevId) => (prevId > 1 ? prevId - 1 : prevId));
  };

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
        <Card size="small">
          <h2 className="detail_global_h2">Détails du Suivi</h2>
        </Card>

        <div className="detail_global_arrow">
          <Tooltip title="Précédent">
            <Button className="row-arrow" onClick={goToPrevious}>
              <LeftCircleFilled className="icon-arrow" />
            </Button>
          </Tooltip>

          <Tooltip title="Suivant">
            <Button className="row-arrow" onClick={goToNext}>
              <RightCircleFilled className="icon-arrow" />
            </Button>
          </Tooltip>
        </div>
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
                <span className="detail_global_txt" style={{display:'flex', flexDirection:'column', gap:'10px'}}><strong>💬 Commentaire : </strong>
                <div>
                  {item.commentaire}
                </div>
                </span>
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
