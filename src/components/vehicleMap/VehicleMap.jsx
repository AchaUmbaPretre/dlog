import React, { useMemo, useEffect } from "react";
import { Card } from "antd";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";

/* Ajuste automatiquement le zoom pour montrer toutes les positions */
const FitBounds = ({ positions, maxZoom = 16, minZoom = 4 }) => {
  const map = useMap();

  useEffect(() => {
    if (positions && positions.length > 0) {
      map.fitBounds(positions, { padding: [50, 50], maxZoom, minZoom });
    }
  }, [map, positions, maxZoom, minZoom]);

  return null;
};

/* --- Calcul distance en km --- */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* --- Filtre les mouvements irréalistes (>500 m) --- */
function filterUnrealisticMoves(positions, maxDistanceKm = 0.5) {
  if (positions.length < 2) return positions;
  const result = [positions[0]];
  for (let i = 1; i < positions.length; i++) {
    const [lat1, lon1] = result[result.length - 1];
    const [lat2, lon2] = positions[i];
    const d = getDistanceKm(lat1, lon1, lat2, lon2);
    if (d < maxDistanceKm) result.push(positions[i]);
  }
  return result;
}

const VehicleMap = ({ positions = [], lineColor = "blue", height = 300 }) => {
  const validPositions = useMemo(() => {
    const numeric = positions
      .filter(p => Array.isArray(p) && p.length === 2)
      .map(([lat, lng]) => [parseFloat(lat), parseFloat(lng)])
      .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

    // Supprimer les sauts GPS trop grands
    return filterUnrealisticMoves(numeric, 0.5);
  }, [positions]);

  const hasPositions = validPositions.length > 0;

  return (
    <Card bordered style={{ borderRadius: 12 }} title="🗺️ Trajectoire">
      <MapContainer
        center={hasPositions ? validPositions[0] : [0, 0]}
        zoom={hasPositions ? 17 : 2}
        style={{ height, width: "100%", borderRadius: 8 }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {hasPositions ? (
          <>
            <FitBounds positions={validPositions} />
            <Polyline positions={validPositions} color={lineColor} weight={4} opacity={0.7} />
            <Marker position={validPositions[0]}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                🚩 Départ
              </Tooltip>
            </Marker>
            <Marker position={validPositions[validPositions.length - 1]}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                🏁 Arrivée
              </Tooltip>
            </Marker>
          </>
        ) : (
          <Marker position={[0, 0]}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
              Aucune donnée
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </Card>
  );
};

export default VehicleMap;
