// hooks/useMap.js
import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { TILE_LAYERS, MAP_CONFIG } from '../utils/constants';

export const useMap = (containerRef) => {
  const mapRef = useRef(null);
  const currentTileLayerRef = useRef(null);

  const initMap = useCallback((onReadyCallback) => {
    if (!containerRef.current || mapRef.current) return null;

    mapRef.current = L.map(containerRef.current).setView(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom);
    
    currentTileLayerRef.current = L.tileLayer(TILE_LAYERS.streets.url, {
      attribution: TILE_LAYERS.streets.attribution,
      maxZoom: MAP_CONFIG.maxZoom,
      minZoom: MAP_CONFIG.minZoom
    }).addTo(mapRef.current);

    if (onReadyCallback && typeof onReadyCallback === 'function') {
      onReadyCallback(mapRef.current);
    }

    return mapRef.current;
  }, [containerRef]);

  const changeTileLayer = useCallback((layerKey) => {
    if (!mapRef.current || !TILE_LAYERS[layerKey]) return;

    if (currentTileLayerRef.current) {
      mapRef.current.removeLayer(currentTileLayerRef.current);
    }

    currentTileLayerRef.current = L.tileLayer(TILE_LAYERS[layerKey].url, {
      attribution: TILE_LAYERS[layerKey].attribution,
      maxZoom: MAP_CONFIG.maxZoom,
      minZoom: MAP_CONFIG.minZoom
    }).addTo(mapRef.current);
  }, []);

  const flyTo = useCallback((lat, lng, zoom = 15) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([lat, lng], zoom, {
      duration: MAP_CONFIG.flyDuration
    });
  }, []);

  const getMap = useCallback(() => mapRef.current, []);

  const setView = useCallback((center, zoom) => {
    if (!mapRef.current) return;
    mapRef.current.setView(center, zoom);
  }, []);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return { initMap, changeTileLayer, flyTo, getMap, setView };
};