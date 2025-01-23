import React from 'react';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';

/**
 * Composant RapportEntreposageChart
 * Affiche un graphique de type ligne pour le rapport d'entreposage.
 * 
 * @param {Array} groupedData
 * @param {Array} uniqueMonths - Mois uniques pour l'axe X.
 * @returns {JSX.Element} - Le composant du graphique.
 */
const RapportManuChart = ({ groupedData, uniqueMonths }) => {
  
  /**
   * @returns {Array}.
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
        id: client.Client,
        data: data 
      };
    });
  };

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
        RAPPORT MANUTENTION
      </h2>

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

export default RapportManuChart;
