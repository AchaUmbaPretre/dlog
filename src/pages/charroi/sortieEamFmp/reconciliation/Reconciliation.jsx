import React, { useMemo, useState } from 'react'
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Card,
  Empty,
  Select
} from "antd";
import {
  PrinterOutlined,
  SwapOutlined
} from "@ant-design/icons";
import { useReconciliationData } from './hook/useReconciliationData'
import { useReconciliationTable } from './hook/useReconciliationTable';
import ReconciliationFilter from './reconciliationFilter/ReconciliationFilter';

const { Search } = Input;
const { Title } = Typography;

const Reconciliation = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });
    const [columnsVisibility, setColumnsVisibility] = useState({
        "Code article": true,
        "Description": true,
        "Qté EAM": false,
        "Qté FMP": false,
        "Ecart": true
    });
    const [searchValue, setSearchValue] = useState("");
    const { data, loading, reload, setFilters } = useReconciliationData(null);
    const [filterVisible, setFilterVisible] = useState(false);

    const columns = useReconciliationTable({
        pagination,
        columnsVisibility
    });

    const filteredData = useMemo(() => {
        const search = searchValue.toLowerCase().trim();
            if(!search) return data;
            return data.filter(
                (item) =>
                    item.part_description?.toLowerCase().includes(search) || 
                    item.designation?.toLowerCase().includes(search)    
            );
    }, [data, searchValue]);

    const handFilter = () => {
        setFilterVisible((v) => !v);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        reload(newFilters);
    };

  return (
    <>
        <div className="carburant-page">
            <Card
                title={
                <Space>
                    <SwapOutlined style={{ color: "#52c41a", fontSize: 22 }} />
                    <Title level={4} style={{ margin: 0 }}>
                    Réconciliation
                    </Title>
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
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey={(record) => record.id_sortie_eam}
                    size="middle"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `${total} enregistrements`,
                    }}
                    onChange={(p) => setPagination(p)}
                    scroll={{ x: 1100 }}
                    rowClassName={(record, index) => (index % 2 === 0 ? "odd-row" : "even-row")}
                    locale={{
                        emptyText: <Empty description="Aucune donnée disponible" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                    }}
                    bordered
                />
        </Card>
        </div>
    </>
  )
}

export default Reconciliation