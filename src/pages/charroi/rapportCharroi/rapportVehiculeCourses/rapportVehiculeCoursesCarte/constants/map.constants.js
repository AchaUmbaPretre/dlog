// constants/map.constants.js

export const MAP_CONFIG = {
  DEFAULT_CENTER: [-4.358313, 15.348934],
  DEFAULT_ZOOM: 11,
  MAX_CLUSTER_RADIUS: 80,
  ANIMATION_DURATION: 2000,
  TILE_LAYERS: {
    light: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri'
    },
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OSM'
    }
  }
};

// Ajout des thèmes
export const MAP_THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SATELLITE: 'satellite',
  STREETS: 'streets'
};

export const VEHICLE_STATUS = {
  MOVING: 'moving',
  STOPPED: 'stopped',
  IDLE: 'idle',
  LONG_IDLE: 'long_idle',
  VERY_LONG_IDLE: 'very_long_idle',
  OFFLINE: 'offline',
  NO_SIGNAL: 'no_signal'
};

export const STATUS_COLORS = {
  [VEHICLE_STATUS.MOVING]: '#10b981',
  [VEHICLE_STATUS.STOPPED]: '#f59e0b',
  [VEHICLE_STATUS.IDLE]: '#f97316',
  [VEHICLE_STATUS.LONG_IDLE]: '#ef4444',
  [VEHICLE_STATUS.VERY_LONG_IDLE]: '#7f1d1d',
  [VEHICLE_STATUS.OFFLINE]: '#6b7280',
  [VEHICLE_STATUS.NO_SIGNAL]: '#dc2626'
};

export const STATUS_ICONS = {
  [VEHICLE_STATUS.MOVING]: '🚀',
  [VEHICLE_STATUS.STOPPED]: '⏸️',
  [VEHICLE_STATUS.IDLE]: '🅿️',
  [VEHICLE_STATUS.LONG_IDLE]: '⚠️',
  [VEHICLE_STATUS.VERY_LONG_IDLE]: '🔴',
  [VEHICLE_STATUS.OFFLINE]: '📡',
  [VEHICLE_STATUS.NO_SIGNAL]: '🚨'
};

export const STATUS_LABELS = {
  [VEHICLE_STATUS.MOVING]: 'En mouvement',
  [VEHICLE_STATUS.STOPPED]: 'Arrêt momentané',
  [VEHICLE_STATUS.IDLE]: 'Stationnement',
  [VEHICLE_STATUS.LONG_IDLE]: 'Stationnement prolongé',
  [VEHICLE_STATUS.VERY_LONG_IDLE]: '⚠️ Stationnement critique',
  [VEHICLE_STATUS.OFFLINE]: 'Hors ligne',
  [VEHICLE_STATUS.NO_SIGNAL]: 'Signal perdu'
};

export const IDLE_THRESHOLDS = {
  IDLE: 1800,
  LONG_IDLE: 7200,
  VERY_LONG_IDLE: 28800
};

// Nouveaux seuils
export const SIGNAL_LOST_THRESHOLD = 7200; // 2 heures sans signal
export const BATTERY_LOW_THRESHOLD = 20; // 20% batterie
export const BATTERY_CRITICAL_THRESHOLD = 10; // 10% batterie