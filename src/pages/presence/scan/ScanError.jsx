import React from 'react';
import { scanStyles } from './styles';

const ScanError = ({ error, onRetry, onGoHome }) => {
  const getErrorIcon = () => {
    switch(error.type) {
      case 'INVALID_CODE':
        return '❌';
      case 'UNAUTHENTICATED':
        return '🔒';
      case 'NO_ACCESS':
        return '🚫';
      case 'OUT_OF_ZONE':
        return '📍';
      case 'ALREADY_COMPLETE':
        return '⏰';
      default:
        return '⚠️';
    }
  };
  
  const getErrorTitle = () => {
    switch(error.type) {
      case 'INVALID_CODE':
        return 'QR Code Invalide';
      case 'UNAUTHENTICATED':
        return 'Non authentifié';
      case 'NO_ACCESS':
        return 'Accès refusé';
      case 'OUT_OF_ZONE':
        return 'Hors zone autorisée';
      case 'ALREADY_COMPLETE':
        return 'Pointage déjà effectué';
      default:
        return 'Erreur de scan';
    }
  };
  
  return (
    <div style={scanStyles.container}>
      <style>{scanStyles.global}</style>
      <div style={scanStyles.card}>
        <div style={scanStyles.errorIcon}>
          {getErrorIcon()}
        </div>
        
        <h2 style={scanStyles.errorTitle}>
          {getErrorTitle()}
        </h2>
        
        <p style={scanStyles.errorMessage}>
          {error.message}
        </p>
        
        {error.distance && error.max_distance && (
          <div style={scanStyles.infoContainer}>
            <div style={scanStyles.infoRow}>
              <strong>Distance:</strong>
              <span>{error.distance}m</span>
            </div>
            <div style={scanStyles.infoRow}>
              <strong>Rayon autorisé:</strong>
              <span>{error.max_distance}m</span>
            </div>
          </div>
        )}
        
        <div style={scanStyles.buttonGroup}>
          {error.type !== 'INVALID_CODE' && error.type !== 'UNAUTHENTICATED' && (
            <button 
              onClick={onRetry}
              style={scanStyles.primaryButton}
            >
              Réessayer
            </button>
          )}
          <button 
            onClick={onGoHome}
            style={scanStyles.secondaryButton}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanError;