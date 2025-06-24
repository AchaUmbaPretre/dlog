import { useEffect, useState } from 'react'
import { notification, Button } from 'antd';
import { getSortieVehicule, postRetourVehicule, postSortieVehicule } from '../../../../services/charroiService';
import { useSelector } from 'react-redux';

const SecuriteRetour = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const fetchData = async () => {
    try {
      const { data } = await getSortieVehicule();
      setData(data);
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
  }, []);

  const onFinish = async(idBandeSortie) => {
    const value = {
        id_bande_sortie: idBandeSortie,
        id_agent: userId
    }
    await postRetourVehicule(value);
    fetchData();
    notification.success({
      message: 'Sortie validée',
      description: `Le véhicule avec le bon de sortie ${idBandeSortie} a été validé pour entrée.`,
    });
  };

  return (
    <div className='securiteSortie'>
    { data.length === 0 ? (<div className="securite_sortie_empty">🚫 Aucune demande de sortie disponible.</div>) : (
      <div className="securiteSortie_wrapper">
        <h2 className="securite_sortie_h2">Liste des véhicules à retourner</h2>
        <div className="securite_sortie_rows">
          {data.map((d) => (
            <div className="securite_sortie_row" key={d.id_bande_sortie}>
              <div className="row">
                <strong className="securite_strong">
                  Véhicule : <span className="securite_desc">{d?.immatriculation}</span>
                </strong>
                <strong className="securite_strong">
                  Chauffeur : <span className="securite_desc">{d?.nom}</span>
                </strong>
              </div>

              <Button
                type='primary'
                className='securite_btn'
                onClick={() => onFinish(d.id_bande_sortie)}
                loading={loading}
              >
                Retourné
              </Button>
            </div>
          ))}
        </div>
      </div>
      )
    }
    </div>
  );
};

export default SecuriteRetour;
