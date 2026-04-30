export const TILE_LAYERS = {
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    name: 'Rue'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© <a href="https://www.esri.com">Esri</a>',
    name: 'Satellite'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © CartoDB',
    name: 'Nuit'
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © CartoDB',
    name: 'Jour'
  }
};

// Couleurs par statut
export const STATUS_COLORS = {
  online: { primary: '#52c41a', secondary: '#95de64', text: '#ffffff' },
  ack: { primary: '#faad14', secondary: '#ffd666', text: '#ffffff' },
  offline: { primary: '#ff4d4f', secondary: '#ff7875', text: '#ffffff' },
  moving: { primary: '#1890ff', secondary: '#69c0ff', text: '#ffffff' },
  alarm: { primary: '#faad14', secondary: '#ffd666', text: '#ffffff' }
};

export const MAP_CONFIG = {
  defaultZoom: 11,
  defaultCenter: [-4.358313, 15.348934],
  maxZoom: 19,
  minZoom: 3,
  flyDuration: 1.5,
  refreshInterval: 10000,
  markerSize: 40,
  trailWeight: 3,
  heatmapRadius: 30
};

// Statuts véhicule
export const VEHICLE_STATUS = {
  ONLINE: 'online',
  ACK: 'ack',
  OFFLINE: 'offline',
  MOVING: 'moving',
  STOPPED: 'stopped',
  ALARM: 'alarm'
};