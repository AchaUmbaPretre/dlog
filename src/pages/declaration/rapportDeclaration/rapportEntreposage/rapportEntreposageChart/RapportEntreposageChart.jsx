import React from 'react';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';

/**
 * Composant RapportEntreposageChart
 * Affiche un graphique de type ligne pour le rapport d'entreposage.
 * 
 * @param {Array} groupedData - Données groupées par client.
 * @param {Array} uniqueMonths - Mois uniques pour l'axe X.
 * @returns {JSX.Element} - Le composant du graphique.
 */
const RapportEntreposageChart = ({ groupedData, uniqueMonths }) => {
  
  /**
   * Génère les données formatées pour le graphique Nivo.
   * Chaque client a une série de données correspondant à chaque mois unique.
   * 
   * @returns {Array} - Données formatées pour le graphique.
   */
  const generateNivoData = () => {
    return groupedData.map(client => {
      const data = uniqueMonths.map(month => {
        // Formatage du mois en "MMM-YYYY" (ex. Jan-2025)
        const monthFormatted = moment(month, "M-YYYY").format("MMM-YYYY");
        
        // Récupération du montant pour ce mois (0 si non défini)
        const value = client[monthFormatted] || 0;

        return {
          x: moment(monthFormatted, "MMM-YYYY").format("MMM YYYY"),  // Format "MMM YYYY" pour l'axe X
          y: value  // Montant (ou 0 si inexistant)
        };
      });

      return {
        id: client.Client,  // Nom du client pour la série
        data: data  // Données pour ce client
      };
    });
  };

  // Préparation des données à afficher dans le graphique
  const nivoData = generateNivoData();

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      {/* Titre du graphique */}
      <h2 
        style={{ 
          fontSize: '1.25rem', 
          fontWeight: '300', 
          marginBottom: '15px', 
          borderBottom: '2px solid #e8e8e8', 
          paddingBottom: '10px' 
        }}
      >
        Rapport Entreposage - Evolution des Montants par Client
      </h2>

      {/* Graphique Responsive */}
      <div style={{ height: 400 }}>
        <ResponsiveLine
          data={nivoData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Mois',
            legendOffset: 36
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Montant',
            legendOffset: -40
          }}
          pointSize={10}
          pointColor={{ from: 'serieColor' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableSlices="x"
          useMesh={true}
        />
      </div>
    </div>
  );
};

export default RapportEntreposageChart;
