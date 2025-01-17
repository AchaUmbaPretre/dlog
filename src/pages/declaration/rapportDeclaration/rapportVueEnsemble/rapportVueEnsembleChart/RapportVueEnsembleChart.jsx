import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';

const RapportVueEnsembleChart = ({ groupedData, uniqueMonths }) => {

    console.log(groupedData, uniqueMonths)

  // Générer les données de Nivo à partir des données regroupées
  const generateNivoData = () => {
    // Créer les séries de données pour chaque type (Entreposage, Manutention, Total)
    const series = ['Entreposage', 'Manutention', 'Total'].map((category) => {
      return {
        id: category,
        data: uniqueMonths.map((month) => {
          // Formater le mois en "MMM-YY"
          const formattedMonth = moment(month, "M-YYYY").format("MMM-YY");
          
          // Trouver la valeur pour ce mois et cette catégorie
          const value = groupedData.reduce((sum, row) => {
            return sum + (row[`${row.Mois}_${category}`] || 0);
          }, 0);
          
          return {
            x: formattedMonth, // Mois en format "MMM-YY"
            y: value // Valeur de la catégorie (Entreposage, Manutention, ou Total)
          };
        })
      };
    });

    return series;
  };

  // Appeler la fonction pour obtenir les données du graphique
  const nivoData = generateNivoData();

  return (
    <div style={{ height: 400 }}>
      <h2>Vue d'ensemble - Rapport Entreposage</h2>
      <ResponsiveLine
        data={nivoData} // Données à afficher
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
  );
};

export default RapportVueEnsembleChart;
