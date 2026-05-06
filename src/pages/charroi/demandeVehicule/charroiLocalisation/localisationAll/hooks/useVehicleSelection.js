// hooks/useVehicleSelection.js - Version corrigée (uniquement aujourd'hui)

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getEventHistory } from '../../../../../../services/rapportService';
import config from '../../../../../../config';

export const useVehicleSelection = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVehiclesIds, setSelectedVehiclesIds] = useState([]);
  const [vehicleHistories, setVehicleHistories] = useState(new Map());
  const [loadingHistory, setLoadingHistory] = useState(false);
  const apiHash = config.api_hash;

  // Récupérer l'historique d'un véhicule - UNIQUEMENT AUJOURD'HUI
  const fetchVehicleHistory = useCallback(async (vehicle, dateRange = null) => {
    const cacheKey = `${vehicle.id}_${dateRange?.from || 'today'}_${dateRange?.to || 'today'}`;
    
    // Vérifier le cache
    if (vehicleHistories.has(cacheKey)) {
      console.log(`💾 Cache hit pour ${vehicle.name}: ${vehicleHistories.get(cacheKey)?.length} points`);
      return vehicleHistories.get(cacheKey);
    }

    try {
      const now = new Date();
      
      // CORRECTION: Début de la journée (00:00:00)
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      // Fin: maintenant
      const todayEnd = now;
      
      // Formatage pour l'API
      const from = todayStart.toISOString().slice(0, 19).replace('T', ' ');
      const to = todayEnd.toISOString().slice(0, 19).replace('T', ' ');
      
      const params = {
        device_id: vehicle.id,
        from_date: from.split(' ')[0],
        from_time: from.split(' ')[1],
        to_date: to.split(' ')[0],
        to_time: to.split(' ')[1],
        lang: 'fr',
        limit: 1000,
        user_api_hash: apiHash
      };
      
      console.log(`📡 Appel API pour ${vehicle.name} (Aujourd'hui ${todayStart.toLocaleDateString()})`);
      console.log(`📅 De: ${from} à ${to}`);
      
      const response = await getEventHistory(params);
      
      // Extraction correcte des positions
      let positions = [];
      
      if (response?.data?.items && Array.isArray(response.data.items)) {
        console.log(`📊 ${response.data.items.length} éléments trouvés`);
        
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
      
      if (positions.length > 0) {
        console.log(`📌 Première position: [${positions[0][0]}, ${positions[0][1]}]`);
        console.log(`📌 Dernière position: [${positions[positions.length-1][0]}, ${positions[positions.length-1][1]}]`);
      }
      
      setVehicleHistories(prev => new Map(prev).set(cacheKey, positions));
      return positions;
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      message.error(`Impossible de charger l'historique pour ${vehicle.name}`);
      return [];
    }
  }, [vehicleHistories, apiHash]);

  const handleVehicleSelect = useCallback(async (vehicle, mapRef) => {
    console.log(`🎯 Sélection du véhicule: ${vehicle.name}`);
    
    setSelectedVehicle(vehicle);
    if (mapRef?.current) {
      mapRef.current.flyToVehicle(vehicle.lat, vehicle.lng);
    }
    
    setLoadingHistory(true);
    const positions = await fetchVehicleHistory(vehicle);
    setLoadingHistory(false);
    
    console.log(`📊 ${positions.length} positions récupérées pour ${vehicle.name}`);
    
    if (positions.length > 0) {
      window.dispatchEvent(new CustomEvent('vehicle-history-loaded', { 
        detail: { 
          vehicleId: vehicle.id, 
          history: positions,
          vehicleName: vehicle.name
        } 
      }));
      message.success(`${positions.length} points d'historique chargés pour ${vehicle.name}`);
    } else {
      message.info(`Aucun historique trouvé pour ${vehicle.name} aujourd'hui`);
    }
  }, [fetchVehicleHistory]);

  const handleVehicleDeselect = useCallback(() => {
    setSelectedVehicle(null);
  }, []);

  const handleFilterChange = useCallback((selectedIds, currentVehicle) => {
    setSelectedVehiclesIds(selectedIds);
    if (currentVehicle && !selectedIds.includes(currentVehicle.id)) {
      setSelectedVehicle(null);
    }
  }, []);

  const initializeAllVehicles = useCallback((vehicles) => {
    if (vehicles.length > 0 && selectedVehiclesIds.length === 0) {
      setSelectedVehiclesIds(vehicles.map(v => v.id));
    }
  }, [selectedVehiclesIds.length]);

  return {
    selectedVehicle,
    selectedVehiclesIds,
    vehicleHistories,
    loadingHistory,
    handleVehicleSelect,
    handleVehicleDeselect,
    handleFilterChange,
    initializeAllVehicles,
    fetchVehicleHistory
  };
};