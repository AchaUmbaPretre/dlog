export const MAP_CONFIG = {
  DEFAULT_CENTER: [-4.358313, 15.348934],
  DEFAULT_ZOOM: 12,
  MAX_CLUSTER_RADIUS: 80,
  ANIMATION_DURATION: 2000,
  TILE_LAYER: {
    URL: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
  }
};

export const VEHICLE_STATUS = {
  MOVING: 'moving',
  STOPPED: 'stopped',
  OFFLINE: 'offline',
  IDLE: 'idle'
};

export const STATUS_COLORS = {
  [VEHICLE_STATUS.MOVING]: '#10b981',
  [VEHICLE_STATUS.STOPPED]: '#f59e0b',
  [VEHICLE_STATUS.OFFLINE]: '#ef4444',
  [VEHICLE_STATUS.IDLE]: '#8b5cf6'
};

export const STATUS_ICONS = {
  [VEHICLE_STATUS.MOVING]: '🚀',
  [VEHICLE_STATUS.STOPPED]: '⏸️',
  [VEHICLE_STATUS.OFFLINE]: '📡',
  [VEHICLE_STATUS.IDLE]: '💤'
};