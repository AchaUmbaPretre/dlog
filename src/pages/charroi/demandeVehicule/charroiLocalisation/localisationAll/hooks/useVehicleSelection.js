// hooks/useVehicleSelection.js
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getEventHistory } from '../../../../../../services/rapportService';
import config from '../../../../../../config';

export const useVehicleSelection = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [selectedVehiclesIds, setSelectedVehiclesIds] = useState([]);
  const [vehicleHistories, setVehicleHistories] = useState(new Map());
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeHistoryFilter, setActiveHistoryFilter] = useState(null);
  const apiHash = config.api_hash;

  // Récupérer l'historique avec filtre de date
// hooks/useVehicleSelection.js - Partie corrigée

const fetchVehicleHistory = useCallback(async (vehicle, dateFilter = null) => {
  // Utiliser l'ID du véhicule et les dates pour la clé de cache
  const cacheKey = `${vehicle.id}_${dateFilter?.from_date || 'default'}_${dateFilter?.to_date || 'default'}`;
  
  if (vehicleHistories.has(cacheKey)) {
    console.log(`💾 Cache hit pour ${vehicle.name}: ${vehicleHistories.get(cacheKey)?.length} points`);
    return vehicleHistories.get(cacheKey);
  }

  try {
    let from_date, from_time, to_date, to_time;
    
    if (dateFilter && dateFilter.from_date && dateFilter.to_date) {
      // Utiliser les dates du filtre
      from_date = dateFilter.from_date;
      from_time = dateFilter.from_time || '00:00:00';
      to_date = dateFilter.to_date;
      to_time = dateFilter.to_time || '23:59:59';
    } else {
      // Par défaut: aujourd'hui
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      
      from_date = todayStart.toISOString().slice(0, 10);
      from_time = '00:00:00';
      to_date = todayEnd.toISOString().slice(0, 10);
      to_time = '23:59:59';
    }
    
    const params = {
      device_id: vehicle.id,
      from_date: from_date,
      from_time: from_time,
      to_date: to_date,
      to_time: to_time,
      lang: 'fr',
      limit: 5000,
      user_api_hash: apiHash
    };
    
    console.log('📡 Appel API getEventHistory avec params:', params);
    
    const response = await getEventHistory(params);
    
    console.log('📥 Réponse API reçue:', response?.data?.items?.length || 0, 'événements');
    
    let positions = [];
    
    // Extraction des positions
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
    
    console.log(`📍 Positions extraites pour ${vehicle.name}: ${positions.length}`);
    
    if (positions.length === 0) {
      console.warn('⚠️ Aucune position trouvée pour la période demandée');
    }
    
    setVehicleHistories(prev => new Map(prev).set(cacheKey, positions));
    return positions;
    
  } catch (error) {
    console.error('❌ Erreur fetch:', error);
    message.error(`Impossible de charger l'historique pour ${vehicle.name}`);
    return [];
  }
}, [vehicleHistories, apiHash]);

  const selectVehicleForDetail = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    return vehicle;
  }, []);

  const selectActiveVehicle = useCallback((vehicle) => {
    setActiveVehicle(vehicle);
    return vehicle;
  }, []);

  const closeDetailPanel = useCallback(() => {
    setSelectedVehicle(null);
  }, []);

  const loadAndDisplayHistory = useCallback(async (vehicle, dateFilter = null) => {
    if (!vehicle) return;
    
    console.log('📡 Chargement historique pour:', vehicle.name, dateFilter);
    setLoadingHistory(true);
    
    if (dateFilter) {
      setActiveHistoryFilter(dateFilter);
    }
    
    const positions = await fetchVehicleHistory(vehicle, dateFilter);
    setLoadingHistory(false);
    
    if (positions.length > 0) {
      window.dispatchEvent(new CustomEvent('vehicle-history-loaded', { 
        detail: { vehicleId: vehicle.id, history: positions, filter: dateFilter }
      }));
      message.success(`${positions.length} points d'historique chargés`);
    } else {
      message.info(`Aucun historique trouvé pour ${vehicle.name}`);
    }
    
    return positions;
  }, [fetchVehicleHistory]);

  const clearHistoryFilter = useCallback((vehicleId) => {
    setActiveHistoryFilter(null);
    if (vehicleId) {
      window.dispatchEvent(new CustomEvent('vehicle-history-removed', { 
        detail: { vehicleId } 
      }));
    }
  }, []);

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
    selectedVehicle,
    activeVehicle,
    selectedVehiclesIds,
    vehicleHistories,
    loadingHistory,
    activeHistoryFilter,
    selectVehicleForDetail,
    selectActiveVehicle,
    closeDetailPanel,
    loadAndDisplayHistory,
    clearHistoryFilter,
    removeHistory,
    handleFilterChange,
    initializeAllVehicles
  };
};