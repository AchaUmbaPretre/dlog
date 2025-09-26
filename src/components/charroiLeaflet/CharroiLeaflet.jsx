import { MapContainer, TileLayer, Marker, Polyline, Tooltip, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { VehicleMarker } from "../vehicleMarker/VehicleMarker";
import L from "leaflet";
import "./charroiLeaflet.scss";
import { getSpeedColor } from "../../utils/getSpeedColor";

export const CharroiLeaflet = ({ vehicle, address }) => {
  if (!vehicle) return null;

  const tailPositions =
    vehicle.tail?.map((t) => [parseFloat(t.lat), parseFloat(t.lng)]) || [];

  const gradientPolyline = tailPositions.slice(0, -1).map((pos, i) => ({
    latlngs: [pos, tailPositions[i + 1]],
    color: `hsl(${(i / (tailPositions.length - 1 || 1)) * 120}, 70%, 50%)`,
  }));

  return (
    <MapContainer
      center={[vehicle.lat, vehicle.lng]}
      zoom={14}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      }}
      scrollWheelZoom
      zoomControl
      className="charroi-map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <ScaleControl position="bottomleft" />

      <VehicleMarker vehicle={vehicle} address={address} zoomLevel={15} />

      {gradientPolyline.map(
        (seg, i) =>
          seg.latlngs[1] && (
            <Polyline
              key={i}
              positions={seg.latlngs}
              pathOptions={{
                color: seg.color,
                weight: 4,
                opacity: 0.9,
              }}
            />
          )
      )}

      {vehicle.latest_positions?.split(";").map((pos, i) => {
        const [lat, lng] = pos.split("/");
        if (!lat || !lng) return null;
        return (
          <Marker key={i} position={[parseFloat(lat), parseFloat(lng)]}>
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={0.95}
              className="custom-tooltip"
            >
              <div>
                <strong>📍 Étape {i + 1}</strong>
                <br />
                Lat: {lat}, Lng: {lng}
                <br />
                🚗 Vitesse:{" "}
                <span className={`speed-${getSpeedColor(vehicle.speed)}`}>
                  {vehicle.speed} km/h
                </span>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
};