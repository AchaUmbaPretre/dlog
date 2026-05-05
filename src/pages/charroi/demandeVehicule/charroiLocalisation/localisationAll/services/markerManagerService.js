import L from 'leaflet';
import { MarkerIconService } from './markerIconService';
import { PopupContentService } from './popupContentService';
import { getVehicleStatus } from '../utils/helpers';
import { getCorrectDirection } from '../../../../../../utils/prioriteIcons';
import { MAGIC_NUMBER } from '../utils/constants';

export class MarkerManagerService {
  constructor(map) {
    this.map = map;
    this.markers = new Map();
  }

  clearAll() {
    this.markers.forEach(marker => marker.remove());
    this.markers.clear();
  }

  async updateMarkersAsync(vehicles, onVehicleClick) {
    this.clearAll();
    
    vehicles.forEach(vehicle => {
      const status = getVehicleStatus(vehicle);
      const isMoving = vehicle.speed > MAGIC_NUMBER.MOVING_SPEED_THRESHOLD;
      const hasAlarm = vehicle.alarm === 1;
      const direction = getCorrectDirection(vehicle.course);
      
      const icon = MarkerIconService.createPremiumVehicleIcon(
        vehicle, status, isMoving, hasAlarm, direction
      );
      
      const address = vehicle.address || `${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}`;
      const popupContent = PopupContentService.createPremiumPopupContent(vehicle, address);
      
      const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
        .addTo(this.map)
        .bindPopup(popupContent, {
          maxWidth: 320,
          minWidth: 280,
          className: 'premium-popup'
        })
        .bindTooltip(vehicle.name, {
          permanent: false,
          direction: 'top',
          offset: [0, -30],
          className: 'premium-tooltip'
        });
      
      marker.on('click', () => onVehicleClick(vehicle));
      this.markers.set(vehicle.id, marker);
    });
  }
}