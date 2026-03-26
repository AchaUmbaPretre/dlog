import { scanStyles } from './styles';
import { getErrorData } from './utils/errorUtils';

const ScanError = ({ error, onRetry, onGoHome }) => {
    const { icon, title } = getErrorData(error.type);
  
  return (
    <div style={scanStyles.container}>
      <style>{scanStyles.global}</style>
      <div style={scanStyles.card}>
        <div style={scanStyles.errorIcon}>
          {icon}
        </div>
        
        <h2 style={scanStyles.errorTitle}>
          {title}
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