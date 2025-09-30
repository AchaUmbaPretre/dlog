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


const VehicleMap = ({ positions = [], lineColor = "blue", height = 400 }) => {
  const validPositions = useMemo(
    () => positions.filter(pos => Array.isArray(pos) && pos.length === 2),
    [positions]
  );

  const hasPositions = validPositions.length > 0;

  return (
    <Card bordered style={{ borderRadius: 12 }} title="🗺️ Trajectoire">
      <MapContainer
        center={hasPositions ? validPositions[0] : [0, 0]}
        zoom={hasPositions ? 13 : 2}
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
