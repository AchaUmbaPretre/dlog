import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { TILE_LAYERS, MAP_CONFIG } from '../utils/constants';

export const useMap = (containerRef, onMapReady) => {
  const mapRef = useRef(null);
  const currentTileLayerRef = useRef(null);

  const initMap = useCallback((center = MAP_CONFIG.defaultCenter) => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView(center, MAP_CONFIG.defaultZoom);
    
    // Ajout de la couche par défaut
    currentTileLayerRef.current = L.tileLayer(TILE_LAYERS.streets.url, {
      attribution: TILE_LAYERS.streets.attribution,
      maxZoom: MAP_CONFIG.maxZoom
    }).addTo(mapRef.current);

    if (onMapReady) {
      onMapReady(mapRef.current);
    }

    return mapRef.current;
  }, [containerRef, onMapReady]);

  const changeTileLayer = useCallback((layerKey) => {
    if (!mapRef.current || !TILE_LAYERS[layerKey]) return;

    if (currentTileLayerRef.current) {
      mapRef.current.removeLayer(currentTileLayerRef.current);
    }

    currentTileLayerRef.current = L.tileLayer(TILE_LAYERS[layerKey].url, {
      attribution: TILE_LAYERS[layerKey].attribution,
      maxZoom: MAP_CONFIG.maxZoom
    }).addTo(mapRef.current);
  }, []);

  const flyTo = useCallback((lat, lng, zoom = 15) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([lat, lng], zoom, {
      duration: MAP_CONFIG.flyDuration
    });
  }, []);

  const getMap = useCallback(() => mapRef.current, []);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return { initMap, changeTileLayer, flyTo, getMap };
};