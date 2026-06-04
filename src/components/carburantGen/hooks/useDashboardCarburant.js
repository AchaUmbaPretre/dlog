// hooks/useDashboardCarburant.js
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import moment from 'moment';
import { getDashboardCarburant } from '../../../services/carburantService';

export const useDashboardCarburant = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [periode, setPeriode] = useState('30j');
  const [dateRange, setDateRange] = useState([null, null]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (customPeriode, customDateRange) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentPeriode = customPeriode || periode;
      let debut = null;
      let fin = null;
      
      if (customDateRange && customDateRange[0] && customDateRange[1]) {
        debut = moment(customDateRange[0]).format('YYYY-MM-DD');
        fin = moment(customDateRange[1]).format('YYYY-MM-DD');
      } else if (dateRange[0] && dateRange[1]) {
        debut = moment(dateRange[0]).format('YYYY-MM-DD');
        fin = moment(dateRange[1]).format('YYYY-MM-DD');
      }
      
      console.log('Fetching data with:', { currentPeriode, debut, fin }); // Debug
      
      const response = await getDashboardCarburant(currentPeriode, debut, fin);
      
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des données');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      message.error(`Erreur: ${errorMessage}`);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [periode, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updatePeriode = (newPeriode) => {
    console.log('Updating periode to:', newPeriode); // Debug
    setPeriode(newPeriode);
    setDateRange([null, null]);
    // Appel direct avec la nouvelle période
    fetchData(newPeriode, [null, null]);
  };

  const updateDateRange = (dates) => {
    console.log('Updating date range to:', dates); // Debug
    setDateRange(dates);
    setPeriode('custom');
    fetchData('custom', dates);
  };

  const refresh = () => {
    console.log('Refreshing data'); // Debug
    fetchData();
  };

  return {
    loading,
    data,
    error,
    periode,
    dateRange,
    updatePeriode,
    updateDateRange,
    refresh
  };
};