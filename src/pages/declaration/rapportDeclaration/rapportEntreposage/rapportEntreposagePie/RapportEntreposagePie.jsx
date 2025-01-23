import React from 'react';
import moment from 'moment';
import { ResponsivePie } from '@nivo/pie';

/**
 * Composant RapportEntreposagePie
 * Affiche un graphique de type camembert (pie chart) pour le rapport d'entreposage.
 * 
 * @param {Array} groupedData - Données groupées par client.
 * @param {Array} uniqueMonths - Mois uniques pour l'axe X.
 * @returns {JSX.Element} - Le composant du graphique.
 */
const RapportEntreposagePie = ({ groupedData, uniqueMonths }) => {

  /**
   * Génère les données formatées pour le graphique Nivo.
   * Chaque entrée correspond au total par client sur tous les mois uniques.
   * 
   * @returns {Array} - Données formatées pour le graphique.
   */
  const generatePieData = () => {
    return groupedData.map(client => {
      // Calcul du total des montants pour le client
      const total = uniqueMonths.reduce((sum, month) => {
        const monthFormatted = moment(month, "M-YYYY").format("MMM-YYYY");
        return sum + (client[monthFormatted] || 0);
      }, 0);

      return {
        id: client.Client, // Nom du client
        label: client.Client, // Étiquette pour l'affichage
        value: total // Valeur totale pour le client
      };
    });
  };

  // Préparation des données à afficher dans le graphique
  const pieData = generatePieData();

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
        Rapport Entreposage (Pie Chart)
      </h2>

      {/* Graphique Responsive */}
      <div style={{ height: 400 }}>
        <ResponsivePie
          data={pieData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        />
      </div>
    </div>
  );
};

export default RapportEntreposagePie;
