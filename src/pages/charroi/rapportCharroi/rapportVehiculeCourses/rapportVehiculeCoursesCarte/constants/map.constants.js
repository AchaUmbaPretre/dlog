export const MAP_CONFIG = {
  DEFAULT_CENTER: [-4.358313, 15.348934],
  DEFAULT_ZOOM: 12,
  MAX_CLUSTER_RADIUS: 50,
  ANIMATION_DURATION: 2000,
  TILE_LAYER: {
    URL: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
  }
};

export const VEHICLE_STATUS = {
  MOVING: 'moving',
  STOPPED: 'stopped',
  OFFLINE: 'offline'
};

export const STATUS_COLORS = {
  [VEHICLE_STATUS.MOVING]: '#22c55e',
  [VEHICLE_STATUS.STOPPED]: '#eab308',
  [VEHICLE_STATUS.OFFLINE]: '#ef4444'
};

export const FILTER_OPTIONS = [
  { id: 'all', label: 'Tous', icon: '🚗' },
  { id: 'moving', label: 'En marche', icon: '🟢' },
  { id: 'stopped', label: 'Arrêtés', icon: '🟡' }
];