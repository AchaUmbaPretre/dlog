import { useEffect, useState } from 'react';
import { notification, Button, Card, Typography, Empty, Spin } from 'antd';
import { getSortieVisiteur, putSortieVisiteur } from '../../../../../services/charroiService';
import moment from 'moment';
const { Title, Text } = Typography;

const VisiteurSortie = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await getSortieVisiteur();
      setData(data);

    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const onFinish = async (idVisiteur) => {

    try {
      await putSortieVisiteur(idVisiteur);
      notification.success({
        message: 'Sortie validée',
        description: `Le visiteur est sorti`,
      });
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de valider la sortie.',
      });
    }
  };

  return (
    <div className='securiteRetour'>
      <div className="securiteRetour_wrapper">
        <Title level={5} className="securite_title">🔁 Sortie des visiteurs</Title>

        {loading ? (
          <div className="securite_loader">
            <Spin tip="Chargement des ..." size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="Aucun piéton disponible." />
        ) : (
          <div className="securite_rows">
            {data.map((d) => (
              <Card
                key={d.id_visiteur}
                className="securite_card"
                bordered
                hoverable
              >
                <div className="securite_card_content">

                  <div className="securite_info">
                    <Text strong>Chauffeur : </Text>
                    <Text>{d?.nom_chauffeur}</Text>
                  </div>

                  <div className="securite_info">
                    <Text strong>Plaque : </Text>
                    <Text>{d?.immatriculation}</Text>
                  </div>

                  <div className="securite_info">
                    <Text strong>Heure d'entrée : </Text>
                    <Text>{moment(d?.date_entree).format("HH:mm")}</Text>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="small"
                  onClick={() => onFinish(d.id_registre_visiteur)}
                >
                  Valider le retour
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisiteurSortie;
