import { useEffect, useState } from 'react';
import { notification, Button, Modal, Card, Typography, Spin, Empty } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getBonSortiePersoSortie, postBonSortiePersoSortie } from '../../../../../services/charroiService';

const { Title, Text } = Typography;

const SortieAgent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const fetchData = async () => {
    try {
      const { data } = await getBonSortiePersoSortie();
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

const groupByBandeSortie = (rawData) => {
  const grouped = {};

  rawData.forEach(item => {
    const id = item.id_bon_sortie;

    if (!grouped[id]) {
      grouped[id] = {
        ...item,
        signataires: []
      };
    }

    grouped[id].signataires.push({
      nom: item.personne_signe,
      role: item.role
    });
  });

  return Object.values(grouped);
    };

const groupedData = groupByBandeSortie(data);

  const onFinish = async (idBonSortie, idAgent) => {
    const value = {
      id_bon_sortie: idBonSortie,
      id_agent: idAgent,
    };

    try {
       await postBonSortiePersoSortie(value);
       notification.success({
        message: 'Entrée validée',
        description: `Le personnel avec le bon de sortie N° ${idBonSortie} a été retour avec succes`,
      });
      fetchData();

    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Impossible de valider l'entrée.",
      });
    }
  };

  return (
    <div className='securiteSortie'>
      <div className="securiteSortie_wrapper">
        <Title level={4} className="securite_title">🚗 Sortie des personnels</Title>

        {loading ? (
          <div className="securite_loader">
            <Spin tip="Chargement des véhicules..." size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="Aucune demande de sortie disponible." />
        ) : (
          <div className="securite_rows">
            {groupedData.map((d) => (
            <Card
                key={d.id_bon_sortie}
                className="securite_card"
                bordered
                hoverable
            >
                <div className="securite_card_content">
                <div className="securite_info">
                    <Text strong>Nom :</Text>
                    <Text>{d.nom}</Text>
                </div>
                <div className="securite_info">
                    <Text strong>Prenom :</Text>
                    <Text>{d.prenom}</Text>
                </div>
                <div className="securite_info">
                    <Text strong>Heure prévue :</Text>
                    <Text>{moment(d.date_prevue).format('HH:mm')}</Text>
                </div>
                <div className="securite_info">
                    <Text strong>Signataires :</Text>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {d.signataires.map((s, i) => (
                        <li key={i}>{s.nom} <em>({s.role})</em></li>
                    ))}
                    </ul>
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
                    onOk: () => onFinish(d.id_bon_sortie, d.id_personnel),
                    });
                }}
                >
                  Valider sortie
                </Button>
            </Card>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default SortieAgent;
