// services/heatmapService.js
import L from 'leaflet';

export class HeatmapService {
  constructor(map) {
    this.map = map;
    this.heatLayer = null;
    this.isReady = false;
    this.pendingVehicles = null;
  }

  updateHeatmap(vehicles) {
    // Stocker les véhicules pour plus tard si la carte n'est pas prête
    if (!this.map || !this.map._panes || !this.map._panes.overlayPane) {
      this.pendingVehicles = vehicles;
      console.log('Heatmap en attente, carte pas prête...');
      return;
    }
    
    this.pendingVehicles = null;
    this.clearHeatmap();
    
    if (!vehicles || vehicles.length === 0) return;
    
    const heatPoints = vehicles.map(vehicle => {
      const intensity = vehicle.speed > 0 ? 1 : 0.3;
      return [vehicle.lat, vehicle.lng, intensity];
    }).filter(point => point[0] && point[1] && !isNaN(point[0]) && !isNaN(point[1]));
    
    if (heatPoints.length === 0) return;
    
    try {
      // Créer une couche de cercles simple au lieu d'une heatmap complexe
      this.heatLayer = L.layerGroup().addTo(this.map);
      
      heatPoints.forEach(point => {
        const radius = point[2] > 0.7 ? 40 : point[2] > 0.4 ? 30 : 20;
        const color = point[2] > 0.7 ? '#ff4d4f' : point[2] > 0.4 ? '#faad14' : '#52c41a';
        
        const circle = L.circle([point[0], point[1]], {
          color: color,
          fillColor: color,
          fillOpacity: 0.4,
          radius: radius,
          weight: 1,
          opacity: 0.6
        }).addTo(this.heatLayer);
      });
      
      this.isReady = true;
    } catch (error) {
      console.error('Erreur heatmap:', error);
    }
  }

  clearHeatmap() {
    if (this.heatLayer && this.map) {
      try {
        this.map.removeLayer(this.heatLayer);
      } catch (e) {
        console.warn('Erreur suppression heatmap:', e);
      }
      this.heatLayer = null;
    }
    this.isReady = false;
  }
  
  retryPending() {
    if (this.pendingVehicles && this.map && this.map._panes && this.map._panes.overlayPane) {
      this.updateHeatmap(this.pendingVehicles);
    }
  }
}