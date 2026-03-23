import React from 'react';
import QRForm from './QRForm';
import QRResult from './QRResult';
import { getPrintHTML } from './QRPrintStyles';
import { globalStyles } from './styles';
import { useQRGeneration } from '../hooks/useQRGeneration';

const CodeQRForm = ({closeModal, fetchData, idSite}) => {
  const hookValues = useQRGeneration();
  
  if (!hookValues) {
    return <div>Chargement du module...</div>;
  }

  const {
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
    getSelectedSiteName
  } = hookValues;


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generateQR();
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  const handlePrintQR = () => {
    if (!qrResult || !qrResult.site) {
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(getPrintHTML(qrResult, formData, getSelectedSiteName));
    printWindow.document.close();
  };

  const handleDownloadQR = () => {
    if (!qrResult) return;
    
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `qr_code_${qrResult.qr_code || 'pointage'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    img.onerror = () => {
      console.error('Error downloading QR code');
    };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrResult.qr_url)}`;
  };

  const handleRegenerate = () => {
    resetForm();
  };

  return (
    <div className="code-qr-form-container">
      <style>{globalStyles}</style>
      {(!qrResult || !qrResult.site) && (
        <QRForm
          formData={formData}
          sites={sites}
          zones={zones}
          loading={loading}
          loadingSites={loadingSites}
          loadingZones={loadingZones}
          error={error}
          handleInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      )}
      
      {/* Afficher le QR généré et masquer le formulaire */}
      {qrResult && qrResult.site && (
        <QRResult
          qrResult={qrResult}
          formData={formData}
          onPrint={handlePrintQR}
          onDownload={handleDownloadQR}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};

export default CodeQRForm;