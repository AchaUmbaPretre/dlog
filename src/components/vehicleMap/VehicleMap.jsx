import { Card } from "antd";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";

const VehicleMap = ({ positions }) => {
  return (
    <Card bordered style={{ borderRadius: 12 }} title="🗺️ Trajectoire">
      <MapContainer
        center={positions[0] || [0, 0]}
        zoom={positions.length > 0 ? 13 : 2}
        style={{ height: 400, width: "100%", borderRadius: 8 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {positions.length > 0 && (
          <>
            <Polyline positions={positions} color="blue" />
            <Marker position={positions[0]}>
              <Tooltip>🚩 Départ</Tooltip>
            </Marker>
            <Marker position={positions[positions.length - 1]}>
              <Tooltip>🏁 Arrivée</Tooltip>
            </Marker>
          </>
        )}
      </MapContainer>
    </Card>
  );
};

export default VehicleMap;
