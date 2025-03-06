import React, { useEffect, useRef, useState } from 'react'
import { Button, notification, Space, Table, Tag } from 'antd';
import moment from 'moment';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
    CalendarOutlined,
    EnvironmentOutlined,
    HomeOutlined, 
    FileTextOutlined, 
    DollarOutlined, 
    UserOutlined
} from '@ant-design/icons';
import getColumnSearchProps from '../../../../../utils/columnSearchUtils';
import RapportFiltrage from '../../rapportFiltrage/RapportFiltrage';
import { getDeclarationOneClientV } from '../../../../../services/templateService';
import { StatutDeclaration } from '../../../declarationStatut/DeclarationStatut';

const RapportFactureClientOne = ({id_client}) => {
    const [loading, setLoading] = useState(true);
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
    const [title, setTitle] = useState([]);
  
    const fetchData = async () => {
        try {
            const { data } = await getDeclarationOneClientV(id_client)

            if (!data || data.length === 0) {
                notification.warning({
                    message: 'Aucune donnée disponible',
                    description: 'Aucune déclaration n’a été trouvée pour le client sélectionné.',
                });
                setDataSource([]);
                setLoading(false);
                return;
            }

            setDataSource(data)
            setTitle(data[0]?.nom_client)
            setLoading(false);
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        } finally{
            setLoading(false);
        }
      }

    useEffect(() => {
      fetchData();
    }, [filteredDatas, id_client]);

    const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
      };

    const handFilter = () => {
        fetchData()
        setFilterVisible(!filterVisible)
      }
      
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

    const columnStyles = {
        title: {
          maxWidth: '220px',
          whiteSpace: 'nowrap',
          overflowX: 'scroll', 
          overflowY: 'hidden',
          textOverflow: 'ellipsis',
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none', 
        },
        titleClient: {
          maxWidth: '150px',
          whiteSpace: 'nowrap',
          overflowX: 'scroll', 
          overflowY: 'hidden',
          textOverflow: 'ellipsis',
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none', 
        },
        hideScroll: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      };

    const columns = [
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
        },
        // Groupe Entreposage
        {
          title: 'Entreposage',
          children: [
            {
              title: 'Template',
              dataIndex: 'desc_template',
              key: 'desc_template',
              render: (text, record) => (
                <Space style={columnStyles.title} className={columnStyles.hideScroll}>
                  <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
                </Space>
              ),
            },
            {
              title: 'Periode',
              dataIndex: 'periode',
              key: 'periode',
              sorter: (a, b) => moment(a.periode) - moment(b.periode),
              sortDirections: ['descend', 'ascend'],
              render: (text, record) => {
                const date = text ? new Date(text) : null;
                const mois = date ? date.getMonth() + 1 : null; // getMonth() renvoie 0-11, donc +1 pour avoir 1-12
                const annee = date ? date.getFullYear() : null;
                
                const formattedDate = date
                  ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
                  : 'Aucun';
            
                return (
                  <Tag 
                    icon={<CalendarOutlined />} 
                    color="purple" 
                  >
                    {formattedDate}
                  </Tag>
                );
              },
            },  
            {
              title: 'Statut',
              dataIndex: 'id_statut_decl',
              key: 'id_statut_decl',
              render: (text, record) => (
                <StatutDeclaration initialStatus={text} id={record.id_declaration_super} />
              ),
            },
            {
              title: 'M² occupe',
              dataIndex: 'm2_occupe',
              key: 'm2_occupe',
              sorter: (a, b) => a.m2_occupe - b.m2_occupe,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                    {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") : "0.00"}
                </div>
              ),
              align: 'right', 
            },
            {
              title: 'M² facture',
              dataIndex: 'm2_facture',
              key: 'm2_facture',
              sorter: (a, b) => a.m2_facture - b.m2_facture,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") : "0.00"}
                </div>
              ),
              align: 'right', 
            },
            {
              title: 'Tarif Entr',
              dataIndex: 'tarif_entreposage',
              key: 'tarif_entreposage',
              sorter: (a, b) => a.tarif_entreposage - b.tarif_entreposage,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") + " $": "0.00"}
                </div>
              ),
              align: 'right', 
            },
            {
              title: 'Debours Entr',
              dataIndex: 'debours_entreposage',
              key: 'debours_entreposage',
              sorter: (a, b) => a.debours_entreposage - b.debours_entreposage,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") + " $": "0.00"}
                </div>
              ),
              align: 'right', 
            },
            {
              title: 'Total Entr',
              dataIndex: 'total_entreposage',
              key: 'total_entreposage',
              sorter: (a, b) => a.total_entreposage - b.total_entreposage,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") + " $": "0.00"}
                </div>
                ),
              align: 'right', 
            },
            {
              title: 'TTC Entr',
              dataIndex: 'ttc_entreposage',
              key: 'ttc_entreposage',
              sorter: (a, b) => a.ttc_entreposage - b.ttc_entreposage,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") + " $": "0.00"}
                </div>
              ),
              align: 'right', 
            },
          ]
        },
        // Groupe Manutention
        {
          title: 'Manutention',
          children: [
            {
              title: 'Desc Man',
              dataIndex: 'desc_manutation',
              key: 'desc_manutation',
              render: (text) => (
                <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
              ),
            },
            {
              title: 'Ville',
              dataIndex: 'capital',
              key: 'capital',
              ...getColumnSearchProps(
                'capital',
                searchText,
                setSearchText,
                setSearchedColumn,
                searchInput
              ),
              render: (text) => (
                <Tag icon={<EnvironmentOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
              ),
            },
            {
              title: 'Bâtiment',
              dataIndex: 'nom_batiment',
              key: 'nom_batiment',
              render: (text) => (
                <Tag icon={<HomeOutlined />} color="purple">{text ?? 'Aucun'}</Tag>
              ),
            },
            {
              title: 'Objet fact',
              dataIndex: 'nom_objet_fact',
              key: 'nom_objet_fact',
              render: (text) => (
                <Tag icon={<FileTextOutlined />} color="magenta">{text ?? 'Aucun'}</Tag>
              ),
            },
            {
              title: 'Manu.',
              dataIndex: 'manutation',
              key: 'manutation',
              sorter: (a, b) => a.manutation - b.manutation,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") + " $": "0.00"}
                </div>
              ),
              align: 'right', 
            },
            {
              title: 'Tarif Manu',
              dataIndex: 'tarif_manutation',
              key: 'tarif_manutation',
              sorter: (a, b) => a.tarif_manutation - b.tarif_manutation,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") + " $": "0.00"}
                </div>
              ),
              align: 'right', 
            },
            {
              title: 'Debours Manu',
              dataIndex: 'debours_manutation',
              key: 'debours_manutation',
              sorter: (a, b) => a.debours_manutation - b.debours_manutation,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") + " $": "0.00"}
                </div>
              ),
              align: 'right', 
            },
            {
              title: 'Total Manu',
              dataIndex: 'total_manutation',
              key: 'total_manutation',
              sorter: (a, b) => a.total_manutation - b.total_manutation,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") + " $": "0.00"}
                </div>
              ),
              align: 'right',
            },
            {
              title: 'TTC Manu',
              dataIndex: 'ttc_manutation',
              key: 'ttc_manutation',
              sorter: (a, b) => a.ttc_manutation - b.ttc_manutation,
              sortDirections: ['descend', 'ascend'],
              render: (text) => (
                <div style={{color: text ? 'black' : 'red'}}>
                {text ? Math.round(parseFloat(text))?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })
                            .replace(/,/g, " ") + " $": "0.00"}
                </div>
              ),
              align: 'right', 
            },
          ]
        }
      ];
    
  return (
    <>
        <div className="rapport_facture">
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '15px',
            marginBottom: '30px',
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            minHeight: '60px',
            border: '1px solid #ddd',
            transition: 'all 0.3s ease-in-out',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#333'
        }}>
            <h2 style={{
                fontSize: '1.3rem',
                margin: 0,
                color: '#004080'
            }}>
                👤 Détail du client {title}
            </h2>
        </div>
            <div className='rapport_row_excel'>
                <Button
                    type="default"
                    onClick={handFilter}
                >
                    {filterVisible ? '🚫 Cacher les filtres' : '👁️ Afficher les filtres'}
                </Button>
            </div>

            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={false} filtraStatus={false} filtreMontant={false}/>}
            <div className="rapport_wrapper_facture">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    scroll={scroll}
                    loading={loading}
                    size="small"
                    pagination={pagination}
                    onChange={handleTableChange}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
        </div>
    </>
  )
}

export default RapportFactureClientOne