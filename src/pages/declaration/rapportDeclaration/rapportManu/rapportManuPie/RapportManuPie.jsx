import React from 'react';
import moment from 'moment';
import { ResponsivePie } from '@nivo/pie';

/**
 * Composant RapportManuChart
 * Affiche un graphique de type camembert pour le rapport de manutention.
 *
 * @param {Array} groupedData
 * @param {Array} uniqueMonths - Mois uniques pour l'axe X.
 * @returns {JSX.Element} - Le composant du graphique.
 */
const RapportManuPie = ({ groupedData, uniqueMonths }) => {
  /**
   * Transforme les données pour correspondre au format attendu par Nivo Pie.
   * @returns {Array} - Données formatées pour le graphique camembert.
   */
  const formatDataForPie = () => {
    return uniqueMonths.map((month) => {
      const monthFormatted = moment(month, "M-YYYY").format("MMM-YYYY");

      const totalValue = groupedData.reduce((sum, client) => {
        return sum + (client[monthFormatted] || 0);
      }, 0);

      return {
        id: monthFormatted,
        label: monthFormatted,
        value: totalValue,
      };
    });
  };

  const nivoData = formatDataForPie();

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      {/* Titre du graphique */}
      <h2
        style={{
          fontSize: '1rem',
          fontWeight: '300',
          marginBottom: '15px',
          borderBottom: '2px solid #e8e8e8',
          paddingBottom: '10px',
        }}
      >
        RAPPORT MANUTENTION
      </h2>

      <div style={{ height: 400 }}>
        <ResponsivePie
          data={nivoData}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextColor="#333333"
          radialLabelsLinkColor={{ from: 'color' }}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#333333"
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RapportManuPie;
