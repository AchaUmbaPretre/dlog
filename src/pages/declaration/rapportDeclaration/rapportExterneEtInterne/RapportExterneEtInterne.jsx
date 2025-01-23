import React, { useEffect, useState } from 'react';
import { notification, Table, Tag } from 'antd';
import moment from 'moment';
import { getRapportExterneEtInterne } from '../../../../services/templateService';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';


const RapportExterneEtInterne = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState(null);
  const scroll = { x: 400 };

  const fetchData = async () => {
    try {
      const { data } = await getRapportExterneEtInterne(filteredDatas);

      // Group data by month and type
      const groupedData = data.reduce((acc, item) => {
        const month = moment(item.periode).format('MMM-YY');
        if (!acc[month]) acc[month] = {};
        acc[month][item.nom_status_batiment] = {
          Entreposage: item.total_entreposage || 0,
          Manutention: item.total_manutation || 0,
          Total: item.total_facture || 0,
        };
        return acc;
      }, {});

      // Format grouped data into table rows
      const formattedData = Object.entries(groupedData).map(([month, types]) => {
        const row = { Mois: month };
        Object.entries(types).forEach(([type, values]) => {
          row[`${type}_Entreposage`] = values.Entreposage;
          row[`${type}_Manutention`] = values.Manutention;
          row[`${type}_Total`] = values.Total;
        });
        return row;
      });

      // Generate dynamic columns
      const dynamicColumns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          render: (text, record, index) =>
            (pagination.current - 1) * pagination.pageSize + index + 1,
          width: 50,
          align: 'center',
        },
        {
          title: 'Mois',
          dataIndex: 'Mois',
          key: 'Mois',
          fixed: 'left',
          render: (text) => <Tag color="blue">{text}</Tag>,
        },
        ...Array.from(new Set(data.map((item) => item.nom_status_batiment))).map((type) => ({
          title: type,
          children: [
            {
              title: 'Entreposage',
              dataIndex: `${type}_Entreposage`,
              key: `${type}_Entreposage`,
              render: (value) => (
                <div style={{color: value ? 'black' : 'red'}}>
                  {value ? `${value.toLocaleString()} $` : 0}
                </div>
              ),
              align: 'right',
              title: <div style={{ textAlign: 'center' }}>Entreposage</div>
            },
            {
              title: 'Manutention',
              dataIndex: `${type}_Manutention`,
              key: `${type}_Manutention`,
              render: (value) => (
                <div style={{color: value ? 'black' : 'red'}}>
                  {value ? `${value.toLocaleString()} $` : 0}
                </div>
              ),
              align: 'right',
              title: <div style={{ textAlign: 'center' }}>Manutention</div>
            },
            {
              title: 'Total',
              dataIndex: `${type}_Total`,
              key: `${type}_Total`,
              render: (value) => (
                <div style={{color: value ? 'black' : 'red'}}>
                  {value ? `${value.toLocaleString()} $` : 0}
                </div>
              ),
              align: 'right',
              title: <div style={{ textAlign: 'center' }}>Total</div>
            },
          ],
        })),
      ];

      setColumns(dynamicColumns);
      setDataSource(formattedData);
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
    <div>
      <div className="rapport_header">
{/*         <Button onClick={() => setFilterVisible(!filterVisible)}>
          {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
        </Button> */}
        {filterVisible && <RapportFiltrage onFilter={(filters) => setFilteredDatas(filters)} />}
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        bordered
        size="small"
        pagination={{
          ...pagination,
          onChange: (current, pageSize) => setPagination({ current, pageSize }),
        }}
        scroll={scroll}
        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
      />
    </div>
  );
};

export default RapportExterneEtInterne;
