import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useMap } from '../hooks/useMap';
import { TrailService } from '../services/trailService';
import { HeatmapService } from '../services/heatmapService';
import { MarkerManagerService } from '../services/markerManagerService';

const FleetMap = forwardRef(({ 
  vehicles, 
  showTrails, 
  showHeatmap, 
  onVehicleClick,
  onMapReady 
}, ref) => {
  const containerRef = useRef(null);
  const markerManagerRef = useRef(null);
  const trailServiceRef = useRef(null);
  const heatmapServiceRef = useRef(null);
  const mapReadyRef = useRef(false);
  const pendingVehiclesRef = useRef([]);

  const { initMap, changeTileLayer, flyTo, getMap } = useMap(containerRef);

  // Initialisation des services
  const initializeServices = useCallback((map) => {
    markerManagerRef.current = new MarkerManagerService(map);
    trailServiceRef.current = new TrailService(map);
    heatmapServiceRef.current = new HeatmapService(map);
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

  // Initialisation de la carte
  useEffect(() => {
    initMap(handleMapReady);
  }, [initMap, handleMapReady]);

  // Exposer les méthodes au parent
  useImperativeHandle(ref, () => ({
    flyToVehicle: (lat, lng) => flyTo(lat, lng),
    changeStyle: (style) => changeTileLayer(style),
    getMap: () => getMap()
  }));

  // Mise à jour des marqueurs
  useEffect(() => {
    if (!vehicles.length) return;
    
    if (markerManagerRef.current && mapReadyRef.current) {
      markerManagerRef.current.updateMarkersAsync(vehicles, onVehicleClick);
    } else {
      pendingVehiclesRef.current = vehicles;
    }
  }, [vehicles, onVehicleClick]);

  // Mise à jour des traces
  useEffect(() => {
    if (!trailServiceRef.current || !mapReadyRef.current) return;
    
    if (showTrails && vehicles.length > 0) {
      trailServiceRef.current.updateTrails(vehicles);
    } else {
      trailServiceRef.current.clearTrails();
    }
  }, [vehicles, showTrails]);

  // Mise à jour de la heatmap
  useEffect(() => {
    if (!heatmapServiceRef.current || !mapReadyRef.current) return;
    
    if (showHeatmap && vehicles.length > 0) {
      heatmapServiceRef.current.updateHeatmap(vehicles);
    } else {
      heatmapServiceRef.current.clearHeatmap();
    }
  }, [vehicles, showHeatmap]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
});

FleetMap.displayName = 'FleetMap';

export default FleetMap;