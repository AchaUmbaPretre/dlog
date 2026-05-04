import { useState, useEffect, useCallback, useRef } from 'react';
import { notification } from 'antd';
import { MAP_CONFIG } from '../utils/constants';
import { calculateStats } from '../utils/helpers';
import { getFalcon } from '../../../../../../services/rapportService';

export const useFleetData = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const falconData = await getFalcon();
      const items = falconData.data[0].items || [];
      const gtmItems = items.filter(item => 
        item.name && item.name.startsWith('GTM')
      );
      
      setVehicles(items);
      setStats(calculateStats(items));
      setError(null);
      
      if (initialLoad) {
        setInitialLoad(false);
        setLoading(false);
      }
    } catch (err) {
      console.error("Erreur fetchData:", err);
      setError(err);
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger les données véhicules.',
        placement: 'topRight',
        duration: 3
      });
      if (initialLoad) {
        setLoading(false);
      }
    }
  }, [initialLoad]);

  useEffect(() => {
    fetchData();
    
    intervalRef.current = setInterval(() => {
      fetchData();
    }, MAP_CONFIG.refreshInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  return { vehicles, loading, stats, error, refetch: fetchData, initialLoad };
};