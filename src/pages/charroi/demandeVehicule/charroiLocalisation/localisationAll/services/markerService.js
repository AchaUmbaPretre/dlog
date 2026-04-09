import L from 'leaflet';
import { getVehicleStatus, getStatusColor } from '../utils/helpers';
import { MAP_CONFIG } from '../utils/constants';

export class MarkerService {
  constructor(map) {
    this.map = map;
    this.markers = new Map();
    this.popups = new Map();
  }

  createMarkerElement(vehicle, status) {
    const color = getStatusColor(status);
    const isMoving = status === 'moving';
    const hasAlarm = status === 'alarm';
    
    const element = document.createElement('div');
    element.className = 'custom-marker';
    element.innerHTML = `
      <div class="marker-container">
        <div class="marker-pulse" style="background: ${color}40"></div>
        <div class="marker-icon" style="background: ${color}; transform: rotate(${vehicle.course}deg)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L4 12l8 10 8-10-8-10z"/>
          </svg>
        </div>
        <div class="marker-speed">${vehicle.speed}</div>
      </div>
    `;

    const iconElement = element.querySelector('.marker-icon');
    if (isMoving) iconElement.classList.add('moving');
    if (hasAlarm) iconElement.classList.add('alarm');

    return element;
  }

  createPopupContent(vehicle) {
    const ignition = vehicle.sensors?.find(s => s.type === 'acc');
    const odometer = vehicle.sensors?.find(s => s.type === 'odometer');
    const alarm = vehicle.sensors?.find(s => s.type === 'textual');
    
    return `
      <div class="custom-popup-content">
        <div class="popup-header">
          <strong>${vehicle.name}</strong>
          <span class="popup-status ${vehicle.online}">
            ${vehicle.online === 'online' ? 'En ligne' : 'ACK'}
          </span>
        </div>
        <div class="popup-body">
          <div class="popup-row">
            <span>🚗 Vitesse:</span>
            <strong>${vehicle.speed} km/h</strong>
          </div>
          <div class="popup-row">
            <span>📍 Position:</span>
            <strong>${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}</strong>
          </div>
          <div class="popup-row">
            <span>📊 Odomètre:</span>
            <strong>${odometer?.value || '-'}</strong>
          </div>
          <div class="popup-row">
            <span>⚡ Contact:</span>
            <strong style="color: ${ignition?.val ? '#52c41a' : '#8c8c8c'}">
              ${ignition?.value || '-'}
            </strong>
          </div>
          ${alarm?.value && alarm.value !== '-' ? `
            <div class="popup-alert">
              ⚠️ ${alarm.value}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  updateMarkers(vehicles, onVehicleClick) {
    // Nettoyer les anciens marqueurs
    this.clearAll();

    vehicles.forEach(vehicle => {
      const status = getVehicleStatus(vehicle);
      const markerElement = this.createMarkerElement(vehicle, status);
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: markerElement.outerHTML,
        iconSize: [MAP_CONFIG.markerSize, MAP_CONFIG.markerSize],
        iconAnchor: [MAP_CONFIG.markerSize / 2, MAP_CONFIG.markerSize / 2],
        popupAnchor: [0, -MAP_CONFIG.markerSize / 2]
      });

      const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
        .addTo(this.map)
        .bindPopup(this.createPopupContent(vehicle), {
          maxWidth: 300,
          minWidth: 240,
          className: 'custom-popup'
        });

      marker.on('click', () => onVehicleClick(vehicle));
      
      this.markers.set(vehicle.id, marker);
    });
  }

  clearAll() {
    this.markers.forEach(marker => marker.remove());
    this.markers.clear();
    this.popups.forEach(popup => popup.remove());
    this.popups.clear();
  }

  getMarker(vehicleId) {
    return this.markers.get(vehicleId);
  }
}