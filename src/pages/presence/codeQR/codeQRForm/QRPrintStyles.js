export const getPrintHTML = (qrResult, formData, getSelectedSiteName) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Code - ${qrResult.site.nom_site || 'Pointage'}</title>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            text-align: center;
            padding: 40px 20px;
            background: #f5f5f5;
          }
          .print-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
          }
          .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
          }
          .header p {
            opacity: 0.9;
            font-size: 14px;
          }
          .qr-content {
            padding: 40px;
          }
          .qr-code {
            background: white;
            padding: 20px;
            margin-bottom: 30px;
            display: inline-block;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .qr-code img {
            max-width: 250px;
            height: auto;
          }
          .info {
            text-align: left;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
          }
          .info-item {
            margin-bottom: 12px;
            font-size: 14px;
          }
          .info-item strong {
            color: #495057;
            min-width: 120px;
            display: inline-block;
          }
          .code-value {
            font-family: 'Courier New', monospace;
            background: #e9ecef;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            word-break: break-all;
          }
          .instructions {
            background: #e7f3ff;
            padding: 16px;
            border-radius: 12px;
            border-left: 4px solid #2196F3;
            font-size: 14px;
            color: #0b5e7e;
            margin-top: 20px;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .print-container {
              box-shadow: none;
              margin: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <h1>QR Code de Pointage</h1>
            <p>Scannez pour pointer votre présence</p>
          </div>
          <div class="qr-content">
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrResult.qr_url)}" alt="QR Code" />
            </div>
            <div class="info">
              <div class="info-item">
                <strong>Code QR:</strong>
                <span class="code-value">${qrResult.qr_code}</span>
              </div>
              <div class="info-item">
                <strong>Site:</strong>
                <span>${qrResult.site?.nom_site || getSelectedSiteName() || 'N/A'}</span>
              </div>
              ${qrResult.zone ? `<div class="info-item">
                <strong>Zone:</strong>
                <span>Zone ${qrResult.zone.id}</span>
              </div>` : ''}
              <div class="info-item">
                <strong>Type de pointage:</strong>
                <span>${formData.type_pointage === 'ENTREE_SORTIE' ? 'Entrée et Sortie' : formData.type_pointage === 'ENTREE' ? 'Entrée uniquement' : 'Sortie uniquement'}</span>
              </div>
              <div class="info-item">
                <strong>Date de création:</strong>
                <span>${new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            <div class="instructions">
              💡 ${qrResult.instructions || 'Scannez ce QR code pour pointer sur le site'}
            </div>
          </div>
          <div class="footer no-print">
            <button onclick="window.print()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
              🖨️ Imprimer ce QR Code
            </button>
          </div>
        </div>
      </body>
    </html>
  `;
};