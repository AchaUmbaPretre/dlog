import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScanSuccess from './ScanSuccess';
import ScanError from './ScanError';
import { scanStyles } from './styles';
import { getValidateQR } from '../../../services/presenceService';

const Scan = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const currentUser = useSelector((state) => state.user?.currentUser);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      setError({
        type: 'INVALID_CODE',
        message: 'Code QR invalide ou manquant'
      });
      setLoading(false);
      return;
    }

    if (!currentUser) {
      setError({
        type: 'UNAUTHENTICATED',
        message: 'Veuillez vous connecter pour pointer'
      });
      setLoading(false);
      return;
    }

    // Obtenir la position géographique si disponible
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          processScan(code, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Continuer sans géolocalisation
          processScan(code, null);
        }
      );
    } else {
      // Géolocalisation non supportée
      processScan(code, null);
    }
  }, [searchParams, currentUser]);

  const processScan = async (code, location) => {
    try {
      setLoading(true);
      
      const requestData = {
        code: code,
        ...location
      };
      
      const response = await getValidateQR(requestData);
      setResult(response);
    } catch (err) {
      console.error('Scan error:', err);
      setError({
        type: err.code || 'SCAN_ERROR',
        message: err.message || 'Erreur lors du scan'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={scanStyles.container}>
        <style>{scanStyles.global}</style>
        <div style={scanStyles.card}>
          <div style={scanStyles.loadingContainer}>
            <div style={scanStyles.spinner}></div>
            <h2 style={scanStyles.title}>Traitement en cours...</h2>
            <p style={scanStyles.subtitle}>Veuillez patienter</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ScanError 
        error={error} 
        onRetry={handleRetry} 
        onGoHome={handleGoHome} 
      />
    );
  }

  if (result && result.success) {
    return (
      <ScanSuccess 
        result={result} 
        onGoHome={handleGoHome} 
      />
    );
  }

  return null;
};

export default Scan;