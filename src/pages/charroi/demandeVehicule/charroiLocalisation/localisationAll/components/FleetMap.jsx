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
  const initTimeoutRef = useRef(null);

  const { initMap, changeTileLayer, flyTo, getMap } = useMap(containerRef, (map) => {
    if (!mapReadyRef.current && map) {
      // Attendre que la carte soit complètement initialisée
      const initServices = () => {
        if (map._panes && map._panes.overlayPane) {
          markerServiceRef.current = new MarkerService(map);
          trailServiceRef.current = new TrailService(map);
          heatmapServiceRef.current = new HeatmapService(map);
          mapReadyRef.current = true;
          
          if (onMapReady) {
            onMapReady({ flyTo, changeTileLayer });
          }
        } else {
          // Réessayer dans 100ms
          initTimeoutRef.current = setTimeout(initServices, 100);
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

  // Mise à jour des marqueurs
  useEffect(() => {
    if (!markerServiceRef.current || !vehicles.length || !mapReadyRef.current) return;
    
    const updateMarkers = async () => {
      await markerServiceRef.current.updateMarkersAsync(vehicles, onVehicleClick);
    };
    
    updateMarkers();
  }, [vehicles, onVehicleClick]);

  // Mise à jour des traces
  useEffect(() => {
    if (!trailServiceRef.current || !mapReadyRef.current) return;
    
    if (showTrails) {
      trailServiceRef.current.updateTrails(vehicles);
    } else {
      trailServiceRef.current.clearTrails();
    }
  }, [vehicles, showTrails]);

  // Mise à jour de la heatmap
  useEffect(() => {
    if (!heatmapServiceRef.current || !mapReadyRef.current) return;
    
    if (showHeatmap && vehicles.length > 0) {
      // Petit délai pour s'assurer que la carte est prête
      setTimeout(() => {
        if (heatmapServiceRef.current) {
          heatmapServiceRef.current.updateHeatmap(vehicles);
        }
      }, 100);
    } else {
      heatmapServiceRef.current.clearHeatmap();
    }
  }, [vehicles, showHeatmap]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    initMap();
  }, [initMap]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
});

FleetMap.displayName = 'FleetMap';

export default FleetMap;