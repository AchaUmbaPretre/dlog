export const MAP_CONFIG = {
  DEFAULT_CENTER: [-4.358313, 15.348934],
  DEFAULT_ZOOM: 11, 
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
  IDLE: 'idle',
  LONG_IDLE: 'long_idle',
  VERY_LONG_IDLE: 'very_long_idle',
  OFFLINE: 'offline'
};

export const STATUS_COLORS = {
  [VEHICLE_STATUS.MOVING]: '#10b981',
  [VEHICLE_STATUS.STOPPED]: '#f59e0b',
  [VEHICLE_STATUS.IDLE]: '#f97316',
  [VEHICLE_STATUS.LONG_IDLE]: '#ef4444',
  [VEHICLE_STATUS.VERY_LONG_IDLE]: '#7f1d1d',
  [VEHICLE_STATUS.OFFLINE]: '#6b7280'
};

export const STATUS_ICONS = {
  [VEHICLE_STATUS.MOVING]: '🚀',
  [VEHICLE_STATUS.STOPPED]: '⏸️',
  [VEHICLE_STATUS.IDLE]: '🅿️',
  [VEHICLE_STATUS.LONG_IDLE]: '⚠️',
  [VEHICLE_STATUS.VERY_LONG_IDLE]: '🔴',
  [VEHICLE_STATUS.OFFLINE]: '📡'
};

export const STATUS_LABELS = {
  [VEHICLE_STATUS.MOVING]: 'En mouvement',
  [VEHICLE_STATUS.STOPPED]: 'Arrêt momentané',
  [VEHICLE_STATUS.IDLE]: 'Stationnement',
  [VEHICLE_STATUS.LONG_IDLE]: 'Stationnement prolongé',
  [VEHICLE_STATUS.VERY_LONG_IDLE]: '⚠️ Stationnement critique',
  [VEHICLE_STATUS.OFFLINE]: 'Hors ligne'
};

export const IDLE_THRESHOLDS = {
  IDLE: 1800,        // 30 minutes
  LONG_IDLE: 7200,   // 2 heures
  VERY_LONG_IDLE: 28800 // 8 heures
};