import React, { useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Card,
  Empty,
  Tag
} from "antd";
import { PrinterOutlined, SwapOutlined } from "@ant-design/icons";
import { useReconciliationData } from './hook/useReconciliationData';
import { useReconciliationTable } from './hook/useReconciliationTable';
import ReconciliationFilter from './reconciliationFilter/ReconciliationFilter';

const { Search } = Input;
const { Title } = Typography;

const Reconciliation = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });
    const [columnsVisibility, setColumnsVisibility] = useState({
        "Code article": true,
        "Description": true,
        "Qté EAM": true,
        "Qté FMP": true,
        "Ecart": true,
        "SMR": true
    });
    const [searchValue, setSearchValue] = useState("");
    const { data, loading, reload, setFilters } = useReconciliationData(null);
    const [filterVisible, setFilterVisible] = useState(false);

    const columns = useReconciliationTable({ pagination, columnsVisibility });

    // Filtrage par recherche
    const filteredData = useMemo(() => {
        const search = searchValue.toLowerCase().trim();
        if (!search) return data;
        return data.filter(
            item =>
                item.description?.toLowerCase().includes(search) ||
                item.code_article?.toLowerCase().includes(search)
        );
    }, [data, searchValue]);

    // Séparer AVEC / SANS SMR
    const dataAvecSmr = filteredData.filter(r => r.type_smr === "AVEC_SMR");
    const dataSansSmr = filteredData.filter(r => r.type_smr === "SANS_SMR");

    // Totaux
    const calcTotals = (arr) => ({
        qte_eam: arr.reduce((sum, r) => sum + r.qte_eam, 0),
        qte_fmp: arr.reduce((sum, r) => sum + r.qte_fmp, 0),
        ecart: arr.reduce((sum, r) => sum + r.ecart, 0),
    });

    const totalAvecSmr = calcTotals(dataAvecSmr);
    const totalSansSmr = calcTotals(dataSansSmr);

    const handFilter = () => setFilterVisible(v => !v);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        reload(newFilters);
    };

    return (
        <div className="carburant-page">
            <Card
                title={
                    <Space>
                        <SwapOutlined style={{ color: "#52c41a", fontSize: 22 }} />
                        <Title level={4} style={{ margin: 0 }}>Réconciliation</Title>
                    </Space>
                }
                bordered={false}
                className="shadow-sm rounded-2xl"
                extra={
                    <Space wrap>
                        <Search
                            placeholder="Recherche..."
                            allowClear
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ width: 260 }}
                        />
                        <Button type="default" onClick={handFilter}>
                            {filterVisible ? "🚫 Cacher les filtres" : "👁️ Afficher les filtres"}
                        </Button>
                        <Button icon={<PrinterOutlined />}>Imprimer</Button>
                    </Space>
                }
            >
                {filterVisible && <ReconciliationFilter onFilter={handleFilterChange}/>}

                {/* Tableau AVEC SMR */}
                <Card title={`Articles AVEC SMR (Total: EAM=${totalAvecSmr.qte_eam}, FMP=${totalAvecSmr.qte_fmp}, Écart=${totalAvecSmr.ecart})`} style={{ marginBottom: 16 }}>
                    <Table
                        columns={columns}
                        dataSource={dataAvecSmr}
                        rowKey={(record) => record.code_article + record.type_smr}
                        size="middle"
                        loading={loading}
                        pagination={{ ...pagination, showSizeChanger: true, showQuickJumper: true }}
                        onChange={(p) => setPagination(p)}
                        scroll={{ x: 1200 }}
                        rowClassName={() => "row-avec-smr"}
                        locale={{
                            emptyText: <Empty description="Aucune donnée disponible" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                        }}
                        bordered
                    />
                </Card>

                {/* Tableau SANS SMR */}
                <Card title={`Articles SANS SMR (Total: EAM=${totalSansSmr.qte_eam}, FMP=${totalSansSmr.qte_fmp}, Écart=${totalSansSmr.ecart})`}>
                    <Table
                        columns={columns}
                        dataSource={dataSansSmr}
                        rowKey={(record) => record.code_article + record.type_smr}
                        size="middle"
                        loading={loading}
                        pagination={{ ...pagination, showSizeChanger: true, showQuickJumper: true }}
                        onChange={(p) => setPagination(p)}
                        scroll={{ x: 1200 }}
                        rowClassName={() => "row-sans-smr"}
                        locale={{
                            emptyText: <Empty description="Aucune donnée disponible" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                        }}
                        bordered
                    />
                </Card>
            </Card>
        </div>
    );
};

export default Reconciliation;
