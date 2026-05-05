import { MAGIC_NUMBER } from '../utils/constants';

export class VehicleHelperService {
  static formatStopDuration(vehicle) {
    if (vehicle.speed > MAGIC_NUMBER.MOVING_SPEED_THRESHOLD) return null;
    
    let seconds = 0;
    
    if (vehicle.stop_duration_sec !== undefined && vehicle.stop_duration_sec !== null) {
      seconds = vehicle.stop_duration_sec;
    } else if (vehicle.timestamp) {
      const lastUpdate = new Date(vehicle.timestamp * 1000);
      const now = new Date();
      seconds = Math.floor((now - lastUpdate) / 1000);
    } else {
      return 'Stationné';
    }
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      if (hours > 0) return `🕐 ${days}j ${hours}h`;
      return `🕐 ${days}j`;
    }
    if (hours > 0) {
      if (minutes > 0) return `🕐 ${hours}h ${minutes}min`;
      return `🕐 ${hours}h`;
    }
    if (minutes > 0) {
      if (secs > 0) return `🕐 ${minutes}min ${secs}s`;
      return `🕐 ${minutes}min`;
    }
    return `🕐 ${secs}s`;
  }

  static formatAddress(vehicle, fallbackAddress = null) {
    if (vehicle.address && vehicle.address !== '-') return vehicle.address;
    if (fallbackAddress) return fallbackAddress;
    return `${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}`;
  }

  static isSignalLost(vehicle) {
    if (vehicle.online !== 'ack') return false;
    const lastUpdate = new Date(vehicle.time);
    return (Date.now() - lastUpdate.getTime()) > MAGIC_NUMBER.SIGNAL_LOST_THRESHOLD;
  }

  static getVehicleState(vehicle) {
    return {
      isMoving: vehicle.speed > MAGIC_NUMBER.MOVING_SPEED_THRESHOLD,
      hasAlarm: vehicle.alarm === 1,
      signalLost: this.isSignalLost(vehicle),
      status: vehicle.status,
      stopDisplay: this.formatStopDuration(vehicle)
    };
  }
}