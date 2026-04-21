import React from 'react';

export const LoadingState = () => (
  <div className="loading-state">
    <div className="loading-spinner" />
    <p>Chargement des données des véhicules...</p>
    <style jsx>{`
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export const EmptyState = ({ onDebug }) => (
  <div className="empty-state">
    <div className="empty-icon">📍</div>
    <h3>Aucune donnée de véhicule disponible</h3>
    <p>Vérifiez la console pour plus de détails</p>
    <button onClick={onDebug}>
      Debug: Voir structure dans console
    </button>
    <style jsx>{`
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
        background: #f9fafb;
      }
      
      .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }
      
      h3 {
        margin: 0 0 10px 0;
        color: #374151;
      }
      
      p {
        color: #6b7280;
        margin-bottom: 20px;
      }
      
      button {
        padding: 8px 16px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
    `}</style>
  </div>
);
