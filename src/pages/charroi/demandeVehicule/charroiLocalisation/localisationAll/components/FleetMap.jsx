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

  const { initMap, changeTileLayer, flyTo, getMap } = useMap(containerRef, (map) => {
    markerServiceRef.current = new MarkerService(map);
    trailServiceRef.current = new TrailService(map);
    heatmapServiceRef.current = new HeatmapService(map);
    
    if (onMapReady) {
      onMapReady({ flyTo, changeTileLayer });
    }
  });

  useImperativeHandle(ref, () => ({
    flyToVehicle: (lat, lng) => flyTo(lat, lng),
    changeStyle: (style) => changeTileLayer(style),
    getMap: () => getMap()
  }));

  // Mise à jour des marqueurs
  useEffect(() => {
    if (!markerServiceRef.current || !vehicles.length) return;
    markerServiceRef.current.updateMarkers(vehicles, onVehicleClick);
  }, [vehicles, onVehicleClick]);

  // Mise à jour des traces
  useEffect(() => {
    if (!trailServiceRef.current) return;
    
    if (showTrails) {
      trailServiceRef.current.updateTrails(vehicles);
    } else {
      trailServiceRef.current.clearTrails();
    }
  }, [vehicles, showTrails]);

  // Mise à jour de la heatmap
  useEffect(() => {
    if (!heatmapServiceRef.current) return;
    
    if (showHeatmap) {
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