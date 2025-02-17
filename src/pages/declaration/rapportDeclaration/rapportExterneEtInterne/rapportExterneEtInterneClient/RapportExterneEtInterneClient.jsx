import React, { useEffect, useState } from 'react';
import { Button, notification, Table, Tooltip, Skeleton } from 'antd';
import {
  FileExcelOutlined} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import RapportFiltrage from '../../rapportFiltrage/RapportFiltrage';
import { getRapportExterneEtInterneClient } from '../../../../../services/templateService';

const RapportExterneEtInterneClient = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [detail, setDetail] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [showManutention, setShowManutention] = useState(false);
  const scroll = { x: 400 };

  const fetchData = async () => {
    try {
      const { data } = await getRapportExterneEtInterneClient(filteredDatas);
  
      setDetail(data.resume);
  
      const groupedData = data.data.reduce((acc, item) => {
        if (!acc[item.nom]) acc[item.nom] = {};
        acc[item.nom][item.nom_status_batiment] = {
          Entreposage: item.total_entreposage || 0,
          Manutention: item.total_manutation || 0,
          Total: item.total_facture || 0,
        };
        return acc;
      }, {});
  
      const formattedData = Object.entries(groupedData).map(([name, types], index) => {
        const row = { id: index + 1, Nom: name };
  
        // Calcul des totaux par type et ajout des colonnes
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
          title: 'Nom',
          dataIndex: 'Nom',
          key: 'Nom',
          fixed: 'left',
          render: (text) => <div>{text}</div>,
        },
        ...Array.from(new Set(data?.data.map((item) => item.nom_status_batiment))).map((type) => ({
          title: type,
          children: [
            {
              title: 'Entreposage',
              dataIndex: `${type}_Entreposage`,
              key: `${type}_Entreposage`,
              render: (value) => (
                <div style={{ color: value ? 'black' : 'red' }}>
                  {value ? `${value.toLocaleString()} $` : 0}
                </div>
              ),
              align: 'right',
              title: <div style={{ textAlign: 'center' }}>Entreposage</div>,
            },
            ...(showManutention
              ? [
                  {
                    title: 'Manutention',
                    dataIndex: `${type}_Manutention`,
                    key: `${type}_Manutention`,
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
            {
              title: 'Total',
              dataIndex: `${type}_Total`,
              key: `${type}_Total`,
              render: (value) => (
                <div style={{ color: value ? 'black' : 'red' }}>
                  {value ? `${value.toLocaleString()} $` : 0}
                </div>
              ),
              align: 'right',
              title: <div style={{ textAlign: 'center' }}>Total</div>,
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
  }, [filteredDatas, showManutention]);

  const exportToExcelHTML = async () => {
    try {
      const { data } = await getRapportExterneEtInterneClient(filteredDatas);
  
      const groupedData = data.data.reduce((acc, item) => {
        if (!acc[item.nom]) acc[item.nom] = {};
        acc[item.nom][item.nom_status_batiment] = {
          Entreposage: item.total_entreposage || 0,
          Manutention: item.total_manutation || 0,
          Total: item.total_facture || 0,
        };
        return acc;
      }, {});


      const formattedData = Object.entries(groupedData).map(([name, types]) => {
        const row = { Nom: name };
        // Calcul des totaux par type et ajout des colonnes
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
      
  
      const columns = [
        { title: "Nom", key: "Nom" },
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
      XLSX.utils.book_append_sheet(wb, ws, "Rapport Externe et Interne client");
  
      XLSX.writeFile(wb, "Rapport_Externe_Interne_client.xlsx");
  
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
                    gridTemplateColumns: 'repeat(3, 1fr)',
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

          <Tooltip title={'Importer en excel'}>
            <Button className="export-excel" onClick={exportToExcelHTML} >
              <FileExcelOutlined className="excel-icon" />
            </Button>
          </Tooltip>

          <Button onClick={() => setShowManutention(!showManutention)} style={{ margin: '10px' }}>
            {showManutention ? 'Masquer Manutention' : 'Afficher Manutention'}
          </Button>
          
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

export default RapportExterneEtInterneClient;
