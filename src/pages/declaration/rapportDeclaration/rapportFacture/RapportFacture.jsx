import React, { useEffect, useRef, useState } from 'react'
import './rapportFacture.scss'
import { Button, notification, Popover, Modal, Skeleton, Space, Table, Tabs, Tag, Tooltip } from 'antd';
import { getRapportFacture, getRapportFactureClient } from '../../../../services/templateService';
import moment from 'moment';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
    AreaChartOutlined,
    PieChartOutlined,
    SwapOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import RapportFactureChart from './rapportFactureChart/RapportFactureChart';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';
import TabPane from 'antd/es/tabs/TabPane';
import RapportFactureVille from './rapportFactureVille/RapportFactureVille';
import RapportFacturePie from './rapportFacturePie/RapportFacturePie';
import RapportFactureExterneEtInterne from './rapportFactureExterneEtInterne/RapportFactureExterneEtInterne';
import RapportFactureClientOne from './rapportFactureClientOne/RapportFactureClientOne';
import RapportFactureChartLine from '../rapportVueEnsemble/rapportFactureChartLine/RapportFactureChartLine';

const RapportFacture = () => {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
      });
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [ uniqueMonths, setUniqueMonths] = useState([]);
    const [activeKey, setActiveKey] = useState(['1', '2']);
    const [activeKeys, setActiveKeys] = useState(['1', '2']);
    const [ detail, setDetail] = useState('');
    const [ clientdetail, setClientDetail] = useState([]);
    const [ idClient, setIdClient ] = useState('');
    const [modalType, setModalType] = useState(null);
    

    const closeAllModals = () => {
      setModalType(null);
    };
    
    const openModal = (type, idClient = '') => {
      closeAllModals();
      setModalType(type);
      setIdClient(idClient);
    };

    const handleDetail = (idClient) => {
      openModal('detail', idClient);
    };

    const handleTabChange = (key) => {
        setActiveKey(key);
      };

      const handleTabChanges = (key) => {
        setActiveKeys(key);
      };

      const fetchData = async () => {
        try {
          const { data } = await getRapportFacture(filteredDatas);

          const res = await getRapportFactureClient()

          setDetail(data?.resume);
          setClientDetail(res?.data)
      
          const uniqueMonths = Array.from(
            new Set(data?.data.map((item) => `${item.Mois}-${item.Année}`))
          ).sort((a, b) => {
            const [monthA, yearA] = a.split("-");
            const [monthB, yearB] = b.split("-");
            return yearA - yearB || monthA - monthB;
          });
      
          const groupedData = data.data.reduce((acc, curr) => {
            const client = acc.find((item) => item.Client === curr.Client);
            const [numMonth, year] = [curr.Mois, curr.Année];
            const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
      
            if (client) {
              client[monthName] = curr.Montant || 0;
              client.Total = (client.Total || 0) + (curr.Montant || 0);
            } else {
              acc.push({
                Client: curr.Client,
                [monthName]: curr.Montant || 0,
                Total: curr.Montant || 0,
                id_client: curr.id_client,
              });
            }
            return acc;
          }, []);

          setUniqueMonths(uniqueMonths)
      
          const generatedColumns = [
            {
              title: '#',
              dataIndex: 'id',
              key: 'id',
              render: (text, record, index) => {
                const pageSize = pagination.pageSize || 10;
                const pageIndex = pagination.current || 1;
                return (pageIndex - 1) * pageSize + index + 1;
              },
              width: "4%",
              align: 'right',
            },
            {
              title: "Client",
              dataIndex: "Client",
              key: "Client",
              fixed: "left",
              ...getColumnSearchProps(
                'Client',
                searchText,
                setSearchText,
                setSearchedColumn,
                searchInput
              ),
              render: (text, record) => (
                <Space>
                  <div onClick={() => handleDetail(record.id_client)}>
                    {text}
                  </div>
                </Space>
              ),
              align: 'left', 
              title: <div style={{ textAlign: 'left' }}>Client</div>,
            },
            ...uniqueMonths.map((month) => {
              const [numMonth, year] = month.split("-");
              const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
          
              return {
                title: <div style={{ textAlign: 'center' }}><Tag color="#2db7f5">{monthName}</Tag></div>,
                dataIndex: monthName,
                key: monthName,
                sorter: (a, b) => (a[monthName] || 0) - (b[monthName] || 0),
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                  <Space>
                    <div style={{color: text ? 'black' : 'red'}}>
                        {text ? Math.round(parseFloat(text))?.toLocaleString() : 0}
                    </div>
                  </Space>
                ),
                align: 'right' 
              };
            }),
            {
              title: "Total",
              dataIndex: "Total",
              key: "Total",
              sorter: (a, b) => a.Total - b.Total,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                    {text ? Math.round(parseFloat(text))?.toLocaleString() : 0}
                </div>
              ),
              align: 'right',
              title: <div style={{ textAlign: 'center' }}>Total</div>,
            },
          ];
          
      
          setColumns(generatedColumns);
          setDataSource(groupedData);
          setLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Gérer l'erreur 404
                notification.error({
                    message: 'Erreur',
                    description: `${error.response.data.message}`,
                });
            } else {
                notification.error({
                    message: 'Erreur',
                    description: 'Une erreur est survenue lors de la récupération des données.',
                });
            }
            setLoading(false);
        }
      };
  
    useEffect(() => {
      fetchData();
    }, [filteredDatas]);

    const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
      };

    const handFilter = () => {
        fetchData()
        setFilterVisible(!filterVisible)
      }
    
      const clientListContent = (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {clientdetail.map((client, index) => (
              <li key={index} style={{ padding: "5px 0", borderBottom: "1px solid #f0f0f0", fontSize:'12px' }}>
                {index + 1}. {client.nom}
              </li>
            ))}
          </ul>
        </div>
      );
      
    const exportToExcelHTML = () => {
        let tableHTML = `
            <table border="1">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Client</th>
                        ${uniqueMonths.map(month => {
                            const [numMonth, year] = month.split("-");
                            const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
                            return `<th>${monthName}</th>`;
                        }).join('')}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;
    
        // Parcourez chaque ligne de données
        dataSource.forEach((row, index) => {
    
            let rowHTML = `<tr><td>${index + 1}</td><td>${row.Client}</td>`;
    
            // Remplir les valeurs des mois dans la ligne
            uniqueMonths.forEach(month => {
                console.log('Month:', month); // Vérifiez la valeur de chaque mois dans uniqueMonths
    
                // Formatez correctement la clé du mois
                const [numMonth, year] = month.split("-");
                const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
    
                // Récupérer la clé correspondante au mois dans la ligne
                const value = row[monthName] || 0; // Utilisez la clé formatée
                rowHTML += `<td>${value ? Math.round(value).toLocaleString() : 0}</td>`;
            });
    
            // Ajouter la colonne "Total"
            rowHTML += `<td>${row.Total ? Math.round(row.Total).toLocaleString() : 0}</td></tr>`;
            tableHTML += rowHTML;
        });
    
        tableHTML += `
                </tbody>
            </table>
        `;
    
        // Créer un blob pour l'exportation en Excel
        const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement("a");
        a.href = url;
        a.download = "export.xls";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const exportToPDF = () => {
      const doc = new jsPDF();
    
      const dateStr = moment().format("DD MMMM YYYY");
    
      const pageWidth = doc.internal.pageSize.getWidth();
    
      const title = "Rapport des Factures";
      const titleWidth = doc.getTextWidth(title);
      const dateWidth = doc.getTextWidth(dateStr);
      
      const titleX = (pageWidth - titleWidth) / 2;
      const dateX = pageWidth - dateWidth - 14;
    
      doc.setFontSize(16);
      doc.text(title, titleX, 15);
      doc.setFontSize(12);
      doc.text(dateStr, dateX, 15);
    
      const tableColumns = columns.map(col => {
        if (React.isValidElement(col.title)) {
          return col.title.props?.children?.props?.children || col.title.props?.children || "Inconnu"; 
        }
        return col.title || "Inconnu";
      });
    
      const tableRows = dataSource.map((row, index) => {
        return [
          index + 1, 
          typeof row.Client === "object" ? JSON.stringify(row.Client) : row.Client, // 🔍 Assurer une chaîne de caractères
          ...uniqueMonths.map(month => {
            const [numMonth, year] = month.split("-");
            const monthName = moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
            return row[monthName] ?? 0;
          }),
          row.Total ?? 0
        ];
      });
    
      // 📌 Ajout du tableau au PDF
      doc.autoTable({
        head: [tableColumns.map(col => (typeof col === "object" ? JSON.stringify(col) : col))], // 🔍 Correction supplémentaire
        body: tableRows,
        startY: 25,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });
    
      doc.save("rapport_factures.pdf");
    };
    
    const handleTableChange = (pagination, filters, sorter) => {
      setPagination(pagination);
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
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '15px',
                    padding: '15px',
                    }}
                >
                    <Popover content={clientListContent} title="Liste des clients" trigger="hover">
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
                    </Popover>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Nbre de ville : <strong>{detail.Nbre_de_villes}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total M² facturé :{' '}
                    <strong>{Math.round(parseFloat(detail.Total_M2_facture))?.toLocaleString()}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Extérieur :{' '}
                    <strong>{detail.Total_M2_facture_Extérieur?.toLocaleString()}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Total Intérieur :{' '}
                    <strong>{detail.Total_M2_facture_Intérieur?.toLocaleString()}</strong>
                    </span>
                </div>
                </div>
            )
        }
        <Tabs
            activeKey={activeKey[0]}
            onChange={handleTabChange}
            type="card"
            tabPosition="top"
            renderTabBar={(props, DefaultTabBar) => (
                <DefaultTabBar {...props} />
            )}
        >
            <TabPane
                tab={
                    <span>
                        <AreaChartOutlined style={{ color: '#13c2c2' }} /> CLIENT DIVERS M² FACTURE
                    </span>
                }
                    key="1"
            >
                <div className="rapport_facture">
                  <div className='rapport_row_excel'>
                    <Button
                      type={filterVisible ? 'primary' : 'default'}
                      onClick={handFilter}
                      style={{ margin: '10px 0' }}
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

                    { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={true} filtreMontant={true}/>}
                    <div className="rapport_wrapper_facture">
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            bordered
                            scroll={scroll}
                            loading={loading}
                            size="small"
                            pagination={pagination}
                            onChange={handleTableChange} // Gère le changement de page
                            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                        />
                    </div>
                </div>
            </TabPane>

            <TabPane
                tab={
                    <span>
                        <AreaChartOutlined style={{ color: 'ORANGE' }} /> DETAIL PAR VILLE
                    </span>
                }
                    key="2"
            >
                 <RapportFactureVille/>
            </TabPane>

            <TabPane
                tab={
                        <span>
                            <SwapOutlined style={{ color: 'red' }} /> Intérieur & Extérieur
                        </span>
                    }
                    key="3"
            >
                <RapportFactureExterneEtInterne groupedData={dataSource} uniqueMonths={uniqueMonths} />
            </TabPane>
            
        </Tabs>
        <div className="rapport_chart">
            <Tabs
                activeKey={activeKeys[0]}
                onChange={handleTabChanges}
                type="card"
                tabPosition="top"
                renderTabBar={(props, DefaultTabBar) => (
                    <DefaultTabBar {...props} />
                )}
            >
                <TabPane
                    tab={
                    <span>
                        <AreaChartOutlined  style={{ color: 'blue' }} /> Bar
                    </span>
                }
                    key="1"
                >
                    <RapportFactureChart groupedData={dataSource} uniqueMonths={uniqueMonths} />
                </TabPane>

                <TabPane
                    tab={
                      <span>
                        <BarChartOutlined style={{ color: '#f50' }} /> Line
                      </span>
                    }
                        key="2"
                >
                  <RapportFactureChartLine groupedData={dataSource} uniqueMonths={uniqueMonths} />
                </TabPane>

                <TabPane
                    tab={
                    <span>
                        <PieChartOutlined style={{ color: 'ORANGE' }} /> Pie
                    </span>
                }
                    key="3"
                >
                    <RapportFacturePie groupedData={dataSource} uniqueMonths={uniqueMonths} />
                </TabPane>
            </Tabs>
        </div>
        <Modal
          title=""
          visible={modalType === 'detail'}
          onCancel={closeAllModals}
          footer={null}
          width={1025}
          centered
        >
          <RapportFactureClientOne id_client={idClient} />
        </Modal>
    </>
  )
}

export default RapportFacture