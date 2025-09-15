import { notification, Typography } from 'antd';
import './rapportVehiculeUtilitaire.scss';
import RapportUtilitaireDispo from './rapportUtilitaireDispo/RapportUtilitaireDispo';
import RapportUtilitaireCourse from './rapportUtilitaireCourse/RapportUtilitaireCourse';
import RapportUtilitaireHorsCourseM from './rapportUtilitaireHorsCourseM/RapportUtilitaireHorsCourseM';
import { getRapportUtilitaire } from '../../../../services/rapportService';
import { useEffect, useState } from 'react';

const { Text } = Typography;

const RapportVehiculeUtilitaire = () => {
  const [dispo, setDispo] = useState([]);
  const [course, setCourse] = useState([]);
  const [moyenne, setMoyenne] = useState([])

  const fetchData = async () => {
    try {
      const { data } = await getRapportUtilitaire();

    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="rapportVehiculeUtilitaire">
        <div className="rapport_utilitaire_wrapper">
          <div className="rapport_utilitaire_top">
            <RapportUtilitaireDispo/>
            <RapportUtilitaireCourse/>
          </div>
          <div className="rapport_utilitaire_bottom">
            <RapportUtilitaireHorsCourseM/>
          </div>
        </div>
      </div>
    </>
  );
};

export default RapportVehiculeUtilitaire;
