import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { getRapportVariation } from '../../../../../services/templateService';

const RapportVariationPie = ({ filteredDatas }) => {
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
    return [
      { id: 'Entrep & Manu', value: data.reduce((acc, item) => acc + (item.total_entreManu || 0), 0) },
      { id: 'M² occupé', value: data.reduce((acc, item) => acc + (item.total_occupe || 0), 0) },
      { id: 'M² facturé', value: data.reduce((acc, item) => acc + (item.total_facture || 0), 0) },
    ];
  };

  return (
    <div style={{ height: 400 }}>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        
        <div>
            <h2 style={{
                textAlign: 'center', 
                marginBottom: '30px', 
                fontSize: '1.3rem', 
                color: '#333', 
                fontWeight: '600'
            }}>
                📊 Rapport des variations (PIE)
            </h2>
            <ResponsivePie
                data={chartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'category10' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableRadialLabels={true}
                enableSliceLabels={true}
                sliceLabel={({ value }) => value.toLocaleString()}
                legends={[{
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateY: 50,
                    itemsSpacing: 5,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    symbolSize: 18,
                    symbolShape: 'circle',
                }]}
            />
        </div>
      )}
    </div>
  );
};

export default RapportVariationPie;