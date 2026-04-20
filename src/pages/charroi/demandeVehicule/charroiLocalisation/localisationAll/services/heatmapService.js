// services/heatmapService.js
import L from 'leaflet';

// Heatmap Layer personnalisé - Version corrigée
const CustomHeatLayer = L.Layer.extend({
  initialize: function(points, options) {
    this._points = points;
    L.setOptions(this, options);
    this._canvas = null;
    this._ctx = null;
  },

  onAdd: function(map) {
    this._map = map;
    
    // Vérifier que map._panes existe
    if (!map._panes || !map._panes.overlayPane) {
      console.warn('Map panes not ready, retrying...');
      setTimeout(() => this.onAdd(map), 100);
      return;
    }
    
    this._canvas = L.DomUtil.create('canvas', 'heatmap-canvas');
    this._canvas.style.position = 'absolute';
    this._canvas.style.top = '0px';
    this._canvas.style.left = '0px';
    this._canvas.style.pointerEvents = 'none';
    this._canvas.style.zIndex = '1000';
    
    this._resize();
    
    map._panes.overlayPane.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');
    
    map.on('moveend', this._redraw, this);
    map.on('resize', this._resize, this);
    map.on('zoomend', this._redraw, this);
    
    this._redraw();
  },

  onRemove: function(map) {
    if (this._canvas && this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    map.off('moveend', this._redraw, this);
    map.off('resize', this._resize, this);
    map.off('zoomend', this._redraw, this);
    this._canvas = null;
    this._ctx = null;
  },

  _resize: function() {
    if (!this._map || !this._canvas) return;
    const size = this._map.getSize();
    this._canvas.width = size.x;
    this._canvas.height = size.y;
    this._canvas.style.width = size.x + 'px';
    this._canvas.style.height = size.y + 'px';
    this._redraw();
  },

  _redraw: function() {
    if (!this._canvas || !this._ctx || !this._map) return;
    
    const ctx = this._ctx;
    const map = this._map;
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    
    const baseRadius = this.options.radius || 30;
    const radius = Math.max(15, baseRadius * (zoom / 12));
    
    this._points.forEach(point => {
      const latLng = L.latLng(point[0], point[1]);
      if (bounds.contains(latLng)) {
        const pixel = map.latLngToContainerPoint(latLng);
        const intensity = point[2] || 0.5;
        
        const gradient = ctx.createRadialGradient(pixel.x, pixel.y, 0, pixel.x, pixel.y, radius);
        
        if (intensity > 0.7) {
          gradient.addColorStop(0, 'rgba(255, 50, 50, 0.9)');
          gradient.addColorStop(0.4, 'rgba(255, 165, 0, 0.6)');
          gradient.addColorStop(0.7, 'rgba(255, 255, 0, 0.3)');
        } else if (intensity > 0.4) {
          gradient.addColorStop(0, 'rgba(255, 165, 0, 0.8)');
          gradient.addColorStop(0.4, 'rgba(255, 255, 0, 0.5)');
          gradient.addColorStop(0.7, 'rgba(50, 205, 50, 0.2)');
        } else {
          gradient.addColorStop(0, 'rgba(50, 205, 50, 0.7)');
          gradient.addColorStop(0.4, 'rgba(100, 200, 100, 0.4)');
          gradient.addColorStop(0.7, 'rgba(100, 200, 100, 0.1)');
        }
        
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
});

export class HeatmapService {
  constructor(map) {
    this.map = map;
    this.heatLayer = null;
  }

  updateHeatmap(vehicles) {
    this.clearHeatmap();
    
    if (!this.map || !vehicles.length) return;
    
    const heatPoints = vehicles.map(vehicle => {
      const intensity = vehicle.speed > 0 ? 1 : 0.3;
      return [vehicle.lat, vehicle.lng, intensity];
    });
    
    if (heatPoints.length === 0) return;
    
    // Attendre que la carte soit prête
    if (!this.map._panes || !this.map._panes.overlayPane) {
      setTimeout(() => this.updateHeatmap(vehicles), 200);
      return;
    }
    
    this.heatLayer = new CustomHeatLayer(heatPoints, {
      radius: 30,
      blur: 15,
      maxZoom: 17,
      minOpacity: 0.3
    }).addTo(this.map);
  }

  clearHeatmap() {
    if (this.heatLayer && this.map) {
      this.map.removeLayer(this.heatLayer);
      this.heatLayer = null;
    }
  }
}