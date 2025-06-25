import { useEffect, useState } from 'react';
import { notification, Button, Modal, Card, Typography, Spin, Empty } from 'antd';
import { getSortieVehicule, postSortieVehicule } from '../../../../services/charroiService';
import { useSelector } from 'react-redux';
import './securiteSortie.scss';
import moment from 'moment';

const { Title, Text } = Typography;

const SecuriteSortie = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const fetchData = async () => {
    try {
      const { data } = await getSortieVehicule();
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

  const onFinish = async (idBandeSortie) => {
    const value = {
      id_bande_sortie: idBandeSortie,
      id_agent: userId,
    };

    try {
      await postSortieVehicule(value);
      notification.success({
        message: 'Sortie validée',
        description: `Le véhicule avec la bande ${idBandeSortie} a été validé pour sortir.`,
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
    <div className='securiteSortie'>
      <div className="securiteSortie_wrapper">
        <Title level={4} className="securite_title">🚗 Sortie des véhicules</Title>

        {loading ? (
          <div className="securite_loader">
            <Spin tip="Chargement des véhicules..." size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="Aucune demande de sortie disponible." />
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
                    <Text strong>Véhicule :</Text>
                    <Text>{d?.immatriculation}</Text>
                  </div>
                  <div className="securite_info">
                    <Text strong>Chauffeur :</Text>
                    <Text>{d?.nom}</Text>
                  </div>
                  <div className="securite_info">
                    <Text strong>Heure prevue :</Text>
                    <Text>{moment(d?.date_prevue).format('HH:mm')}</Text>
                  </div>
                </div>
                <Button
                    type="primary"
                size="small"
                onClick={() => {
                    Modal.confirm({
                    title: 'Confirmation de sortie',
                    content: `Voulez-vous vraiment valider la sortie maintenant à ${moment().format('HH:mm')} ?`,
                    okText: 'Oui, valider',
                    cancelText: 'Annuler',
                    onOk: () => onFinish(d.id_bande_sortie),
                    });
                }}
                >
                    Valider la sortie
                </Button>

              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuriteSortie;
