import L from 'leaflet';

export class HeatmapService {
  constructor(map) {
    this.map = map;
    this.heatLayer = null;
    this.canvas = null;
    this.updateHandler = null;
    this.resizeHandler = null;
  }

  updateHeatmap(vehicles) {
    this.clearHeatmap();
    
    const heatPoints = vehicles.map(vehicle => {
      const intensity = vehicle.speed > 0 ? 1 : 0.3;
      return [vehicle.lat, vehicle.lng, intensity];
    });
    
    this.createHeatLayer(heatPoints);
  }

  createHeatLayer(points) {
    if (!this.map) return;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'heatmap-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.opacity = '0.6';
    
    const ctx = this.canvas.getContext('2d');
    
    const updateHeatmap = () => {
      if (!this.map || !this.canvas) return;
      
      const size = this.map.getSize();
      this.canvas.width = size.x;
      this.canvas.height = size.y;
      
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      const bounds = this.map.getBounds();
      const zoom = this.map.getZoom();
      
      // Ajuster le rayon selon le niveau de zoom
      const baseRadius = 30;
      const radius = Math.max(15, baseRadius * (zoom / 15));
      
      points.forEach(point => {
        const latLng = L.latLng(point[0], point[1]);
        if (bounds.contains(latLng)) {
          const pixel = this.map.latLngToContainerPoint(latLng);
          const intensity = point[2] || 0.5;
          
          // Dégradé radial
          const gradient = ctx.createRadialGradient(pixel.x, pixel.y, 0, pixel.x, pixel.y, radius);
          gradient.addColorStop(0, `rgba(255, 50, 50, ${intensity * 0.9})`);
          gradient.addColorStop(0.3, `rgba(255, 165, 0, ${intensity * 0.6})`);
          gradient.addColorStop(0.6, `rgba(255, 255, 0, ${intensity * 0.3})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
          
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(pixel.x, pixel.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };
    
    this.updateHandler = () => updateHeatmap();
    this.resizeHandler = () => updateHeatmap();
    
    this.map.on('moveend', this.updateHandler);
    this.map.on('resize', this.resizeHandler);
    this.map.on('zoomend', this.updateHandler);
    
    updateHeatmap();
    
    this.map._panes.overlayPane.appendChild(this.canvas);
  }

  clearHeatmap() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }
    
    if (this.map && this.updateHandler) {
      this.map.off('moveend', this.updateHandler);
      this.map.off('resize', this.resizeHandler);
      this.map.off('zoomend', this.updateHandler);
      this.updateHandler = null;
      this.resizeHandler = null;
    }
  }
}