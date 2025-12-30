import React, { useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Card,
  Empty,
  Tag,
} from "antd";
import {
  PrinterOutlined,
  SwapOutlined,
  CheckOutlined,
  EyeInvisibleOutlined,
  FilterOutlined
} from "@ant-design/icons";

import { useReconciliationData } from "./hook/useReconciliationData";
import { useReconciliationTable } from "./hook/useReconciliationTable";
import ReconciliationFilter from "./reconciliationFilter/ReconciliationFilter";

const { Search } = Input;
const { Title, Text } = Typography;

const Reconciliation = () => {
  const [paginationAvec, setPaginationAvec] = useState({
    current: 1,
    pageSize: 15,
  });

  const [paginationSans, setPaginationSans] = useState({
    current: 1,
    pageSize: 15,
  });

  const [searchValue, setSearchValue] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  const [columnsVisibility] = useState({
    code_article: true,
    description: true,
    qte_eam: true,
    qte_fmp: true,
    ecart: true,
  });

  const { data, loading, reload, setFilters } =
    useReconciliationData(null);

  const columns = useReconciliationTable({
    setPaginationAvec,
    columnsVisibility,
  });

  const filteredData = useMemo(() => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return data;

    return data.filter(
      (item) =>
        item.description?.toLowerCase().includes(search) ||
        item.code_article?.toLowerCase().includes(search)
    );
  }, [data, searchValue]);


  const handleFilterChange = (filters) => {
    setPaginationAvec((p) => ({ ...p, current: 1 }));
    setPaginationSans((p) => ({ ...p, current: 1 }));
    setFilters(filters);
    reload(filters);
  };

  return (
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
        extra={
          <Space>
            <Search
              placeholder="Recherche..."
              allowClear
              style={{ width: 260 }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
                icon={
                    filterVisible ? <EyeInvisibleOutlined /> : <FilterOutlined />
                }
                onClick={() => setFilterVisible(v => !v)}
            >
                {filterVisible ? "Cacher les filtres" : "Afficher les filtres"}
            </Button>
            <Button icon={<PrinterOutlined />}>Imprimer</Button>
          </Space>
        }
      >
        {filterVisible && (
          <ReconciliationFilter onFilter={handleFilterChange} />
        )}

        <Card
          style={{ marginBottom: 24 }}
        >
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={(r) => `${r.smr}-${r.code_article}`}
                loading={loading}
                pagination={{
                    current: paginationAvec.current,
                    pageSize: paginationAvec.pageSize,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                onChange={setPaginationAvec}
                bordered
            />
        </Card>
      </Card>
    </div>
  );           
};

export default Reconciliation;
