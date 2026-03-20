import React from 'react';

const QRForm = ({ 
  formData = { site_id: '', zone_id: '', type_pointage: 'ENTREE_SORTIE' },
  sites = [], 
  zones = [], 
  loading = false, 
  loadingSites = false, 
  loadingZones = false, 
  error = null, 
  handleInputChange = () => {}, 
  onSubmit = () => {} 
}) => {
  return (
    <div className="form-card">
      <h2 className="form-title">Générer un QR Code Statique</h2>
      <p className="form-subtitle">Créez un QR code permanent pour le pointage des employés</p>
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">
            Site <span className="required">*</span>
          </label>
          <select
            name="site_id"
            value={formData.site_id || ''}
            onChange={handleInputChange}
            required
            disabled={loadingSites}
            className="form-select"
          >
            <option value="">Sélectionner un site</option>
            {sites.map(site => (
              <option key={site.id_site} value={site.id_site}>
                {site.nom_site}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Zone <span style={{ fontSize: '12px', color: '#718096' }}>(Optionnel)</span>
          </label>
          <select
            name="zone_id"
            value={formData.zone_id || ''}
            onChange={handleInputChange}
            disabled={!formData.site_id || loadingZones}
            className="form-select"
          >
            <option value="">Aucune zone (site entier)</option>
            {zones.map(zone => (
              <option key={zone.id} value={zone.id}>
                {zone.nom_zone || `Zone ${zone.id}`}
              </option>
            ))}
          </select>
          {loadingZones && (
            <div style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
              Chargement des zones...
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Type de pointage
          </label>
          <select
            name="type_pointage"
            value={formData.type_pointage || 'ENTREE_SORTIE'}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="ENTREE_SORTIE">Entrée et Sortie (Complet)</option>
            <option value="ENTREE">Entrée uniquement</option>
            <option value="SORTIE">Sortie uniquement</option>
          </select>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.site_id}
          className="submit-button"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Génération en cours...
            </>
          ) : (
            'Générer le QR Code'
          )}
        </button>
      </form>
    </div>
  );
};

export default QRForm;