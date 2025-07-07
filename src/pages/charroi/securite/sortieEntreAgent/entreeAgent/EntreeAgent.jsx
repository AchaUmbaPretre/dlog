import { useEffect, useState } from 'react';
import { notification, Button, Card, Typography, Empty, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { getBonSortiePersoRetour, postBonSortiePersoRetour } from '../../../../../services/charroiService';

const { Title, Text } = Typography;

const EntreeAgent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const fetchData = async () => {
    try {
      const { data } = await getBonSortiePersoRetour();
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

  const onFinish = async (idBonSortie, idAgent) => {
    const value = {
      id_bon_sortie: idBonSortie,
      id_agent: idAgent,
    };

    try {
       await postBonSortiePersoRetour(value);
        notification.success({
        message: 'Retour validé',
        description: `Le personnel avec le bon de sortie ${idBonSortie} a été validé pour le retour.`,
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
        <Title level={4} className="securite_title">🔁 Retours des personnels</Title>

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
                key={d.id_bon_sortie}
                className="securite_card"
                bordered
                hoverable
              >
                <div className="securite_card_content">
                  <div className="securite_info">
                    <Text strong>Nom : </Text>
                    <Text>{d?.nom}</Text>
                  </div>
                  <div className="securite_info">
                    <Text strong>Prenom : </Text>
                    <Text>{d?.prenom}</Text>
                  </div>
                  <div className="securite_info">
                    <Text strong>Destination : </Text>
                    <Text>{d?.nom_destination}</Text>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="small"
                  onClick={() => onFinish(d.id_bon_sortie, d.id_personnel)}
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

export default EntreeAgent;
