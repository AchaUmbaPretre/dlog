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
        
        // Choix de la couleur selon le statut
        let trailColor = '#1890ff';
        let trailOpacity = 0.7;
        
        if (vehicle.speed > 0) {
          trailColor = '#1890ff'; // bleu - en mouvement
          trailOpacity = 0.9;
        } else if (vehicle.alarm === 1) {
          trailColor = '#ff4d4f'; // rouge - alarme
          trailOpacity = 0.8;
        } else if (vehicle.online === 'ack') {
          trailColor = '#faad14'; // orange - ACK
          trailOpacity = 0.6;
        } else if (vehicle.online === 'online') {
          trailColor = '#52c41a'; // vert - en ligne
        }
        
        // Trail avec effet plus moderne
        const trail = L.polyline(coordinates, {
          color: trailColor,
          weight: 3.5,
          opacity: trailOpacity,
          className: 'vehicle-trail',
          smoothFactor: 1
        }).addTo(this.map);
        
        // Effet de glow (ombre)
        const glowTrail = L.polyline(coordinates, {
          color: trailColor,
          weight: 7,
          opacity: 0.2,
          className: 'vehicle-trail-glow'
        }).addTo(this.map);
        
        this.trails.set(vehicle.id, { trail, glowTrail });
      }
    });
  }

  clearTrails() {
    this.trails.forEach(({ trail, glowTrail }) => {
      if (trail) trail.remove();
      if (glowTrail) glowTrail.remove();
    });
    this.trails.clear();
  }
}