import React, { useEffect, useState } from 'react';
import { Button,notification, Skeleton, Space, Table, Tag, Tooltip } from 'antd';
import moment from 'moment';
import {
    FileExcelOutlined,
    FilePdfOutlined
} from '@ant-design/icons';
import jsPDF from "jspdf";
import { getRapportSuperficie } from '../../../../services/templateService';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const RapportSuperficie = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [visibleCities, setVisibleCities] = useState([]);
  const [activeKeys, setActiveKeys] = useState(['1', '2']);
  const [detail, setDetail] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await getRapportSuperficie(filteredDatas);
  
      setDetail(data.resume)
      // Regrouper les données par mois et par bâtiment
      const groupedData = data.data.reduce((acc, item) => {
        const mois = moment(item.periode).format('MMM-YY');
      
        if (!acc[mois]) acc[mois] = {};
      
        if (!acc[mois][item.nom_batiment]) {
          acc[mois][item.nom_batiment] = {
            total_facture: 0,
            total_occupe: 0,
            superficie: 0,
          };
        }
      
        acc[mois][item.nom_batiment].total_facture += item.total_facture || 0;
        acc[mois][item.nom_batiment].total_occupe += item.total_occupe || 0;
        acc[mois][item.nom_batiment].superficie += item.superficie || 0; // 🔹 Ajout du cumul de superficie
      
        return acc;
      }, {});
      
  
      const formattedData = Object.entries(groupedData).map(([mois, batiments]) => {
        const row = { Mois: mois };
        for (const [batiment, valeurs] of Object.entries(batiments)) {
          row[`${batiment}_Facture`] = valeurs.total_facture;
          row[`${batiment}_Occupe`] = valeurs.total_occupe;
          row[`${batiment}_Superficie`] = valeurs.superficie;
        }
        return row;
      });
           
      
      // Extraire tous les bâtiments pour les colonnes dynamiques
      const extractedBatiments = [...new Set(data.data.map(item => item.nom_batiment))];
  
      const dynamicColumns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          width: '2%',
          render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
          },
          align: 'right',
        },
        {
          title: 'Mois',
          dataIndex: 'Mois',
          key: 'Mois',
          fixed: 'left',
          width: '2%',
          render: text => (
            <Space>
              <Tag color={'#2db7f5'}>{text}</Tag>
            </Space>
          ),
          align: 'left',
        },
        ...extractedBatiments.map(batiment => ({
          title: batiment,
          key: batiment,
          children: [
            {
              title: 'M2',
              key: `${batiment}_M2`,
              children: [
                {
                  title: 'Facturé',
                  dataIndex: `${batiment}_Facture`,
                  key: `${batiment}_Facture`,
                  width: '5%',
                  render: text => (
                    <Space>
                      {text
                        ? Math.round(parseFloat(text))?.toLocaleString() : 0}
                    </Space>
                  ),
                  align: 'right',
                },
                {
                  title: 'Occupé',
                  dataIndex: `${batiment}_Occupe`,
                  key: `${batiment}_Occupe`,
                  width: '5%',
                  render: text => (
                    <Space>
                      {text ?
                        Math.round(parseFloat(text))?.toLocaleString() : 0}
                    </Space>
                  ),
                  align: 'right',
                },
                {
                    title: 'M² Diff',
                    dataIndex: `${batiment}_Superficie`,
                    key: `${batiment}_Superficie`,
                    width: '5%',
                    render: text => (
                      <Space>
                        {text !== 0 ? (
                        <div style={{color: 'red'}}>{text ? 
                            Math.round(parseFloat(text))?.toLocaleString() : 0}
                        </div>
                        ) : (
                          <div style={{color: 'green'}}>{text ? 
                            Math.round(parseFloat(text))?.toLocaleString() : 0}</div>
                        )}
                      </Space>
                    ),
                    align: 'right',
                  }
              ],
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

  const handleFilterChange = newFilters => {
    setFilteredDatas(newFilters);
  };

  const handleTabChanges = (key) => {
    setActiveKeys(key);
  };

  const handleCityVisibilityChange = checkedValues => {
    setVisibleCities(checkedValues);
  };

  const exportToExcelHTML = async () => {
    try {
      const { data } = await getRapportSuperficie(filteredDatas);
  
      const groupedData = data.data.reduce((acc, item) => {
        const mois = moment(item.periode).format('MMM-YY');
        
        if (!acc[mois]) acc[mois] = {};
        
        if (!acc[mois][item.nom_batiment]) {
          acc[mois][item.nom_batiment] = {
            total_facture: 0,
            total_occupe: 0,
            superficie: 0,
          };
        }
  
        acc[mois][item.nom_batiment].total_facture += item.total_facture || 0;
        acc[mois][item.nom_batiment].total_occupe += item.total_occupe || 0;
        acc[mois][item.nom_batiment].superficie += item.superficie || 0;
  
        return acc;
      }, {});
  
      // Formater les données pour l'exportation Excel
      const formattedData = Object.entries(groupedData).map(([mois, batiments]) => {
        const row = { Mois: mois };
        for (const [batiment, valeurs] of Object.entries(batiments)) {
          row[`${batiment}_Facture`] = valeurs.total_facture;
          row[`${batiment}_Occupe`] = valeurs.total_occupe;
          row[`${batiment}_Superficie`] = valeurs.superficie;
        }
        return row;
      });
  
      // Extraire les noms des bâtiments pour générer dynamiquement les colonnes
      const extractedBatiments = [...new Set(data.data.map(item => item.nom_batiment))];
  
      let tableHTML = `
       <meta charset="UTF-8">
        <table border="1" style="border-collapse: collapse; font-size: 12px; text-align: right;">
          <thead>
            <tr>
              <th>#</th>
              <th>Mois</th>
              ${extractedBatiments.map(batiment => `
                <th colspan="3">${batiment}</th>
              `).join('')}
            </tr>
            <tr>
              <th></th>
              <th></th>
              ${extractedBatiments.map(batiment => `
                <th>Facturé</th>
                <th>Occupé</th>
                <th>M² Diff</th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
      `;
  
      formattedData.forEach((row, index) => {
        tableHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${row.Mois}</td>
            ${extractedBatiments.map(batiment => {
              const facture = row[`${batiment}_Facture`] || 0;
              const occupe = row[`${batiment}_Occupe`] || 0;
              const superficie = row[`${batiment}_Superficie`] || 0;
              const diff = superficie !== 0 ? (facture - occupe) : 0;
  
              return `
                <td>${Math.round(facture).toLocaleString()}</td>
                <td>${Math.round(occupe).toLocaleString()}</td>
                <td>${Math.round(diff).toLocaleString()}</td>
              `;
            }).join('')}
          </tr>
        `;
      });
  
      tableHTML += `
        </tbody>
      </table>
      `;
  
      // Créer un Blob pour le téléchargement Excel
      const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "rapport_superficie_export.xls";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    }
  };

  const exportToPDF = async () => {
    try {
      const { data } = await getRapportSuperficie(filteredDatas);
  
      setDetail(data.resume)
      // Regrouper les données par mois et par bâtiment
      const groupedData = data.data.reduce((acc, item) => {
        const mois = moment(item.periode).format('MMM-YY');
  
        if (!acc[mois]) acc[mois] = {};
  
        if (!acc[mois][item.nom_batiment]) {
          acc[mois][item.nom_batiment] = {
            total_facture: 0,
            total_occupe: 0,
            superficie: 0,
          };
        }
  
        acc[mois][item.nom_batiment].total_facture += item.total_facture || 0;
        acc[mois][item.nom_batiment].total_occupe += item.total_occupe || 0;
        acc[mois][item.nom_batiment].superficie += item.superficie || 0;
  
        return acc;
      }, {});
  
      // Création du PDF
      const doc = new jsPDF();
      const title = 'Rapport de Superficie';
      const date = moment().format('DD MMMM YYYY');
  
      // Ajouter un titre
      doc.setFontSize(18);
      doc.text(title, 10, 20);
  
      // Ajouter la date
      doc.setFontSize(12);
      doc.text(`Date: ${date}`, 10, 30);
  
      // Mise en page professionnelle - Ajout des données
      let yPosition = 40; // Position verticale de départ pour les données
  
      // Fonction pour ajouter une nouvelle page si nécessaire
      const addNewPageIfNeeded = () => {
        if (yPosition > 250) { // Si la position dépasse la limite de la page (250 est la limite pour le format A4)
          doc.addPage(); // Ajouter une nouvelle page
          yPosition = 20; // Réinitialiser la position en haut de la page
        }
      };
  
      Object.entries(groupedData).forEach(([mois, batiments]) => {
        doc.setFontSize(14);
        doc.text(`Mois : ${mois}`, 10, yPosition);
        yPosition += 10;
        addNewPageIfNeeded();
  
        Object.entries(batiments).forEach(([batiment, valeurs]) => {
          doc.setFontSize(12);
          doc.text(`Bâtiment: ${batiment}`, 10, yPosition);
          yPosition += 5;
          addNewPageIfNeeded();
  
          doc.text(`Facturé: ${valeurs.total_facture}`, 10, yPosition);
          yPosition += 5;
          addNewPageIfNeeded();
  
          doc.text(`Occupé: ${valeurs.total_occupe}`, 10, yPosition);
          yPosition += 5;
          addNewPageIfNeeded();
  
          doc.text(`Superficie: ${valeurs.superficie}`, 10, yPosition);
          yPosition += 10;
          addNewPageIfNeeded();
        });
  
        // Ajouter une ligne de séparation entre les mois
        doc.setLineWidth(0.5);
        doc.line(10, yPosition, 200, yPosition);
        yPosition += 5;
        addNewPageIfNeeded();
      });
  
      // Sauvegarder le PDF
      doc.save("rapport_superficie_textuel.pdf");
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    }
  };

  
  return (
    <>
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
                      Nbre de batiment : <strong>{detail?.nbre_batiment}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    M² facturé :{' '}
                    <strong>{Math.round(parseFloat(detail.total_facture))?.toLocaleString()}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    M² Occupé :{' '}
                    <strong>{Math.round(parseFloat(detail.total_occupe))?.toLocaleString()}</strong>
                    </span>
                </div>
                </div>
            )
        }
      <div className="rapport_facture">
        <h2 className="rapport_h2">RAPPORT SUPERFICIE</h2>
        <div className='rapport_row_excel'>
            <Button
            type={filterVisible ? 'primary' : 'default'}
            onClick={() => setFilterVisible(!filterVisible)}
            style={{ margin: '10px 10px 10px 0' }}
            >
            {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
            </Button>

            <Tooltip title={'Importer en excel'}>
                <Button className="export-excel" onClick={exportToExcelHTML} >
                    <FileExcelOutlined className="excel-icon" />
                </Button>
            </Tooltip>

            <Tooltip title={'Importer en pdf'}>
                <Button className="export-pdf" onClick={exportToPDF} >
                    <FilePdfOutlined className="pdf-icon" />
                </Button>
            </Tooltip>
        </div>
        {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={false} filtraStatus={true} filtreBatiment={true} />}

        <div className="rapport_wrapper_facture">
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            scroll={{ x: 'max-content' }}
            loading={loading}
            size="small"
            pagination={pagination}
            onChange={pagination => setPagination(pagination)}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        </div>
      </div>
    </>
  );
};

export default RapportSuperficie;
