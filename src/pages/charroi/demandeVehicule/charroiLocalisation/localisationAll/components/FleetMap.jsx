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
  const historyTrailsRef = useRef(new Map());
  const mapReadyRef = useRef(false);
  const pendingVehiclesRef = useRef([]);

  const { initMap, changeTileLayer, flyTo, getMap } = useMap(containerRef);

  // Afficher l'historique d'un véhicule sur la carte
  const displayVehicleHistory = useCallback((vehicleId, history, map) => {
    if (!map || !history || history.length === 0) return;
    
    // Supprimer l'ancienne trace
    if (historyTrailsRef.current.has(vehicleId)) {
      const oldTrail = historyTrailsRef.current.get(vehicleId);
      if (oldTrail && map.removeLayer) {
        map.removeLayer(oldTrail);
      }
      historyTrailsRef.current.delete(vehicleId);
    }
    
    // Extraire les positions
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
      const historyTrail = L.polyline(positions, {
        color: '#722ed1',
        weight: 4,
        opacity: 0.8,
        className: 'history-trail'
      }).addTo(map);
      
      historyTrailsRef.current.set(vehicleId, historyTrail);
      
      // Marqueur début
      const startIcon = L.divIcon({
        html: '<div style="background: #52c41a; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
        className: 'history-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      
      // Marqueur fin
      const endIcon = L.divIcon({
        html: '<div style="background: #ff4d4f; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
        className: 'history-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      
      L.marker(positions[0], { icon: startIcon })
        .bindTooltip('Début', { permanent: false, direction: 'top' })
        .addTo(map);
      
      L.marker(positions[positions.length - 1], { icon: endIcon })
        .bindTooltip('Fin', { permanent: false, direction: 'top' })
        .addTo(map);
      
      // Centrer la carte
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
      
    } catch (error) {
      console.error('Erreur affichage historique:', error);
    }
  }, []);

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