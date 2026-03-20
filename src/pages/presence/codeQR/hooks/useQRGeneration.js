import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getGenerateQR } from '../../../../services/presenceService';
import { getSite, getZone } from '../../../../services/charroiService';

export const useQRGeneration = () => {
  const [formData, setFormData] = useState({
    site_id: '',
    zone_id: '',
    type_pointage: 'ENTREE_SORTIE'
  });
  const [sites, setSites] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingZones, setLoadingZones] = useState(false);
  const [error, setError] = useState(null);
  const [qrResult, setQrResult] = useState(null);
  const currentUser = useSelector((state) => state.user?.currentUser);

  const fetchSites = async () => {
    try {
      setLoadingSites(true);
      const response = await getSite();
      const sitesData = response?.data?.data
      setSites(Array.isArray(sitesData) ? sitesData : []);
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError('Erreur lors du chargement des sites');
    } finally {
      setLoadingSites(false);
    }
  };

    useEffect(() => {
    fetchSites();
  }, []);

  const fetchZones = async (siteId) => {
    try {
      setLoadingZones(true);
      const response = await getZone(siteId);
      const zonesData = response?.data || response;
      setZones(Array.isArray(zonesData) ? zonesData : []);
    } catch (err) {
      console.error('Error fetching zones:', err);
      setZones([]);
    } finally {
      setLoadingZones(false);
    }
  };

    useEffect(() => {
    if (formData.site_id) {
      fetchZones(formData.site_id);
    } else {
      setZones([]);
      setFormData(prev => ({ ...prev, zone_id: '' }));
    }
  }, [formData.site_id]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateQR = async () => {
    setLoading(true);
    setError(null);
    setQrResult(null);

    try {
      const requestData = {
        site_id: parseInt(formData.site_id),
        type_pointage: formData.type_pointage,
        user_id: currentUser?.id_utilisateur,
        role: currentUser?.role
      };

      if (formData.zone_id) {
        requestData.zone_id = parseInt(formData.zone_id);
      }

      const response = await getGenerateQR(requestData);
      console.log('API Response:', response);
      
      // Correction: prendre response directement car l'API retourne l'objet sans wrapper data
      const qrData = response?.data || response;
      
      if (!qrData || !qrData.qr_code) {
        throw new Error('Réponse invalide du serveur');
      }
      
      setQrResult(qrData);
      return qrData;
    } catch (err) {
      console.error('Error generating QR:', err);
      setError(err.message || 'Erreur lors de la génération du QR code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      site_id: '',
      zone_id: '',
      type_pointage: 'ENTREE_SORTIE'
    });
    setQrResult(null);
    setError(null);
  };

  const getSelectedSiteName = () => {
    const site = sites.find(s => s.id_site === parseInt(formData.site_id));
    return site ? site.nom_site : '';
  };

  // Retourner toutes les valeurs nécessaires
  return {
    formData,
    sites,
    zones,
    loading,
    loadingSites,
    loadingZones,
    error,
    qrResult,
    handleInputChange,
    generateQR,
    resetForm,
    getSelectedSiteName,
    currentUser
  };
};