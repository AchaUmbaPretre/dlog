import L from 'leaflet';

export class TrailService {
  constructor(map) {
    this.map = map;
    this.trails = new Map();
  }

  updateTrails(vehicles) {
    this.clearTrails();

    vehicles.forEach(vehicle => {
      if (vehicle.tail && vehicle.tail.length > 1) {
        const coordinates = vehicle.tail.map(pos => [parseFloat(pos.lat), parseFloat(pos.lng)]);
        
        const trailColor = vehicle.online === 'online' ? '#52c41a' : '#faad14';
        
        const trail = L.polyline(coordinates, {
          color: trailColor,
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 10',
          className: 'vehicle-trail'
        }).addTo(this.map);
        
        this.trails.set(vehicle.id, trail);
      }
    });
  }

  clearTrails() {
    this.trails.forEach(trail => trail.remove());
    this.trails.clear();
  }
}