import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotatedmarker';
import { VehicleMarker } from '../../../../../../components/vehicleMarker/VehicleMarker';

export const CharroiLeaflet = ({ vehicle, address }) => {
  const tailPositions = vehicle.tail?.map(t => [parseFloat(t.lat), parseFloat(t.lng)]) || [];
  const tailColors = tailPositions.map((_, idx) => `hsl(${(idx / tailPositions.length) * 120}, 70%, 50%)`);

  return (
    <MapContainer
      center={[vehicle.lat, vehicle.lng]}
      zoom={14}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <VehicleMarker vehicle={vehicle} address={address} zoomLevel={15} />

      {tailPositions.map((pos, i) => {
        if (i === tailPositions.length - 1) return null;
        return (
          <Polyline
            key={i}
            positions={[tailPositions[i], tailPositions[i + 1]]}
            color={tailColors[i]}
            weight={4}
          />
        );
      })}

      {vehicle.latest_positions?.split(';').map((pos, i) => {
        const [lat, lng] = pos.split('/');
        return (
          <Marker key={i} position={[parseFloat(lat), parseFloat(lng)]}>
            <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent={false}>
              #{i + 1}: Lat {lat}, Lng {lng}, Vitesse: {vehicle.speed} km/h
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
};