import  { useEffect, useState,  useRef } from 'react';
import { Typography, Button, Tag, Radio, Card, Table, notification, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { CarOutlined, SearchOutlined } from '@ant-design/icons';
import { formatNumber } from '../../../../../../utils/formatNumber';
import { getRapportVehiculePeriode } from '../../../../../../services/carburantService';
import { availableFieldsRapPeriode } from '../../../../../../utils/availableFields';
import RapportPeriodeFiltrage from './../rapportPeriodeFiltrage/RapportPeriodeFiltrage';

const { Text, Title } = Typography;

const RapportVehiculePeriode = () => {
    const [month, setMonth] = useState(moment().format('YYYY-MM'));
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedField, setSelectedField] = useState('total_pleins');
    const [searchText, setSearchText] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [uniqueMonths, setUniqueMonths] = useState([]);
    const [activeKeys, setActiveKeys] = useState(['1', '2']);
    const [detail, setDetail] = useState([]);
    const tableRef = useRef();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [columns, setColumns] = useState([]);

    const fetchData = async() => {
        setLoading(true)
        try {
            const { data } = await getRapportVehiculePeriode(month);

            const uniqueMonths = Array.from(new Set(data.map(item => `${item.Mois}-${item.Année}`)))
                .sort((a, b) => {
                    const [monthA, yearA] = a.split('-').map(Number);
                    const [monthB, yearB] = b.split('-').map(Number);
                    return yearA - yearB || monthA - monthB;
                });
            const groupedData = data.reduce((acc, curr) => {
                let existing = acc.find(item => item.id_vehicule === curr.id_vehicule);
                const monthName = moment(`${curr.Année}-${curr.Mois}-01`).format('MMM-YYYY');

                if(!existing) {
                    existing = {marque: curr.nom_marque, immatriculation: curr.immatriculation};
                    acc.push(existing);
                }

                existing[`${monthName}_${selectedField}`] = {
                    value: curr[selectedField] ?? 0,
                    id: curr.id_vehicule
                };

                return acc;
            }, [])

            setData(groupedData)
            setUniqueMonths(uniqueMonths);          
        } catch (error) {
            notification.error({
                message: "Erreur de chargement",
                description: "Impossible de récupérer les données carburant.",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchData();
    }, [month, selectedField]);

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
                    title: 'Marque',
                    dataIndex: 'marque',
                    key: 'marque',
                    fixed: "left",
                    render: (text, record) => (
                        <div>
                            <Text>{text}</Text>
                            <br />
                            <span style={{ fontSize: "12px", fontStyle: "italic", color: "#888" }}>
                                {record.immatriculation}
                            </span>
                        </div>
                    ),
                    width: "15%"
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
                        const id = valueObj?.id

                        return (
                            <span style={{ color: val > 0 ? "black" : "red"}}>
                                {`${val.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                            </span>
                        )
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
  return (
    <>
        <div className="rapport-facture">
            <Card>
                <div>
                    <span>Afficher : </span>
                    <Radio.Group
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                    >
                        {availableFieldsRapPeriode.map(({ key, label }) => (
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
            </div>
            {filterVisible && <RapportPeriodeFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={true} filtreBatiment={true} filtreTemplate={true} filtreMontant={false} />}
            <div ref={tableRef}>
                <Table
                    dataSource={data}
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    bordered
                    size="small"
                    pagination={pagination}
                    loading={loading}
                    onChange={pagination => setPagination(pagination)}
                />
            </div>
        </div>
    </>
  )
}

export default RapportVehiculePeriode