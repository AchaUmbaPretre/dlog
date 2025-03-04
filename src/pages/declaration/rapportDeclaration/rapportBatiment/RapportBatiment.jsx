import React, { useEffect, useRef, useState } from 'react';
import { notification, Table, Tag, Tooltip, Modal, Radio, Button, Skeleton } from 'antd';
import moment from 'moment';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
    FileExcelOutlined} from '@ant-design/icons';
import { getRapportBatiment } from '../../../../services/templateService';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const availableFields = [
  { key: 'total_facture', label: 'M² Facture' },
  { key: 'total_occupe', label: 'M² Occupé' },
  { key: 'total_entreposage', label: 'Entreposage' },
  { key: 'total_manutation', label: 'Manutention' },
  { key: 'total_entreManu', label: 'Entrep + Manut' },
  { key: 'ttc_entreposage', label: 'TTC Entreposage' },
  { key: 'ttc_manutation', label: 'TTC Manutention' },
];

const RapportBatiment = () => {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [columns, setColumns] = useState([]);
  const searchInput = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [uniqueMonths, setUniqueMonths] = useState([]);
  const [selectedField, setSelectedField] = useState('total_entreposage'); // Par défaut : total_entreposage
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [detail, setDetail] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [idBatiment, setIdBatiment] = useState('');

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idBatiment = '') => {
    closeAllModals();
    setModalType(type);
    setIdBatiment(idBatiment)
  };

  const handleBatiment = (idBatiment) => {
    openModal('Batiment', idBatiment);
    console.log(idBatiment)
  };
  
  const fetchData = async () => {
    try {
      const { data } = await getRapportBatiment(filteredDatas); 

      const uniqueMonths = Array.from(new Set(data.data.map(item => `${item.Mois}-${item.Année}`)))
        .sort((a, b) => {
          const [monthA, yearA] = a.split('-').map(Number);
          const [monthB, yearB] = b.split('-').map(Number);
          return yearA - yearB || monthA - monthB;
        });

        setDetail(data.resume)

      setUniqueMonths(uniqueMonths);

      const groupedData = data.data.reduce((acc, curr) => {
        const monthName = moment(`${curr.Année}-${curr.Mois}-01`).format('MMM-YYYY');
    
        let existing = acc.find(item => item.desc_template.trim().toLowerCase() === curr.nom_batiment.trim().toLowerCase());
    
        if (!existing) {
            existing = { desc_template: curr.nom_batiment, nom: curr.nom, id_batiment: curr.id_batiment };
            acc.push(existing);
        }
    
        existing[`${monthName}_${selectedField}`] = curr[selectedField] ?? 0;
    
        return acc;
    }, []);
    

      setDataSource(groupedData);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: error.response?.data?.message || 'Une erreur est survenue',
      });
      setLoading(false);
    }
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
    hideScroll: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  };

  useEffect(() => {
    fetchData();
  }, [selectedField, filteredDatas]);

  useEffect(() => {
    const generateColumns = () => {
      const baseColumns = [
        {
          title: "#",
          dataIndex: "id",
          key: "id",
          render: (text, record, index) => {
            const { pageSize, current } = pagination;
            return (current - 1) * pageSize + index + 1;
          },
          width: "5%",
        },
        {
            title: "Batiment",
            dataIndex: "desc_template",
            key: "desc_template",
            ...getColumnSearchProps(
                'desc_template',
                searchText,
                setSearchText,
                setSearchedColumn,
                searchInput
              ),
            fixed: "left",
            render: (text, record) => (
              <div  onClick={()=> handleBatiment(record.id_batiment)}>
                <span style={columnStyles.title} className={columnStyles.hideScroll}>{text}</span>
                <br />
                <span style={{ fontSize: "12px", fontStyle: "italic", color: "#888" }}>
                  {record.nom}
                </span>
              </div>
            ),
            width: "15%",
          },
          
      ];

      const dynamicColumns = uniqueMonths.map(month => {
        const monthName = moment(`${month.split('-')[1]}-${month.split('-')[0]}-01`).format('MMM-YYYY');
        return {
            title: (
                <div style={{ textAlign: "center" }}>
                    <Tag color={"#2db7f5"}>{monthName}</Tag>
                </div>
            ),
            dataIndex: `${monthName}_${selectedField}`,
            key: `${month}_${selectedField}`,
            sorter: (a, b) => (a[`${monthName}_${selectedField}`] || 0) - (b[`${monthName}_${selectedField}`] || 0),
            sortDirections: ["descend", "ascend"],
            render: (value) => {
                if (value) {
                    return (
                        <span style={{ color: "black" }}>
                            {selectedField === 'total_facture' || selectedField === 'total_occupe' 
                                ? `${parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                                : `${parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 2 })} $`
                            }
                        </span>
                    );
                }
                return (
                    <span style={{ color: "red" }}>
                        0.00
                    </span>
                );
            },
            align: "right",
        };
    });
    

      return [...baseColumns, ...dynamicColumns];
    };

    setColumns(generateColumns());
  }, [uniqueMonths, selectedField, filteredDatas]);

  const handleFilterChange = newFilters => {
    setFilteredDatas(newFilters);
  };

  const exportToExcelHTML = () => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rapport Bâtiment");
  
    // Générer un fichier Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    saveAs(data, `rapport_batiment_${moment().format("YYYY-MM-DD")}.xlsx`);
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
                    Nbre de client :{' '}
                    <strong>{Math.round(parseFloat(detail.nbre_client))?.toLocaleString()}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Entreposage :{' '}
                    <strong>{Math.round(parseFloat(detail.total_entreposage))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Manutention :{' '}
                    <strong>{Math.round(parseFloat(detail.total_manutation))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Entrep & Manut :{' '}
                    <strong>{Math.round(parseFloat(detail.total))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    TTC Entrep :{' '}
                    <strong>{Math.round(parseFloat(detail.ttc_entreposage))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    TTC Manut :{' '}
                    <strong>{Math.round(parseFloat(detail.ttc_manutention))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    M² Facturé :{' '}
                    <strong>{detail.total_facture?.toLocaleString()}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    M² Occupé :{' '}
                    <strong>{detail.total_occupe?.toLocaleString()}</strong>
                    </span>
                </div>
                </div>
            )
        }
      <div className="rapport-facture">
        <div style={{ marginBottom: 16 }}>
          <span>Afficher : </span>
          <Radio.Group
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            {availableFields.map(({ key, label }) => (
              <Radio key={key} value={key}>
                {label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
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
        </div>
        {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={true} filtreBatiment={true} filtreTemplate={true} filtreMontant={false} />}
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          scroll={{ x: "max-content" }}
          size="small"
          pagination={pagination}
          loading={loading}
          onChange={pagination => setPagination(pagination)}
          rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
        />
      </div>
      <Modal
        title=""
        visible={modalType === 'Batiment'}
        onCancel={closeAllModals}
        footer={null}
        width={1070}
        centered
      >
      aaaaaaaaaaaaaaa
      </Modal>
    </>
  );
};

export default RapportBatiment;
