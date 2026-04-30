import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useMap } from '../hooks/useMap';
import { MarkerService } from '../services/markerService';
import { TrailService } from '../services/trailService';
import { HeatmapService } from '../services/heatmapService';

const FleetMap = forwardRef(({ 
  vehicles, 
  showTrails, 
  showHeatmap,
  onVehicleClick,
  onMapReady 
}, ref) => {
  const containerRef = useRef(null);
  const markerServiceRef = useRef(null);
  const trailServiceRef = useRef(null);
  const heatmapServiceRef = useRef(null);
  const mapReadyRef = useRef(false);
  const pendingVehiclesRef = useRef([]); // Stocker les véhicules en attente

  const { initMap, changeTileLayer, flyTo, getMap } = useMap(containerRef, (map) => {
    if (!mapReadyRef.current && map) {
      const initServices = () => {
        if (map._panes && map._panes.overlayPane) {
          markerServiceRef.current = new MarkerService(map);
          trailServiceRef.current = new TrailService(map);
          heatmapServiceRef.current = new HeatmapService(map);
          mapReadyRef.current = true;
          
          // AFFICHAGE IMMÉDIAT des véhicules en attente
          if (pendingVehiclesRef.current.length > 0) {
            markerServiceRef.current.updateMarkersAsync(
              pendingVehiclesRef.current, 
              onVehicleClick
            );
            pendingVehiclesRef.current = [];
          }
          
          if (onMapReady) {
            onMapReady({ flyTo, changeTileLayer });
          }
        } else {
          setTimeout(initServices, 50); // Réduit de 100ms à 50ms
        }
      };
      
      initServices();
    }
  });

  useImperativeHandle(ref, () => ({
    flyToVehicle: (lat, lng) => flyTo(lat, lng),
    changeStyle: (style) => changeTileLayer(style),
    getMap: () => getMap()
  }));

  // OPTIMISATION : Mise à jour immédiate des marqueurs
  useEffect(() => {
    if (!vehicles.length) return;
    
    // Si la carte est prête, afficher immédiatement
    if (markerServiceRef.current && mapReadyRef.current) {
      markerServiceRef.current.updateMarkersAsync(vehicles, onVehicleClick);
    } else {
      // Sinon, stocker pour affichage ultérieur
      pendingVehiclesRef.current = vehicles;
    }
  }, [vehicles, onVehicleClick]);

  // OPTIMISATION : Traces sans délai
  useEffect(() => {
    if (!trailServiceRef.current || !mapReadyRef.current) return;
    
    if (showTrails && vehicles.length > 0) {
      trailServiceRef.current.updateTrails(vehicles);
    } else {
      trailServiceRef.current.clearTrails();
    }
  }, [vehicles, showTrails]);

  // OPTIMISATION : Heatmap sans délai artificiel
  useEffect(() => {
    if (!heatmapServiceRef.current || !mapReadyRef.current) return;
    
    if (showHeatmap && vehicles.length > 0) {
      // SUPPRIMER le setTimeout de 1000ms !
      heatmapServiceRef.current.updateHeatmap(vehicles);
    } else {
      heatmapServiceRef.current.clearHeatmap();
    }
  }, [vehicles, showHeatmap]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
});

FleetMap.displayName = 'FleetMap';

export default FleetMap;