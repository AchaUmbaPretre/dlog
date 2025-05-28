import { useEffect, useState } from 'react';
import './trajetDetail.scss';
import { getTrajetOne } from '../../../../services/transporteurService';
import { Card, Typography, Spin } from 'antd';
import { CalendarOutlined, CarOutlined, DollarOutlined, DashboardOutlined, ClockCircleOutlined } from '@ant-design/icons';
const { Text } = Typography;

const TrajetDetail = ({ id_trajet }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTrajetOne(id_trajet);
        setData(response.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des trajets :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_trajet]);

  return (
    <div className="trajetDetail">
      <div className="trajetDetail_wrapper">
        <div className="trajet-title">
            <h2 className="trajet_h2">Détails du trajet</h2>
        </div>

        {loading ? (
          <Spin size="large" />
        ) : data.length === 0 ? (
          <Text>Aucun détail disponible pour ce trajet.</Text>
        ) : (
          <div className="trajet_row">
            {data.map((trajet, index) => (
              <Card
                type="inner"
                key={index}
                title={`Segment ${index + 1} : ${trajet.depart_destination}`}
                style={{ marginBottom: 20 }}
                bordered
              >
                <p><CalendarOutlined />  <strong>Date de départ :</strong> {new Date(trajet.date_depart).toLocaleDateString()}</p>
                <p><CalendarOutlined />  <strong>Date d'arrivée :</strong> {new Date(trajet.date_arrivee).toLocaleDateString()}</p>
                <p><DashboardOutlined />  <strong>Distance :</strong> {trajet.distance} km</p>
                <p><ClockCircleOutlined/>  <strong>Durée :</strong> {trajet.duree_jours} jours</p>
                <p><CarOutlined />  <strong>Mode de transport :</strong> {trajet.modes_transport}</p>
                <p><DollarOutlined />  <strong>Coût total :</strong> {trajet.total} $</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrajetDetail;
