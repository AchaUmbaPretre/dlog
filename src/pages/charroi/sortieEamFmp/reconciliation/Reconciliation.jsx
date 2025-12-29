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
  MinusOutlined,
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

  const dataAvecSmr = useMemo(
    () => filteredData.filter((r) => r.type_smr === "AVEC_SMR"),
    [filteredData]
  );

  const dataSansSmr = useMemo(
    () => filteredData.filter((r) => r.type_smr === "SANS_SMR"),
    [filteredData]
  );

  const calcTotals = (arr) => ({
    qte_eam: arr.reduce((s, r) => s + r.qte_eam, 0),
    qte_fmp: arr.reduce((s, r) => s + r.qte_fmp, 0),
    ecart: arr.reduce((s, r) => s + r.ecart, 0),
  });

  const totalAvec = calcTotals(dataAvecSmr);
  const totalSans = calcTotals(dataSansSmr);

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
          title={
            <Space>
              <Tag color="green" icon={<CheckOutlined />}>
                AVEC SMR
              </Tag>
              <Text strong>
                Totaux — EAM: {totalAvec.qte_eam} | FMP:{" "}
                {totalAvec.qte_fmp} | Écart: {totalAvec.ecart}
              </Text>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Table
            columns={columns}
            dataSource={dataAvecSmr}
            rowKey={(r) => r.id_sortie_eam}
            loading={loading}
            pagination={{
              ...paginationAvec,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            onChange={setPaginationAvec}
            locale={{
              emptyText: (
                <Empty description="Aucune donnée AVEC SMR" />
              ),
            }}
            bordered
          />
        </Card>

        <Card
          title={
            <Space>
              <Tag color="orange" icon={<MinusOutlined />}>
                SANS SMR
              </Tag>
              <Text strong>
                Totaux — EAM: {totalSans.qte_eam} | FMP:{" "}
                {totalSans.qte_fmp} | Écart: {totalSans.ecart}
              </Text>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={dataSansSmr}
            rowKey={(r) => r.id_sortie_eam}
            loading={loading}
            pagination={{
              ...paginationSans,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            onChange={setPaginationSans}
            locale={{
              emptyText: (
                <Empty description="Aucune donnée SANS SMR" />
              ),
            }}
            bordered
          />
        </Card>
      </Card>
    </div>
  );           
};

export default Reconciliation;
