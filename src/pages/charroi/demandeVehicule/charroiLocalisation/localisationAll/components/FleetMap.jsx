import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import L from 'leaflet';
import { useMap } from '../hooks/useMap';
import { TrailService } from '../services/trailService';
import { MarkerManagerService } from '../services/markerManagerService';

const FleetMap = forwardRef(({ 
  vehicles, 
  showTrails, 
  showHeatmap, 
  onVehicleClick,
  onMapReady,
  vehicleHistories
}, ref) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerManagerRef = useRef(null);
  const trailServiceRef = useRef(null);
  const historyTrailsRef = useRef(new Map()); // Pour stocker les lignes
  const historyMarkersRef = useRef(new Map()); // ✅ NOUVEAU : Pour stocker les marqueurs
  const mapReadyRef = useRef(false);
  const pendingVehiclesRef = useRef([]);

  const { initMap, changeTileLayer, flyTo, getMap } = useMap(containerRef);

  // Afficher l'historique
  const displayVehicleHistory = useCallback((vehicleId, history, map) => {
    if (!map || !history || history.length === 0) return;
    
    // Supprimer l'ancienne trace et les anciens marqueurs
    if (historyTrailsRef.current.has(vehicleId)) {
      const oldTrail = historyTrailsRef.current.get(vehicleId);
      if (oldTrail && map.removeLayer) {
        map.removeLayer(oldTrail);
      }
      historyTrailsRef.current.delete(vehicleId);
    }
    
    // ✅ Supprimer les anciens marqueurs
    if (historyMarkersRef.current.has(vehicleId)) {
      const oldMarkers = historyMarkersRef.current.get(vehicleId);
      oldMarkers.forEach(marker => {
        if (marker && map.removeLayer) {
          map.removeLayer(marker);
        }
      });
      historyMarkersRef.current.delete(vehicleId);
    }
    
    let positions = [];
    if (Array.isArray(history) && history.length > 0) {
      if (Array.isArray(history[0])) {
        positions = history;
      } else if (history[0].lat && history[0].lng) {
        positions = history.map(p => [p.lat, p.lng]);
      }
    }
    
    if (positions.length < 2) return;
    
    try {
      // Créer la trace
      const historyTrail = L.polyline(positions, {
        color: '#722ed1',
        weight: 4,
        opacity: 0.8,
        className: 'history-trail'
      }).addTo(map);
      
      historyTrailsRef.current.set(vehicleId, historyTrail);
      
      // Créer les marqueurs
      const markers = [];
      
      const startIcon = L.divIcon({
        html: '<div style="background: #52c41a; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
        className: 'history-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      
      const endIcon = L.divIcon({
        html: '<div style="background: #ff4d4f; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
        className: 'history-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      
      const startMarker = L.marker(positions[0], { icon: startIcon })
        .bindTooltip('Début', { permanent: false, direction: 'top' })
        .addTo(map);
      
      const endMarker = L.marker(positions[positions.length - 1], { icon: endIcon })
        .bindTooltip('Fin', { permanent: false, direction: 'top' })
        .addTo(map);
      
      markers.push(startMarker, endMarker);
      historyMarkersRef.current.set(vehicleId, markers);
      
    } catch (error) {
      console.error('Erreur affichage historique:', error);
    }
  }, []);

  // Supprimer l'historique (trace + marqueurs)
  const removeVehicleHistory = useCallback((vehicleId, map) => {
    if (!map) return;
    
    // Supprimer la trace
    if (historyTrailsRef.current.has(vehicleId)) {
      const trail = historyTrailsRef.current.get(vehicleId);
      if (trail && map.removeLayer) {
        map.removeLayer(trail);
        console.log(`🗑️ Trace supprimée pour le véhicule ${vehicleId}`);
      }
      historyTrailsRef.current.delete(vehicleId);
    }
    
    // ✅ Supprimer les marqueurs
    if (historyMarkersRef.current.has(vehicleId)) {
      const markers = historyMarkersRef.current.get(vehicleId);
      markers.forEach(marker => {
        if (marker && map.removeLayer) {
          map.removeLayer(marker);
        }
      });
      historyMarkersRef.current.delete(vehicleId);
      console.log(`🗑️ Marqueurs supprimés pour le véhicule ${vehicleId}`);
    }
  }, []);

  // Écouter l'événement d'ajout
  useEffect(() => {
    const handleHistoryLoaded = (event) => {
      const { vehicleId, history } = event.detail;
      if (mapReadyRef.current && mapRef.current) {
        displayVehicleHistory(vehicleId, history, mapRef.current);
      }
    };
    
    window.addEventListener('vehicle-history-loaded', handleHistoryLoaded);
    return () => window.removeEventListener('vehicle-history-loaded', handleHistoryLoaded);
  }, [displayVehicleHistory]);

  // Écouter l'événement de suppression
  useEffect(() => {
    const handleHistoryRemoved = (event) => {
      const { vehicleId } = event.detail;
      if (mapReadyRef.current && mapRef.current) {
        removeVehicleHistory(vehicleId, mapRef.current);
      }
    };
    
    window.addEventListener('vehicle-history-removed', handleHistoryRemoved);
    return () => window.removeEventListener('vehicle-history-removed', handleHistoryRemoved);
  }, [removeVehicleHistory]);

  // Écouter l'événement
  useEffect(() => {
    const handleHistoryLoaded = (event) => {
      const { vehicleId, history } = event.detail;
      if (mapReadyRef.current && mapRef.current) {
        displayVehicleHistory(vehicleId, history, mapRef.current);
      }
    };
    
    window.addEventListener('vehicle-history-loaded', handleHistoryLoaded);
    return () => window.removeEventListener('vehicle-history-loaded', handleHistoryLoaded);
  }, [displayVehicleHistory]);

  // Initialisation des services (sans heatmap)
  const initializeServices = useCallback((map) => {
    mapRef.current = map;
    markerManagerRef.current = new MarkerManagerService(map);
    trailServiceRef.current = new TrailService(map);
    mapReadyRef.current = true;
    
    if (pendingVehiclesRef.current.length > 0) {
      markerManagerRef.current.updateMarkersAsync(pendingVehiclesRef.current, onVehicleClick);
      pendingVehiclesRef.current = [];
    }
    
    if (onMapReady) {
      onMapReady({ flyTo, changeTileLayer });
    }
  }, [flyTo, changeTileLayer, onMapReady, onVehicleClick]);

  // Callback pour la carte prête
  const handleMapReady = useCallback((map) => {
    if (!mapReadyRef.current && map && map._panes?.overlayPane) {
      initializeServices(map);
    } else if (map && !mapReadyRef.current) {
      setTimeout(() => handleMapReady(map), 50);
    }
  }, [initializeServices]);

  // Initialisation
  useEffect(() => {
    initMap(handleMapReady);
  }, [initMap, handleMapReady]);

  // Exposer les méthodes
  useImperativeHandle(ref, () => ({
    flyToVehicle: (lat, lng) => flyTo(lat, lng),
    changeStyle: (style) => changeTileLayer(style),
    getMap: () => getMap(),
    displayHistory: (vehicleId, history) => {
      if (mapReadyRef.current && mapRef.current) {
        displayVehicleHistory(vehicleId, history, mapRef.current);
      }
    }
  }));

  // Marqueurs
  useEffect(() => {
    if (!vehicles.length) return;
    
    if (markerManagerRef.current && mapReadyRef.current) {
      markerManagerRef.current.updateMarkersAsync(vehicles, onVehicleClick);
    } else {
      pendingVehiclesRef.current = vehicles;
    }
  }, [vehicles, onVehicleClick]);

  // Traces
  useEffect(() => {
    if (!trailServiceRef.current || !mapReadyRef.current) return;
    
    if (showTrails && vehicles.length > 0) {
      trailServiceRef.current.updateTrails(vehicles);
    } else {
      trailServiceRef.current.clearTrails();
    }
  }, [vehicles, showTrails]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
});

FleetMap.displayName = 'FleetMap';

export default FleetMap;