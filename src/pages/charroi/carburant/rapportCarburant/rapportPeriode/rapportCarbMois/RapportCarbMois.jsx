import React, { useState, useEffect } from 'react';
import { Table, Skeleton, Tag, Button, Typography, notification } from 'antd';
import { getRapportCarbMonth } from '../../../../../../services/carburantService';
import moment from 'moment';
import { formatNumber } from '../../../../../../utils/formatNumber';
import RapportPeriodeFiltrage from '../rapportPeriodeFiltrage/RapportPeriodeFiltrage';

const { Text } = Typography;

const RapportCarbMois = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await getRapportCarbMonth(filteredDatas);

      const groupedData = data.map((item, index) => ({
        id: index + 1,
        Mois: `${moment().month(item.mois - 1).format('MMM')} - ${item.annee}`,
        total_consom: item.consommation_totale,
      }));

      const dynamicColumns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          width: 50,
          align: 'center',
        },
        {
          title: 'Mois',
          dataIndex: 'Mois',
          key: 'Mois',
          fixed: 'left',
          render: (text) => <Tag color={'#2db7f5'}>{text}</Tag>,
        },
        {
          title: 'Consommation Totale',
          dataIndex: 'total_consom',
          key: 'total_consom',
          align: 'right',
          render: (text) => <Text strong>{formatNumber(text)} L</Text>
        },
      ];

      setColumns(dynamicColumns);
      setDataSource(groupedData);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filteredDatas]);

  return (
    <>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <div className="rapport-facture">
            <Button
                type={filterVisible ? 'primary' : 'default'}
                onClick={() => setFilterVisible(!filterVisible)}
                style={{ margin: '10px 10px 10px 0' }}
            >
                {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
            </Button>
            {filterVisible  && <RapportPeriodeFiltrage onFilter={setFilteredDatas}/>}
            <div>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    loading={loading}
                    bordered
                    size="small"
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
        </div>
      )}
    </>
  );
};

export default RapportCarbMois;