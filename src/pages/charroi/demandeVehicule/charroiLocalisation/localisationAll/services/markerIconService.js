import L from 'leaflet';
import { VehicleHelperService } from './vehicleHelperService';
import { getStatusColor } from '../utils/helpers';
import { MAGIC_NUMBER } from '../utils/constants';

export class MarkerIconService {
  static createPremiumVehicleIcon(vehicle, status, isMoving, hasAlarm, direction) {
    const color = getStatusColor(status);
    const signalLost = VehicleHelperService.isSignalLost(vehicle);
    const iconColor = signalLost ? '#dc2626' : color; 
    const size = MAGIC_NUMBER.MARKER_SIZE;
    const rotation = direction?.angle || 0;
    const stopDisplay = !isMoving ? VehicleHelperService.formatStopDuration(vehicle) : null;
    
    const getPremiumShape = () => `
      <g transform="rotate(${rotation}, 14, 14)">
        <path d="M14 2L3 24L14 19L25 24L14 2Z" fill="${iconColor}" stroke="#1f2937" stroke-width="1.5"/>
        <circle cx="8" cy="22" r="2.5" fill="#1f2937"/>
        <circle cx="20" cy="22" r="2.5" fill="#1f2937"/>
        <path d="M11 14L14 9L17 14H11Z" fill="white" opacity="0.6"/>
        ${hasAlarm ? `<circle cx="14" cy="14" r="12" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 4" opacity="0.8"/>` : ''}
      </g>
    `;
    
    return L.divIcon({
      html: `
        <div class="premium-vehicle-marker ${isMoving ? 'moving' : ''}" style="position:relative;cursor:pointer;">
          <div class="marker-glow" style="position:absolute;width:${size+12}px;height:${size+12}px;left:-${size/2+6}px;top:-${size/2+6}px;background:radial-gradient(circle,${iconColor}40 0%,transparent 70%);border-radius:50%;animation:pulse 2s infinite"></div>
          <svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="none" style="filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3))">
            ${getPremiumShape()}
          </svg>
          <div class="status-indicator" style="position:absolute;top:-12px;left:-12px;background:${iconColor};width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)">
            ${signalLost ? '📡' : hasAlarm ? '⚠️' : (isMoving ? '🚀' : '🅿️')}
          </div>
          <div class="speed-badge" style="position:absolute;bottom:-55px;left:50%;transform:translateX(-50%);background:${iconColor};color:white;padding:4px 10px;border-radius:16px;font-size:10px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.2)">
            ${isMoving ? `${Math.round(vehicle.speed)} km/h` : (stopDisplay || '🅿️ Stationné')}
          </div>
        </div>
      `,
      className: 'premium-vehicle-icon',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2]
    });
  }
}