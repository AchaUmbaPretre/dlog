import { VEHICLE_STATUS, STATUS_COLORS } from './constants';

export const getVehicleStatus = (vehicle) => {
  if (!vehicle.online || vehicle.online === 'offline') return VEHICLE_STATUS.OFFLINE;
  if (vehicle.alarm === 1) return VEHICLE_STATUS.ALARM;
  if (vehicle.speed > 5) return VEHICLE_STATUS.MOVING;
  if (vehicle.online === 'ack') return VEHICLE_STATUS.ACK;
  return VEHICLE_STATUS.ONLINE;
};

export const getStatusColor = (status) => {
  const colorMap = {
    [VEHICLE_STATUS.ONLINE]: STATUS_COLORS.online.primary,
    [VEHICLE_STATUS.ACK]: STATUS_COLORS.ack.primary,
    [VEHICLE_STATUS.OFFLINE]: STATUS_COLORS.offline.primary,
    [VEHICLE_STATUS.MOVING]: STATUS_COLORS.moving.primary,
    [VEHICLE_STATUS.ALARM]: STATUS_COLORS.alarm.primary
  };
  return colorMap[status] || STATUS_COLORS.online.primary;
};

export const formatDuration = (seconds) => {
  if (!seconds) return '0s';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) return `${hours}h ${minutes}min`;
  if (minutes > 0) return `${minutes}min ${secs}s`;
  return `${secs}s`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const calculateStats = (vehicles) => ({
  total: vehicles.length,
  online: vehicles.filter(v => v.online === 'online').length,
  moving: vehicles.filter(v => v.speed > 0).length,
  alerts: vehicles.filter(v => v.alarm === 1).length,
  totalDistance: Math.round(vehicles.reduce((acc, v) => acc + (v.total_distance || 0), 0)),
  avgSpeed: Math.round(vehicles.reduce((acc, v) => acc + v.speed, 0) / vehicles.length) || 0
});

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};