import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getEventHistory } from '../../../../../../services/rapportService';
import config from '../../../../../../config';

export const useVehicleSelection = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Pour le détail (carte)
  const [activeVehicle, setActiveVehicle] = useState(null); // Pour l'historique (sélection)
  const [selectedVehiclesIds, setSelectedVehiclesIds] = useState([]);
  const [vehicleHistories, setVehicleHistories] = useState(new Map());
  const [loadingHistory, setLoadingHistory] = useState(false);
  const apiHash = config.api_hash;

  const fetchVehicleHistory = useCallback(async (vehicle) => {
    const cacheKey = `${vehicle.id}_today`;
    
    if (vehicleHistories.has(cacheKey)) {
      return vehicleHistories.get(cacheKey);
    }

    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      
      const fromDate = todayStart.toISOString().slice(0, 19).replace('T', ' ');
      const toDate = todayEnd.toISOString().slice(0, 19).replace('T', ' ');
      
      const params = {
        device_id: vehicle.id,
        from_date: fromDate.split(' ')[0],
        from_time: fromDate.split(' ')[1],
        to_date: toDate.split(' ')[0],
        to_time: toDate.split(' ')[1],
        lang: 'fr',
        limit: 1000,
        user_api_hash: apiHash
      };
      
      const response = await getEventHistory(params);
      
      let positions = [];
      
      if (response?.data?.items && Array.isArray(response.data.items)) {
        for (const event of response.data.items) {
          if (event?.items && Array.isArray(event.items)) {
            for (const point of event.items) {
              if (point.lat && point.lng) {
                positions.push([parseFloat(point.lat), parseFloat(point.lng)]);
              }
            }
          }
        }
      }
      
      setVehicleHistories(prev => new Map(prev).set(cacheKey, positions));
      return positions;
      
    } catch (error) {
      console.error('Erreur fetch:', error);
      return [];
    }
  }, [vehicleHistories, apiHash]);

  // Sélection pour l'affichage du détail (clic sur la carte)
  const selectVehicleForDetail = useCallback((vehicle) => {
    console.log('🎯 selectVehicleForDetail (carte):', vehicle?.name);
    setSelectedVehicle(vehicle);
    return vehicle;
  }, []);

  // Sélection pour l'historique (clic sur la liste/checkbox)
  const selectActiveVehicle = useCallback((vehicle) => {
    console.log('🎯 selectActiveVehicle (liste):', vehicle?.name);
    setActiveVehicle(vehicle);
    return vehicle;
  }, []);

  // Fermer le panneau de détail
  const closeDetailPanel = useCallback(() => {
    setSelectedVehicle(null);
  }, []);

  const loadAndDisplayHistory = useCallback(async (vehicle) => {
    if (!vehicle) return;
    console.log('📡 Chargement historique pour:', vehicle.name);
    setLoadingHistory(true);
    const positions = await fetchVehicleHistory(vehicle);
    setLoadingHistory(false);
    
    if (positions.length > 0) {
      window.dispatchEvent(new CustomEvent('vehicle-history-loaded', { 
        detail: { vehicleId: vehicle.id, history: positions }
      }));
      message.success(`${positions.length} points chargés`);
    } else {
      message.info(`Aucun historique pour ${vehicle.name}`);
    }
  }, [fetchVehicleHistory]);

  const removeHistory = useCallback((vehicleId) => {
    window.dispatchEvent(new CustomEvent('vehicle-history-removed', { 
      detail: { vehicleId } 
    }));
  }, []);

  const handleFilterChange = useCallback((selectedIds) => {
    setSelectedVehiclesIds(selectedIds);
  }, []);

  const initializeAllVehicles = useCallback((vehicles) => {
    if (vehicles.length > 0 && selectedVehiclesIds.length === 0) {
      setSelectedVehiclesIds(vehicles.map(v => v.id));
    }
  }, [selectedVehiclesIds.length]);

  return {
    selectedVehicle,        // Pour le détail (carte)
    activeVehicle,          // Pour l'historique (liste)
    selectedVehiclesIds,
    vehicleHistories,
    loadingHistory,
    selectVehicleForDetail, // Clic sur carte
    selectActiveVehicle,    // Clic sur liste/checkbox
    closeDetailPanel,       // Fermer le panneau
    loadAndDisplayHistory,
    removeHistory,
    handleFilterChange,
    initializeAllVehicles
  };
};