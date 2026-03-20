import React from 'react';

const QRResult = ({ 
  qrResult = null, 
  formData = { type_pointage: 'ENTREE_SORTIE' }, 
  onPrint = () => {}, 
  onDownload = () => {}, 
  onRegenerate = () => {} 
}) => {
  if (!qrResult || !qrResult.site) {
    return null;
  }

  return (
    <div className="qr-result">
      <div className="qr-result-header">
        <div className="qr-result-title">
          ✅ QR Code Généré avec Succès
        </div>
        <button onClick={onRegenerate} className="regenerate-button">
          🔄 Générer un nouveau QR Code
        </button>
      </div>
      
      <div className="qr-display">
        <div className="qr-image">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrResult.qr_url)}`}
            alt="QR Code"
            width={250}
            height={250}
          />
        </div>
        
        <div className="qr-info">
          <p>
            <strong>Code QR:</strong> 
            <code className="qr-code-text">{qrResult.qr_code}</code>
          </p>
          <p>
            <strong>Site:</strong> 
            {qrResult.site.nom_site}
          </p>
          {qrResult.zone && (
            <p>
              <strong>Zone:</strong> 
              Zone {qrResult.zone.id}
            </p>
          )}
          <p>
            <strong>Type:</strong> 
            {formData.type_pointage === 'ENTREE_SORTIE' ? 'Entrée et Sortie' :
             formData.type_pointage === 'ENTREE' ? 'Entrée uniquement' :
             'Sortie uniquement'}
          </p>
          <p>
            <strong>URL:</strong> 
            <code className="qr-code-text">{qrResult.qr_url}</code>
          </p>
        </div>
        
        <div className="instructions">
          💡 {qrResult.instructions}
        </div>
        
        <div className="button-group">
          <button
            onClick={onPrint}
            className="action-button print-button"
          >
            🖨️ Imprimer
          </button>
          <button
            onClick={onDownload}
            className="action-button download-button"
          >
            📥 Télécharger
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(qrResult.qr_url);
              alert('✅ URL copiée dans le presse-papier !');
            }}
            className="action-button copy-button"
          >
            📋 Copier l'URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRResult;