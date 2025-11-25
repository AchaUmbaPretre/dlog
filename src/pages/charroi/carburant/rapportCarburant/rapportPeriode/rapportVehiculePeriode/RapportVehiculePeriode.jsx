import { useEffect, useState } from 'react';
import { Typography, Button, Tag, Radio, Card, Table, notification } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { getRapportVehiculePeriode } from '../../../../../../services/carburantService';
import { availableFieldsRapPeriode } from '../../../../../../utils/availableFields';
import RapportPeriodeFiltrage from './../rapportPeriodeFiltrage/RapportPeriodeFiltrage';

const { Text } = Typography;

const RapportVehiculePeriode = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedField, setSelectedField] = useState('total_pleins');
    const [filterVisible, setFilterVisible] = useState(false);
    const [uniqueMonths, setUniqueMonths] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [columns, setColumns] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await getRapportVehiculePeriode(filteredDatas);

            // 1️⃣ Créer une clé stable "YYYY-MM"
            const months = Array.from(
                new Set(
                    data.map(item =>
                        `${item.Année}-${String(item.Mois).padStart(2, "0")}`
                    )
                )
            ).sort();

            const grouped = data.reduce((acc, curr) => {
                const key = `${curr.Année}-${String(curr.Mois).padStart(2, "0")}`;

                let existing = acc.find(item => item.id_vehicule === curr.id_vehicule);

                if (!existing) {
                    existing = {
                        id_vehicule: curr.id_vehicule,
                        marque: curr.nom_marque,
                        immatriculation: curr.immatriculation
                    };
                    acc.push(existing);
                }

                existing[key] = {
                    value: curr[selectedField] ?? 0,
                    id: curr.id_vehicule
                };

                return acc;
            }, []);

            setData(grouped);
            setUniqueMonths(months);

        } catch (error) {
            notification.error({
                message: "Erreur",
                description: "Impossible de charger les données.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedField, filteredDatas]);

    // Colonnes
    useEffect(() => {
        const generateColumns = () => {
            const base = [
                {
                    title: "#",
                    key: "id",
                    width: "5%",
                    render: (text, record, index) => {
                        const { pageSize, current } = pagination;
                        return (current - 1) * pageSize + index + 1;
                    }
                },
                {
                    title: 'Marque',
                    dataIndex: 'marque',
                    key: 'marque',
                    fixed: "left",
                    width: "15%",
                    render: (text, record) => (
                        <div>
                            <Text strong>{text}</Text>
                            <br />
                            <Text type="secondary" italic>
                                {record.immatriculation}
                            </Text>
                        </div>
                    )
                }
            ];

            // 2️⃣ Colonnes dynamiques basées sur YYYY-MM
            const dynamic = uniqueMonths.map(key => {
                const title = moment(`${key}-01`).format('MMM-YYYY');

                return {
                    title: (
                        <div style={{ textAlign: "center" }}>
                            <Tag color="#2db7f5">{title}</Tag>
                        </div>
                    ),
                    dataIndex: key,
                    key,
                    align: "right",
                    sorter: (a, b) => {
                        const aVal = a[key]?.value ?? 0;
                        const bVal = b[key]?.value ?? 0;
                        return aVal - bVal;
                    },
                    render: (valueObj) => {
                        const val = valueObj?.value ?? 0;
                        return (
                            <span style={{ color: val > 0 ? "black" : "red" }}>
                                {val.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                        )
                    }
                };
            });

            return [...base, ...dynamic];
        };

        setColumns(generateColumns());
    }, [uniqueMonths, selectedField, pagination]);

    return (
        <>
            <div className="rapport-facture">
                <Card>
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
                </Card>

                <Button
                    type={filterVisible ? 'primary' : 'default'}
                    onClick={() => setFilterVisible(!filterVisible)}
                    style={{ margin: '10px 10px 10px 0' }}
                >
                    {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
                </Button>

                {filterVisible && (
                    <RapportPeriodeFiltrage onFilter={setFilteredDatas} />
                )}

                <Table
                    dataSource={data}
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? 'odd-row' : 'even-row'
                    }
                    bordered
                    size="small"
                    pagination={pagination}
                    loading={loading}
                    onChange={pagination => setPagination(pagination)}
                />
            </div>
        </>
    );
};

export default RapportVehiculePeriode;
