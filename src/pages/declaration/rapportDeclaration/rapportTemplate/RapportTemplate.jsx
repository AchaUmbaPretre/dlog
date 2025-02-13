import React, { useEffect, useRef, useState } from 'react';
import { notification, Table, Tag, Radio } from 'antd';
import moment from 'moment';
import { getRapportTemplate } from '../../../../services/templateService';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const availableFields = [
  { key: 'total_facture', label: 'M² Facture' },
  { key: 'total_occupe', label: 'M² Occupé' },
  { key: 'total_entreposage', label: 'Entreposage' },
  { key: 'total_manutation', label: 'Manutation' },
  { key: 'total_entreManu', label: 'Entrep + Manut' },
  { key: 'ttc_entreposage', label: 'TTC Entreposage' },
  { key: 'ttc_manutation', label: 'TTC Manutation' },
];

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

  const fetchData = async () => {
    try {
      const { data } = await getRapportTemplate(); 

      const uniqueMonths = Array.from(new Set(data.map(item => `${item.Mois}-${item.Année}`)))
        .sort((a, b) => {
          const [monthA, yearA] = a.split('-').map(Number);
          const [monthB, yearB] = b.split('-').map(Number);
          return yearA - yearB || monthA - monthB;
        });

      setUniqueMonths(uniqueMonths);

      const groupedData = data.reduce((acc, curr) => {
        let existing = acc.find(item => item.desc_template === curr.desc_template);
        const monthName = moment(`${curr.Année}-${curr.Mois}-01`).format('MMM-YYYY');

        if (!existing) {
          existing = { desc_template: curr.desc_template, nom: curr.nom };
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
  }, [selectedField]);

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
          render: (value) => (
            <span style={{ color: value ? "black" : "red" }}>
              {value ? `${parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 2 })} $` : "0.00"}
            </span>
          ),
          align: "right",
        };
      });

      return [...baseColumns, ...dynamicColumns];
    };

    setColumns(generateColumns());
  }, [uniqueMonths, selectedField]);

  const handleFilterChange = newFilters => {
    setFilteredDatas(newFilters);
  };

  return (
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
      {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={false} filtraStatus={true} filtreBatiment={true} />}
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
  );
};

export default RapportTemplate;
