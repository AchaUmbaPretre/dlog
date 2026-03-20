export const globalStyles = `
  .code-qr-form-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #f0f2f5;
    min-height: 100vh;
  }
  
  /* Cartes */
  .form-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
    padding: 32px;
    margin-bottom: 24px;
    transition: all 0.3s;
  }
  
  .form-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.88);
  }
  
  .form-subtitle {
    color: rgba(0, 0, 0, 0.45);
    margin-bottom: 32px;
    font-size: 14px;
  }
  
  /* Formulaires */
  .form-group {
    margin-bottom: 24px;
  }
  
  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
  }
  
  .form-label .required {
    color: #ff4d4f;
    margin-left: 4px;
  }
  
  .form-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s;
    background: white;
    cursor: pointer;
    line-height: 1.5714285714285714;
  }
  
  .form-select:hover:not(:disabled) {
    border-color: #4096ff;
  }
  
  .form-select:focus {
    outline: none;
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
  
  .form-select:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
  }
  
  /* Messages d'erreur */
  .error-message {
    background-color: #fff2f0;
    color: #ff4d4f;
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 24px;
    border-left: 3px solid #ff4d4f;
    font-size: 14px;
  }
  
  /* Bouton principal */
  .submit-button {
    width: 100%;
    padding: 8px 15px;
    background: #1677ff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    line-height: 1.5714285714285714;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  }
  
  .submit-button:hover:not(:disabled) {
    background: #4096ff;
  }
  
  .submit-button:active:not(:disabled) {
    background: #0958d9;
  }
  
  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #1677ff;
  }
  
  /* Résultat QR */
  .qr-result {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
    padding: 32px;
    animation: fadeIn 0.5s ease;
  }
  
  .qr-result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .qr-result-title {
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .regenerate-button {
    padding: 5px 16px;
    background: white;
    color: #1677ff;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .regenerate-button:hover {
    color: #4096ff;
    border-color: #4096ff;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Affichage QR */
  .qr-display {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .qr-image {
    background: white;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
    border: 1px solid #f0f0f0;
  }
  
  .qr-image img {
    display: block;
  }
  
  /* Informations QR */
  .qr-info {
    width: 100%;
    background: #fafafa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #f0f0f0;
  }
  
  .qr-info p {
    margin: 12px 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.88);
  }
  
  .qr-info strong {
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    min-width: 120px;
    display: inline-block;
  }
  
  .qr-code-text {
    font-family: 'Courier New', monospace;
    background: #f5f5f5;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    word-break: break-all;
    color: rgba(0, 0, 0, 0.88);
  }
  
  /* Instructions */
  .instructions {
    background: #e6f4ff;
    padding: 12px 16px;
    border-radius: 6px;
    border-left: 3px solid #1677ff;
    margin-bottom: 24px;
    font-size: 14px;
    color: #1677ff;
  }
  
  /* Groupe de boutons */
  .button-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .action-button {
    padding: 5px 16px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    background: white;
  }
  
  .print-button {
    color: #1677ff;
    border-color: #1677ff;
  }
  
  .print-button:hover {
    color: #4096ff;
    border-color: #4096ff;
    background: #f5f5f5;
  }
  
  .download-button {
    color: #1677ff;
    border-color: #1677ff;
  }
  
  .download-button:hover {
    color: #4096ff;
    border-color: #4096ff;
    background: #f5f5f5;
  }
  
  .copy-button {
    color: #1677ff;
    border-color: #1677ff;
  }
  
  .copy-button:hover {
    color: #4096ff;
    border-color: #4096ff;
    background: #f5f5f5;
  }
  
  /* Spinner de chargement */
  .loading-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.6s linear infinite;
    margin-right: 8px;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .code-qr-form-container {
      padding: 16px;
    }
    
    .form-card,
    .qr-result {
      padding: 20px;
    }
    
    .form-title {
      font-size: 20px;
    }
    
    .qr-result-title {
      font-size: 18px;
    }
    
    .button-group {
      gap: 8px;
    }
    
    .action-button {
      padding: 4px 12px;
      font-size: 12px;
    }
  }
`;