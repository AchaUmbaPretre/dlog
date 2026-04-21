import { useEffect, useState, useCallback, useMemo } from 'react';
import { notification } from 'antd';
import { getFalcon, getRapportCharroiVehicule } from '../../../../services/rapportService';

const REFRESH_INTERVAL = 30000;
const FALCON_INTERVAL = 5000;

export const useMonitoring = () => {
  const [activeKey, setActiveKey] = useState('1');
  const [courses, setCourses] = useState([]);
  const [falcon, setFalcon] = useState([]);

  const fetchFalcon = useCallback(async () => {
    try {
      const { data } = await getFalcon();

      const gtmItems =
        data?.[0]?.items?.filter(
          (item) => item.name && item.name.startsWith('GTM')
        ) || [];

      setFalcon(gtmItems);
    } catch (error) {
      console.error('Erreur Falcon:', error);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const { data } = await getRapportCharroiVehicule();
      setCourses(data?.listeCourse || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger les données des véhicules.',
      });
      console.error('Erreur courses:', error);
    }
  }, []);

  useEffect(() => {
    fetchFalcon();
    const interval = setInterval(fetchFalcon, FALCON_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchFalcon]);

  useEffect(() => {
    fetchCourses();
    const interval = setInterval(fetchCourses, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchCourses]);

  const mergedCourses = useMemo(() => {
    return courses.map((c) => {
      const capteur = falcon.find((f) => f.id === c.id_capteur);
      return {
        ...c,
        capteurInfo: capteur || null,
      };
    });
  }, [courses, falcon]);

  const activeCoursesCount = useMemo(
    () => mergedCourses.length,
    [mergedCourses]
  );

  return {
    activeKey,
    setActiveKey,
    mergedCourses,
    activeCoursesCount,
  };
};