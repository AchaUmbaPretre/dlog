import React from 'react';
import { VehicleAddress } from '../../../../../../utils/vehicleAddress';

export const VehiclePopupContent = ({ vehicle, rawData }) => {
  const addressRecord = {
    capteurInfo: {
      address: vehicle.address || rawData?.capteurInfo?.address,
      time: vehicle.lastUpdate || rawData?.capteurInfo?.time,
      lat: vehicle.lat,
      lng: vehicle.lng
    },
    lat: vehicle.lat,
    lng: vehicle.lng
  };

  return (
    <div style={{ minWidth: 260, maxWidth: 320 }}>
      {/* En-tête */}
      <div style={{ 
        borderBottom: '1px solid #e5e7eb', 
        paddingBottom: 8, 
        marginBottom: 8 
      }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
          {vehicle.name}
        </h3>
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
          {vehicle.registration}
        </div>
      </div>
      
      {/* Adresse avec votre composant */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
          📍 Position actuelle
        </div>
        <VehicleAddress record={addressRecord} />
      </div>
      
      {/* Détails du véhicule */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{ width: 20 }}>👤</span>
          <span style={{ color: '#374151' }}>{vehicle.driver}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{ width: 20 }}>📍</span>
          <span style={{ color: '#374151' }}>{vehicle.destination || 'Destination inconnue'}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{ width: 20 }}>⚡</span>
          <span style={{ 
            color: vehicle.speed > 80 ? '#ef4444' : '#374151',
            fontWeight: vehicle.speed > 80 ? 'bold' : 'normal'
          }}>
            {vehicle.speed} km/h
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{ width: 20 }}>⏸️</span>
          <span>{vehicle.stopDurationFormatted}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{ width: 20 }}>📊</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span>Efficacité</span>
              <span style={{ fontWeight: 600 }}>{vehicle.efficiency}%</span>
            </div>
            <div style={{ 
              height: 4, 
              background: '#e5e7eb', 
              borderRadius: 2, 
              overflow: 'hidden' 
            }}>
              <div style={{ 
                width: `${vehicle.efficiency}%`, 
                height: '100%', 
                background: vehicle.efficiency > 70 ? '#22c55e' : vehicle.efficiency > 40 ? '#eab308' : '#ef4444',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Commentaire */}
      {vehicle.comment && (
        <div style={{ 
          fontSize: 11, 
          color: '#6b7280', 
          marginTop: 8, 
          paddingTop: 8, 
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: 6
        }}>
          <span>💬</span>
          <span>{vehicle.comment}</span>
        </div>
      )}
    </div>
  );
};