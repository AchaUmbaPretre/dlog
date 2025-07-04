import { useEffect, useState } from 'react';
import { notification, Button, Card, Typography, Empty, Spin } from 'antd';
import { getPietonRetour, putPietonRetour } from '../../../../../../services/userService';

const { Title, Text } = Typography;

const SortieVisiteurPieton = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await getPietonRetour();
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
      await putPietonRetour(idVisiteur);
      notification.success({
        message: 'Sortie validé',
        description: `Le pieton est sorti`,
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
        <Title level={5} className="securite_title">🔁 Sortie des visiteurs piétons</Title>

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
                    <Text strong>Nom : </Text>
                    <Text>{d?.nom_complet}</Text>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="small"
                  onClick={() => onFinish(d.id_visiteur)}
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

export default SortieVisiteurPieton;
