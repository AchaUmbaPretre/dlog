import L from 'leaflet';
import { getVehicleStatus, getStatusColor } from '../utils/helpers';
import { MAP_CONFIG } from '../utils/constants';
import { fetchAddress } from '../../../../../../utils/fetchAddress';
import { getCorrectDirection } from '../../../../../../utils/prioriteIcons';

export class MarkerService {
  constructor(map) {
    this.map = map;
    this.markers = new Map();
    this.popups = new Map();
    this.addressCache = new Map();
    this.pendingRequests = new Map();
  }

  createMarkerElement(vehicle, status) {
    const color = getStatusColor(status);
    const isMoving = status === 'moving';
    const hasAlarm = status === 'alarm';
    const direction = getCorrectDirection(vehicle.course);
    
    let bgColor = color;
    let borderColor = '#ffffff';
    
    if (hasAlarm) {
      borderColor = '#ff4d4f';
    }
    
    const element = document.createElement('div');
    element.className = 'custom-marker';
    element.innerHTML = `
      <div class="marker-container">
        <div class="marker-pulse" style="background: ${color}40"></div>
        <div class="marker-icon" style="background: ${bgColor}; border: 2px solid ${borderColor}; width: 44px; height: 44px;">
          <div style="transform: rotate(${direction.angle}deg); transition: transform 0.3s ease;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style="display: block;">
              <path d="M12 2L4 12l8 10 8-10-8-10z" stroke="white" stroke-width="1"/>
            </svg>
          </div>
        </div>
        <div class="marker-speed" style="background: #1a1a1a; font-weight: bold;">
          ${vehicle.speed}
        </div>
        ${isMoving ? `<div class="marker-direction">${direction.label}</div>` : ''}
      </div>
    `;

    const iconElement = element.querySelector('.marker-icon');
    if (isMoving) iconElement.classList.add('moving');
    if (hasAlarm) iconElement.classList.add('alarm');

    return element;
  }

  // Récupérer l'adresse via l'API directement
  async getVehicleAddress(vehicle) {
    const cacheKey = `${vehicle.id}_${vehicle.lat}_${vehicle.lng}`;
    
    if (this.addressCache.has(cacheKey)) {
      return this.addressCache.get(cacheKey);
    }

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = (async () => {
      try {
        if (vehicle.address && vehicle.address !== '-') {
          this.addressCache.set(cacheKey, vehicle.address);
          return vehicle.address;
        }

        const address = await fetchAddress({
          lat: vehicle.lat,
          lng: vehicle.lng
        });
        
        const formattedAddress = address && address !== "undefined, undefined" 
          ? address 
          : `${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}`;
        
        this.addressCache.set(cacheKey, formattedAddress);
        return formattedAddress;
      } catch (error) {
        console.warn('Erreur récupération adresse:', error);
        const fallbackAddress = `${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}`;
        this.addressCache.set(cacheKey, fallbackAddress);
        return fallbackAddress;
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    })();

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  getVehicleAddressSync(vehicle) {
    if (vehicle.address && vehicle.address !== '-') {
      return vehicle.address;
    }
    return `${vehicle.lat.toFixed(6)}, ${vehicle.lng.toFixed(6)}`;
  }

  createPopupContent(vehicle, address = null) {
    // Utiliser la fonction importée directement, pas this.
    const direction = getCorrectDirection(vehicle.course);
    const ignition = vehicle.sensors?.find(s => s.type === 'acc');
    const odometer = vehicle.sensors?.find(s => s.type === 'odometer');
    const alarm = vehicle.sensors?.find(s => s.type === 'textual');
    
    const displayAddress = address || this.getVehicleAddressSync(vehicle);
    
    const escapeHtml = (str) => {
      if (!str) return '';
      return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    };

    return `
      <div class="custom-popup-content">
        <div class="popup-header">
          <strong>${escapeHtml(vehicle.name)}</strong>
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
            <span>🧭 Direction:</span>
            <strong>
              <span style="display: inline-block; transform: rotate(${direction.angle}deg); margin-right: 4px;">↑</span>
              ${direction.label} (${vehicle.course}°)
            </strong>
          </div>
          <div class="popup-row">
            <span>📍 Adresse:</span>
            <strong style="font-size: 11px; max-width: 200px; word-wrap: break-word;">
              ${escapeHtml(displayAddress)}
            </strong>
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
              ⚠️ ${escapeHtml(alarm.value)}
            </div>
          ` : ''}
          <div class="popup-row">
            <span>🕐 Dernière mise à jour:</span>
            <strong style="font-size: 10px;">${vehicle.time || '-'}</strong>
          </div>
        </div>
      </div>
    `;
  }

  async updateMarkersAsync(vehicles, onVehicleClick) {
    this.clearAll();

    for (const vehicle of vehicles) {
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
        .addTo(this.map);

      const tempAddress = this.getVehicleAddressSync(vehicle);
      const popupContent = this.createPopupContent(vehicle, tempAddress);
      marker.bindPopup(popupContent, {
        maxWidth: 320,
        minWidth: 260,
        className: 'custom-popup'
      });

      marker.bindTooltip(vehicle.name, {
        permanent: false,
        direction: 'top',
        offset: [0, -20],
        className: 'vehicle-tooltip'
      });

      marker.on('click', () => onVehicleClick(vehicle));
      
      this.markers.set(vehicle.id, marker);

      this.getVehicleAddress(vehicle).then(address => {
        if (address !== tempAddress) {
          const updatedPopupContent = this.createPopupContent(vehicle, address);
          marker.bindPopup(updatedPopupContent, {
            maxWidth: 320,
            minWidth: 260,
            className: 'custom-popup'
          });
        }
      }).catch(error => {
        console.warn(`Erreur adresse pour ${vehicle.name}:`, error);
      });
    }
  }

  updateMarkers(vehicles, onVehicleClick) {
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

      const address = this.getVehicleAddressSync(vehicle);
      const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
        .addTo(this.map)
        .bindPopup(this.createPopupContent(vehicle, address), {
          maxWidth: 320,
          minWidth: 260,
          className: 'custom-popup'
        });

      marker.bindTooltip(vehicle.name, {
        permanent: false,
        direction: 'top',
        offset: [0, -20],
        className: 'vehicle-tooltip'
      });

      marker.on('click', () => onVehicleClick(vehicle));
      
      this.markers.set(vehicle.id, marker);
    });
  }

  clearAll() {
    this.markers.forEach(marker => {
      try {
        marker.remove();
      } catch (e) {
        console.warn('Erreur suppression marqueur:', e);
      }
    });
    this.markers.clear();
    this.popups.clear();
    this.addressCache.clear();
    this.pendingRequests.clear();
  }

  getMarker(vehicleId) {
    return this.markers.get(vehicleId);
  }

  async updateMarker(vehicle, onVehicleClick) {
    const existingMarker = this.markers.get(vehicle.id);
    if (existingMarker) {
      existingMarker.remove();
    }

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
      .addTo(this.map);
    
    const address = await this.getVehicleAddress(vehicle);
    const popupContent = this.createPopupContent(vehicle, address);
    marker.bindPopup(popupContent, {
      maxWidth: 320,
      minWidth: 260,
      className: 'custom-popup'
    });

    marker.bindTooltip(vehicle.name, {
      permanent: false,
      direction: 'top',
      offset: [0, -20],
      className: 'vehicle-tooltip'
    });

    marker.on('click', () => onVehicleClick(vehicle));
    
    this.markers.set(vehicle.id, marker);
  }
}