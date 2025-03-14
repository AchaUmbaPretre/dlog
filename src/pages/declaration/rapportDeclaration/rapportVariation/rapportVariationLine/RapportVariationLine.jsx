import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import { getRapportVariation } from '../../../../../services/templateService';

const RapportVariationLine = ({ filteredDatas }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filteredDatas]);

  const fetchData = async () => {
    try {
      const { data } = await getRapportVariation(filteredDatas);
      const formattedData = transformData(data?.data || []);
      setChartData(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const transformData = (data) => {
    const categories = [
      { id: 'Entrep & Manu', key: 'total_entreManu' },
      { id: 'M² occupé', key: 'total_occupe' },
      { id: 'M² facturé', key: 'total_facture' },
    ];

    return categories.map(category => ({
      id: category.id,
      data: data.map(item => ({
        x: moment(`${item.Année}-${item.Mois}-01`, 'YYYY-MM-DD').format('MMM YYYY'),
        y: item[category.key] || 0,
      }))
    }));
  };

  return (
    <div style={{ height: 400 }}>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
          axisLeft={{ legend: 'Valeur', legendOffset: -40, legendPosition: 'middle' }}
          axisBottom={{ legend: 'Période', legendOffset: 40, legendPosition: 'middle' }}
          colors={{ scheme: 'category10' }}
          pointSize={10}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableSlices='x'
          useMesh={true}
          legends={[{
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
          }]}
        />
      )}
    </div>
  );
};

export default RapportVariationLine;
