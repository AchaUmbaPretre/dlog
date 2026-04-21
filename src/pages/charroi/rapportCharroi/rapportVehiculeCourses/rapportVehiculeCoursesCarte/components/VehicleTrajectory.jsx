import React from 'react';
import { Polyline } from 'react-leaflet';

export const VehicleTrajectory = ({ trajectory, status }) => {
  if (trajectory.length <= 1) return null;
  
  return (
    <Polyline
      positions={trajectory}
      color={status === 'moving' ? '#22c55e' : '#eab308'}
      weight={3}
      opacity={0.6}
    />
  );
};