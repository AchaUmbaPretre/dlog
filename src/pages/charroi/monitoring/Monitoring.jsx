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
import config from '../../../config';

const REFRESH_INTERVAL = 30000; // 30s pour les rapports
const FALCON_INTERVAL = 5000; // 5s pour le temps réel

const Monitoring = () => {
  const [activeKey, setActiveKey] = useState('1');
  const [courses, setCourses] = useState([]);
  const [falcon, setFalcon] = useState([]);

  /** =====================
   *   FETCH FALCON DATA
   *  ===================== */
  const fetchFalcon = useCallback(async () => {
    try {
      const { data } = await getFalcon();
      setFalcon(data[0]?.items || []);
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
   *   TAB STYLES
   *  ===================== */
  const getTabStyle = (key) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: activeKey === key ? '#1677ff' : 'rgba(0,0,0,0.65)',
    fontWeight: activeKey === key ? 600 : 400,
    transition: 'color 0.3s ease',
  });

  const iconStyle = (key) => ({
    fontSize: 18,
    color: activeKey === key ? '#1677ff' : 'rgba(0,0,0,0.45)',
    transform: activeKey === key ? 'scale(1.15)' : 'scale(1)',
    transition: 'transform 0.3s ease, color 0.3s ease',
  });

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
          <span style={getTabStyle('1')}>
            <BarChartOutlined style={iconStyle('1')} />
            Utilisation
          </span>
        }
      >
        <RapportMoniUtilitaire />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="2"
        tab={
          <span style={getTabStyle('2')}>
            <EnvironmentOutlined style={iconStyle('2')} />
            Position
          </span>
        }
      >
        <CharroiLocalisation />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="3"
        tab={
          <span style={getTabStyle('3')}>
            <DashboardOutlined style={iconStyle('3')} />
            Monitoring
          </span>
        }
      >
        <MoniRealTime />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="4"
        tab={
          <span style={getTabStyle('4')}>
            <BellOutlined style={iconStyle('4')} />
            Événements
          </span>
        }
      >
        <GetEventLocalisation />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="5"
        tab={
          <span style={getTabStyle('5')}>
            <WifiOutlined style={iconStyle('5')} />
            Signal
          </span>
        }
      >
        <RapportEvent />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="6"
        tab={
          <span style={getTabStyle('6')}>
            <DesktopOutlined style={iconStyle('6')} />
            Kiosque
          </span>
        }
      >
        <ModeTv />
      </Tabs.TabPane>

      <Tabs.TabPane
        key="7"
        tab={
          <span style={getTabStyle('7')}>
            <Badge
              count={activeCoursesCount}
              overflowCount={99}
              size="small"
              style={{ backgroundColor: '#1677ff' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CarOutlined style={iconStyle('7')} />
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
