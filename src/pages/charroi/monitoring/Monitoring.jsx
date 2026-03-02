import { useEffect, useState, useCallback, useMemo } from 'react';
import { notification, Tabs, Badge } from 'antd';
import {
  EnvironmentOutlined,
  CarOutlined,
  BarChartOutlined,
  DesktopOutlined,
  BellOutlined,
  WifiOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import RapportEvent from '../demandeVehicule/charroiLocalisation/rapportEvent/RapportEvent';
import CharroiLocalisation from '../demandeVehicule/charroiLocalisation/CharroiLocalisation';
import GetEventLocalisation from '../demandeVehicule/charroiLocalisation/getEventLocalisation/GetEventLocalisation';
import MoniRealTime from './monoRealTime/MoniRealTime';
import RapportMoniUtilitaire from './rapportMoniUtilitaire/RapportMoniUtilitaire';
import ModeTv from './moniKiosque/ModeTv';
import RapportVehiculeCourses from './moniKiosque/rapportVehiculeCourses/RapportVehiculeCourses';
import { getFalcon, getRapportCharroiVehicule } from '../../../services/rapportService';
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';

const REFRESH_INTERVAL = 30000; // 30s pour les rapports
const FALCON_INTERVAL = 5000; // 5s pour le temps réel

const Monitoring = () => {
  const [activeKey, setActiveKey] = useState('1');
  const [courses, setCourses] = useState([]);
  const [falcon, setFalcon] = useState([]);

  const fetchFalcon = useCallback(async () => {
    try {
      const { data } = await getFalcon();
      
      const gtmItems = data[0]?.items.filter(item => item.name && item.name.startsWith('GTM'));

      setFalcon(gtmItems || []);
    } catch (error) {
      console.error('Erreur lors du chargement Falcon:', error);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchFalcon();

    const interval = setInterval(fetchFalcon, FALCON_INTERVAL);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchFalcon]);

  const fetchCourses = useCallback(async () => {
    try {
      const { data } = await getRapportCharroiVehicule();
      setCourses(data?.listeCourse || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger les données des véhicules.',
      });
      console.error('Erreur lors du chargement des courses:', error);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCourses();

    const interval = setInterval(fetchCourses, REFRESH_INTERVAL);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchCourses]);

  /** =====================
   *   MERGE DATA
   *  ===================== */
  const mergedCourses = useMemo(() => {
    return courses.map((c) => {
      const capteur = falcon.find((f) => f.id === c.id_capteur);
      return { ...c, capteurInfo: capteur || null };
    });
  }, [courses, falcon]);


  /** =====================
   *   BADGE COURSE COUNT
   *  ===================== */
  const activeCoursesCount = useMemo(() => mergedCourses.length, [mergedCourses]);

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      type="card"
      tabPosition="top"
      destroyInactiveTabPane
      animated
    >
      <Tabs.TabPane
        key="1"
        tab={
          <span style={getTabStyle('1', activeKey)}>
            <BarChartOutlined style={iconStyle('1', activeKey)} />
            Utilisation
          </span>
        }
      >
        <RapportMoniUtilitaire />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="2"
        tab={
          <span style={getTabStyle('2', activeKey)}>
            <EnvironmentOutlined style={iconStyle('2', activeKey)} />
            Position
          </span>
        }
      >
        <CharroiLocalisation />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="3"
        tab={
          <span style={getTabStyle('3', activeKey)}>
            <DashboardOutlined style={iconStyle('3', activeKey)} />
            Monitoring
          </span>
        }
      >
        <MoniRealTime />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="4"
        tab={
          <span style={getTabStyle('4', activeKey)}>
            <BellOutlined style={iconStyle('4', activeKey)} />
            Événements
          </span>
        }
      >
        <GetEventLocalisation />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="5"
        tab={
          <span style={getTabStyle('5', activeKey)}>
            <WifiOutlined style={iconStyle('5', activeKey)} />
            Signal
          </span>
        }
      >
        <RapportEvent />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="6"
        tab={
          <span style={getTabStyle('6', activeKey)}>
            <DesktopOutlined style={iconStyle('6', activeKey)} />
            Kiosque
          </span>
        }
      >
        <ModeTv />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="7"
        tab={
          <span style={getTabStyle('7', activeKey)}>
            <Badge
              count={activeCoursesCount}
              overflowCount={99}
              size="small"
              style={{ backgroundColor: '#1677ff' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CarOutlined style={iconStyle('7', activeKey)} />
                En course
              </span>
            </Badge>
          </span>
        }
      >
        <RapportVehiculeCourses key="courses" course={mergedCourses} />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Monitoring;
