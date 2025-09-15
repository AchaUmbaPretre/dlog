import { notification, Typography, Tabs } from 'antd';
import './rapportVehiculeUtilitaire.scss';
import RapportUtilitaireDispo from './rapportUtilitaireDispo/RapportUtilitaireDispo';
import RapportUtilitaireCourse from './rapportUtilitaireCourse/RapportUtilitaireCourse';
import RapportUtilitaireHorsCourseM from './rapportUtilitaireHorsCourseM/RapportUtilitaireHorsCourseM';
import { getRapportUtilitaire } from '../../../../services/rapportService';
import { useEffect, useState } from 'react';
import { Spacing } from 'docx';


const { Text } = Typography;

const RapportVehiculeUtilitaire = () => {
  const [dispo, setDispo] = useState([]);
  const [course, setCourse] = useState([]);
  const [moyenne, setMoyenne] = useState([]);
  const [activeKey, setActiveKey] = useState("1");


  const fetchData = async () => {
    try {
      const { data } = await getRapportUtilitaire();
      setDispo(data.listVehiculeDispo);
      setCourse(data.listVehiculeCourse);
      setMoyenne(data.listVehiculeMoyenne);

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

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <>
      <div className="rapportVehiculeUtilitaire">
        <div className="rapport_utilitaire_wrapper">
          <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
            type="card"
            tabPosition="top"
          >
            <Tabs.TabPane
              key={1}
              tab={
                <span>
                    <span>Véhicules disponibles</span>
                </span>
              }
            >
              <RapportUtilitaireDispo data={dispo} />
            </Tabs.TabPane>

            <Tabs.TabPane
              key={2}
              tab={
                <span>
                    <span>Véhicules en course</span>
                </span>
              }
            >
              <RapportUtilitaireCourse data={course} />
            </Tabs.TabPane>

            <Tabs.TabPane
              key={3}
              tab={
                <span>
                    <span>Moyennes pour les véhicules hors course</span>
                </span>
              }
            >
              <RapportUtilitaireHorsCourseM data={moyenne} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default RapportVehiculeUtilitaire;
