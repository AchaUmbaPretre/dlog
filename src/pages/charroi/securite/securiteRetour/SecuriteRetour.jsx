import { useEffect, useState } from 'react';
import { notification, Button, Card, Typography, Empty, Spin } from 'antd';
import { getRetourVehicule, postRetourVehicule } from '../../../../services/charroiService';
import { useSelector } from 'react-redux';
import './securiteRetour.scss';

const { Title, Text } = Typography;

const SecuriteRetour = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const fetchData = async () => {
    try {
      const { data } = await getRetourVehicule();
      setData(data);

      if (data.length === 0) {
        notification.info({
          message: 'Aucune demande',
          description: 'Il n’y a actuellement aucune demande de retour de véhicule.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const onFinish = async (idBandeSortie) => {
    const value = {
      id_bande_sortie: idBandeSortie,
      id_agent: userId,
    };

    try {
      await postRetourVehicule(value);
      notification.success({
        message: 'Retour validé',
        description: `Le véhicule avec le bon de sortie ${idBandeSortie} a été validé pour l’entrée.`,
      });
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de valider le retour.',
      });
    }
  };

  return (
    <div className='securiteRetour'>
      <div className="securiteRetour_wrapper">
        <Title level={4} className="securite_title">🔁 Retours des véhicules</Title>

        {loading ? (
          <div className="securite_loader">
            <Spin tip="Chargement des véhicules..." size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="Aucune demande de retour disponible." />
        ) : (
          <div className="securite_rows">
            {data.map((d) => (
              <Card
                key={d.id_bande_sortie}
                className="securite_card"
                bordered
                hoverable
              >
                <div className="securite_card_content">
                  <div className="securite_info">
                    <Text strong>Véhicule : </Text>
                    <Text>{d?.immatriculation}</Text>
                  </div>
                  <div className="securite_info">
                    <Text strong>Chauffeur : </Text>
                    <Text>{d?.nom}</Text>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="small"
                  onClick={() => onFinish(d.id_bande_sortie)}
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

export default SecuriteRetour;
