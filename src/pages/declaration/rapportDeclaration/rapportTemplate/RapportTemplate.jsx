import { useEffect, useRef, useState } from 'react';
import { notification, Table, Modal, Card, Tag, Tabs, Radio, Button, Skeleton, Tooltip } from 'antd';
import moment from 'moment';
import {
  FileExcelOutlined,
  PieChartOutlined,
  AreaChartOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getRapportTemplate } from '../../../../services/templateService';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';
import TabPane from 'antd/es/tabs/TabPane';
import RapportTemplateLine from './rapportTemplateLine/RapportTemplateLine';
import RapportTemplatePie from './rapportTemplatePie/RapportTemplatePie';
import DeclarationForm from '../../declarationForm/DeclarationForm';
import { availableFields } from '../../../../utils/availableFields';

const RapportTemplate = () => {
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
  const [idTemplate, setIdTemplate] = useState(null);
  const [activeKeys, setActiveKeys] = useState(['1', '2']);
  const scroll = { x: 'max-content' };
  const [modalType, setModalType] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await getRapportTemplate(filteredDatas); 

      const uniqueMonths = Array.from(new Set(data.data.map(item => `${item.Mois}-${item.Année}`)))
        .sort((a, b) => {
          const [monthA, yearA] = a.split('-').map(Number);
          const [monthB, yearB] = b.split('-').map(Number);
          return yearA - yearB || monthA - monthB;
        });

        setDetail(data.resume)

        setUniqueMonths(uniqueMonths);

      const groupedData = data.data.reduce((acc, curr) => {
        let existing = acc.find(item => item.desc_template === curr.desc_template);
        const monthName = moment(`${curr.Année}-${curr.Mois}-01`).format('MMM-YYYY');

        if (!existing) {
          existing = { desc_template: curr.desc_template, nom: curr.nom, batiment: curr.nom_batiment, };
          acc.push(existing);
        }

/*         existing[`${monthName}_${selectedField}`] = curr[selectedField] ?? 0;
 */
        existing[`${monthName}_${selectedField}`] = {
          value: curr[selectedField] ?? 0,
          id: curr.id_declaration_super,        };

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

  const handleTabChanges = (key) => {
    setActiveKeys(key);
  };

  const handleModify = (id) => openModal('Modify', id)

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, id = '') => {
      closeAllModals();
      setModalType(type);
      setIdTemplate(id)
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
            title: "Template",
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
              <div>
                <span style={columnStyles.title} className={columnStyles.hideScroll}>{text}</span>
                <br />
                <span style={{ fontSize: "12px", fontStyle: "italic", color: "#888" }}>
                  {record.nom}
                </span>
              </div>
            ),
            width: "15%",
          },
          {
        title: "Bâtiment",
        dataIndex: "batiment",
        key: "batiment",
        ...getColumnSearchProps(
          'batiment',
          searchText,
          setSearchText,
          setSearchedColumn,
          searchInput
        ),
        render: (text) => (
          <span style={{ whiteSpace: "nowrap" }}>{text}</span>
        ),
        width: "12%",
      }
      ];

    const dynamicColumns = uniqueMonths.map(month => {
      const monthName = moment(`${month.split('-')[1]}-${month.split('-')[0]}-01`).format('MMM-YYYY');
      const columnKey = `${monthName}_${selectedField}`;
    
      return {
        title: (
          <div style={{ textAlign: "center" }}>
            <Tag color={"#2db7f5"}>{monthName}</Tag>
          </div>
        ),
        dataIndex: columnKey,
        key: columnKey,
        sorter: (a, b) => {
          const aValue = a[columnKey]?.value ?? 0;
          const bValue = b[columnKey]?.value ?? 0;
          return aValue - bValue;
        },
        sortDirections: ["descend", "ascend"],
        render: (valueObj, record) => {
          const val = valueObj?.value ?? 0;
          const id = valueObj?.id;
    
          return (
            <span
              style={{ color: val > 0 ? "black" : "red", cursor: "pointer" }}
              onClick={() => handleModify(id, record)}
            >
              {selectedField === 'total_facture' || selectedField === 'total_occupe'
                ? val.toLocaleString("en-US", { minimumFractionDigits: 2 })
                : `${val.toLocaleString("en-US", { minimumFractionDigits: 2 })} $`}
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
  const exportData = dataSource.map(item => {
    let row = { Template: item.desc_template, Nom: item.nom, Bâtiment: item.batiment };

    uniqueMonths.forEach(month => {
      const monthName = moment(`${month.split('-')[1]}-${month.split('-')[0]}-01`).format('MMM-YYYY');
      // Prendre la valeur numérique et non l'objet entier
      row[monthName] = item[`${monthName}_${selectedField}`]?.value ?? 0;
    });

    return row;
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rapport");

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(data, `Rapport_${moment().format("YYYY-MM-DD")}.xlsx`);
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
          <Card>
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
          </Card>
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
          scroll={scroll}
          size="small"
          pagination={pagination}
          loading={loading}
          onChange={pagination => setPagination(pagination)}
          rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
        />
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
                            <AreaChartOutlined  style={{ color: 'blue' }} /> Line
                        </span>
                    }
                        key="1"
                    >
                         <RapportTemplateLine groupedData={dataSource} uniqueMonths={uniqueMonths} selectedField={selectedField} />
                    </TabPane>

                    <TabPane
                        tab={
                        <span>
                            <PieChartOutlined style={{ color: 'ORANGE' }} /> Pie
                        </span>
                    }
                        key="2"
                    >
                       <RapportTemplatePie groupedData={dataSource} uniqueMonths={uniqueMonths} selectedField={selectedField} />
                    </TabPane> 
            </Tabs>
          </div>
      </div>
      <Modal
        title=""
        visible={modalType === 'Modify'}
        onCancel={closeAllModals}
        footer={null}
        width={1200}
        centered
      >
        <DeclarationForm closeModal={() => setModalType(null)} fetchData={fetchData} idDeclaration={idTemplate} />
      </Modal>
    </>
  );
};

export default RapportTemplate;
