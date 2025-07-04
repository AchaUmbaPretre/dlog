import { useEffect, useState } from 'react';
import { Button, notification, Table, Tag, Tooltip, Skeleton } from 'antd';
import moment from 'moment';
import {
  FileExcelOutlined} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { getRapportExterneEtInterne } from '../../../../services/templateService';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const RapportExterneEtInterne = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [detail, setDetail] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [showManutention, setShowManutention] = useState(false);
  const scroll = { x: 400 };
  const [showTotal, setShowTotal] = useState(false);

  const fetchData = async () => {
    try {
      const { data } = await getRapportExterneEtInterne(filteredDatas);

      setDetail(data.resume)

      const groupedData = data.data.reduce((acc, item) => {
        const month = moment(item.periode).format('MMM-YY');
        if (!acc[month]) acc[month] = {};
        acc[month][item.nom_status_batiment] = {
          Entreposage: item.total_entreposage || 0,
          Manutention: item.total_manutation || 0,
          Total: item.total_facture || 0,
        };
        return acc;
      }, {});

      const formattedData = Object.entries(groupedData).map(([month, types], index) => {
        const row = { id: index + 1, Mois: month };
        Object.entries(types).forEach(([type, values]) => {
          const total = showManutention
            ? values.Entreposage + values.Manutention
            : values.Entreposage; 
          row[`${type}_Entreposage`] = values.Entreposage;
          row[`${type}_Manutention`] = values.Manutention;
          row[`${type}_Total`] = total;
        });
        return row;
      });
      

      const dynamicColumns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          render: (text, record) => record.id,
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
        ...Array.from(new Set(data?.data.map((item) => item.nom_status_batiment))).map((type) => ({
          title: type,
          children: [
            {
              title: 'Entreposage',
              dataIndex: `${type}_Entreposage`,
              key: `${type}_Entreposage`,
              sorter: (a, b) => (a[`${type}_Entreposage`] || 0) - (b[`${type}_Entreposage`] || 0),
              render: (value) => (
                <div style={{color: value ? 'black' : 'red'}}>
                  {value ? `${value.toLocaleString()} $` : 0}
                </div>
              ),
              align: 'right',
              title: <div style={{ textAlign: 'center' }}>Entreposage</div>
            },
            ...(showManutention
              ? [
                  {
                    title: 'Manutention',
                    dataIndex: `${type}_Manutention`,
                    key: `${type}_Manutention`,
                    sorter: (a, b) => (a[`${type}_Manutention`] || 0) - (b[`${type}_Manutention`] || 0),
                    render: (value) => (
                      <div style={{ color: value ? 'black' : 'red' }}>
                        {value ? `${value.toLocaleString()} $` : 0}
                      </div>
                    ),
                    align: 'right',
                    title: <div style={{ textAlign: 'center' }}>Manutention</div>,
                  },
                ]
              : []),
              ...(showTotal
                ? [
                    {
                      title: 'Total',
                      dataIndex: `${type}_Total`,
                      key: `${type}_Total`,
                      sorter: (a, b) => (a[`${type}_Total`] || 0) - (b[`${type}_Total`] || 0),
                      render: (value) => (
                        <div style={{ color: value ? 'black' : 'red' }}>
                          {value ? `${value.toLocaleString()} $` : 0}
                        </div>
                      ),
                      align: 'right',
                      title: <div style={{ textAlign: 'center' }}>Total</div>,
                    },
                  ]
                : [])
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
  }, [filteredDatas, showManutention, showTotal]);

  const exportToExcelHTML = async () => {
    try {
      const { data } = await getRapportExterneEtInterne(filteredDatas);
  
      const groupedData = data.data.reduce((acc, item) => {
        const month = moment(item.periode).format('MMM-YY');
        if (!acc[month]) acc[month] = {};
        acc[month][item.nom_status_batiment] = {
          Entreposage: item.total_entreposage || 0,
          Manutention: item.total_manutation || 0,
          Total: item.total_facture || 0,
        };
        return acc;
      }, {});
  
      /* const formattedData = Object.entries(groupedData).map(([month, types]) => {
        const row = { Mois: month };
        Object.entries(types).forEach(([type, values]) => {
          row[`${type}_Entreposage`] = values.Entreposage;
          row[`${type}_Manutention`] = values.Manutention;
          row[`${type}_Total`] = values.Total;
        });
        return row;
      }); */

      const formattedData = Object.entries(groupedData).map(([month, types]) => {
        const row = { Mois: month };
        Object.entries(types).forEach(([type, values]) => {
          const total = showManutention
            ? values.Entreposage + values.Manutention // Inclure Manutention si elle est visible
            : values.Entreposage; // Sinon, uniquement l'Entreposage
          row[`${type}_Entreposage`] = values.Entreposage;
          row[`${type}_Manutention`] = values.Manutention;
          row[`${type}_Total`] = total; // Utiliser le total calculé ici
        });
        return row;
      });
      
  
      const columns = [
        { title: "Mois", key: "Mois" },
        ...Array.from(new Set(data.map(item => item.nom_status_batiment)))
          .map(type => ([
            { title: `${type} - Entrep`, key: `${type}_Entreposage` },
            { title: `${type} - Manut`, key: `${type}_Manutention` },
            { title: `${type} - Total`, key: `${type}_Total` }
          ])).flat(),
      ];
  
      const ws = XLSX.utils.json_to_sheet(formattedData, {
        header: columns.map(col => col.key),
      });
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Rapport Externe et Interne");
  
      XLSX.writeFile(wb, "Rapport_Externe_Interne.xlsx");
  
    } catch (error) {
      notification.error({
        message: 'Erreur d\'exportation',
        description: 'Une erreur est survenue lors de l\'exportation des données.',
      });
    }
  };  

  return (
    <div>
            {
            loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
                <div
                style={{
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    width: 'fit-content',
                    margin: '20px 0',
                    padding: '15px',
                }}
                >
                    <span
                        style={{
                        display: 'block',
                        padding: '10px 15px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        borderBottom: '1px solid #f0f0f0',
                        }}
                    >
                        Résumé :
                    </span>
                <div
                    style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '15px',
                    padding: '15px',
                    }}
                >
                    <span
                        style={{
                        fontSize: '0.9rem',
                        fontWeight: '400',
                        cursor: 'pointer',
                        color: '#1890ff',
                        }}
                    >
                        Nbre de client : <strong>{detail?.Nbre_de_clients}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Nbre de ville : <strong>{detail.Nbre_de_villes}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Entreposage :{' '}
                    <strong>{Math.round(parseFloat(detail.Total_entrep))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Manutention :{' '}
                    <strong>{Math.round(parseFloat(detail.Total_manut))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Entrep Extérieur :{' '}
                    <strong>{detail.Total_Extérieur_entre?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Entrep Intérieur :{' '}
                    <strong>{detail.Total_Intérieur_entre.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Manu Extérieur :{' '}
                    <strong>{detail.Total_Extérieur_manu?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Manu Intérieur :{' '}
                    <strong>{detail.Total_Intérieur_manu ?.toLocaleString()} $</strong>
                    </span>
                </div>
                </div>
            )
        }
      <div className="rapport_facture">
        <div className="rapport_row_excel">
          <Button
            onClick={() => setFilterVisible(!filterVisible)}
            type={filterVisible ? 'primary' : 'default'}
            style={{ margin: '10px 0' }}
          >
            {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
          </Button>

          <Button onClick={() => setShowManutention(!showManutention)} style={{ margin: '8px' }}>
            {showManutention ? 'Masquer Manutention' : 'Afficher Manutention'}
          </Button>

          <Button onClick={() => setShowTotal((prev) => !prev)}>
            {showTotal ? 'Masquer Total' : 'Afficher Total'}
          </Button>

          <Tooltip title={'Importer en excel'}>
            <Button className="export-excel" onClick={exportToExcelHTML} >
              <FileExcelOutlined className="excel-icon" />
            </Button>
          </Tooltip>
        </div>
        {filterVisible && <RapportFiltrage onFilter={(filters) => setFilteredDatas(filters)} filtraVille={true} filtraClient={true} filtraStatus={true} />}
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
