import React, { useEffect, useState } from 'react';
import { getNotificationOne } from '../../../services/tacheService';
import { notification, Skeleton, Card } from 'antd';

const Notification = ({ idNotif }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getNotificationOne(idNotif);
      setData(response.data);
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
    if (idNotif) {
      fetchData();
    }
  }, [idNotif]);

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Détails de la notification" bordered style={{ maxWidth: 500 }}>
        {loading ? (
          <>
            <Skeleton active paragraph={{ rows: 3 }} />
          </>
        ) : data ? (
          <>
            <p><strong>Message :</strong> {data.message}</p>
            <p><strong>Date :</strong> {new Date(data.timestamp).toLocaleString('fr-FR')}</p>
            <p><strong>Utilisateur :</strong> {data.nom} {data.prenom}</p>
          </>
        ) : (
          <p>Aucune notification trouvée pour l'ID spécifié.</p>
        )}
      </Card>
    </div>
  );
};

export default Notification;