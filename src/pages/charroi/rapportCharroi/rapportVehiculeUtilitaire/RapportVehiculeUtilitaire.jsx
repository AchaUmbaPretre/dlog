import { notification, Typography, Tabs, Space } from 'antd';
import { CarOutlined, TruckOutlined, ClockCircleOutlined } from '@ant-design/icons';
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
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // rafraîchissement toutes les 5s
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div className="rapportVehiculeUtilitaire">
      <div className="rapport_utilitaire_wrapper">
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          type="card"
          tabPosition="top"
          size="large"
        >
          <Tabs.TabPane
            key="1"
            tab={
              <Space>
                <CarOutlined style={{ color: "#52c41a" }} />
                <Text strong>Véhicules disponibles</Text>
              </Space>
            }
          >
            <RapportUtilitaireDispo data={dispo} />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="2"
            tab={
              <Space>
                <TruckOutlined style={{ color: "#fa8c16" }} />
                <Text strong>Véhicules en course</Text>
              </Space>
            }
          >
            <RapportUtilitaireCourse data={course} />
          </Tabs.TabPane>

          <Tabs.TabPane
            key="3"
            tab={
              <Space>
                <ClockCircleOutlined style={{ color: "#1890ff" }} />
                <Text strong>Moyennes véhicules hors course</Text>
              </Space>
            }
          >
            <RapportUtilitaireHorsCourseM data={moyenne} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default RapportVehiculeUtilitaire;
