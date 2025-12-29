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
  Checkbox,
  Dropdown
} from "antd";
import {
  PrinterOutlined,
  SwapOutlined,
  FilterOutlined,
  MinusOutlined,
  CheckOutlined,
  DownOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useReconciliationData } from "./hook/useReconciliationData";
import { useReconciliationTable } from "./hook/useReconciliationTable";
import ReconciliationFilter from "./reconciliationFilter/ReconciliationFilter";

const { Search } = Input;
const { Title, Text } = Typography;

const Reconciliation = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });
  const [columnsVisibility, setColumnsVisibility] = useState({
    code_article: true,
    description: true,
    qte_eam: true,
    qte_fmp: true,
    ecart: true,
    type_smr: false,
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
      (item) =>
        item.description?.toLowerCase().includes(search) ||
        item.code_article?.toLowerCase().includes(search)
    );
  }, [data, searchValue]);

  // Séparer AVEC / SANS SMR
  const dataAvecSmr = filteredData.filter((r) => r.type_smr === "AVEC_SMR");
  const dataSansSmr = filteredData.filter((r) => r.type_smr === "SANS_SMR");

  // Totaux
  const calcTotals = (arr) => ({
    qte_eam: arr.reduce((sum, r) => sum + r.qte_eam, 0),
    qte_fmp: arr.reduce((sum, r) => sum + r.qte_fmp, 0),
    ecart: arr.reduce((sum, r) => sum + r.ecart, 0),
  });

  const totalAvecSmr = calcTotals(dataAvecSmr);
  const totalSansSmr = calcTotals(dataSansSmr);

  const handleFilterToggle = () => setFilterVisible((v) => !v);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    reload(newFilters);
  };

    const columnMenu = (
        <div style={{ padding: 10, background: "#fff" }}>
        {Object.keys(columnsVisibility).map((colName) => (
            <div key={colName}>
            <Checkbox
                checked={columnsVisibility[colName]}
                onChange={() =>
                setColumnsVisibility((prev) => ({ ...prev, [colName]: !prev[colName] }))
                }
            >
                {colName}
            </Checkbox>
            </div>
        ))}
        </div>
    );

  const tableFooter = (totals) => (
    <Space size="large" style={{ fontWeight: 600 }}>
      <Text strong>Total EAM: {totals.qte_eam}</Text>
      <Text strong>Total FMP: {totals.qte_fmp}</Text>
      <Text strong>Total Écart: {totals.ecart}</Text>
    </Space>
  );

  return (
    <div className="carburant-page" style={{ padding: 24 }}>
      <Card
        title={
          <Space>
            <SwapOutlined style={{ color: "#1890ff", fontSize: 22 }} />
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
              placeholder="Recherche par article ou description..."
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 280 }}
            />
            <Dropdown overlay={columnMenu} trigger={["click"]}>
                <Button icon={<MenuOutlined />}>
                    Colonnes <DownOutlined />
                </Button>
            </Dropdown>
            <Button
              type={filterVisible ? "primary" : "default"}
              icon={<FilterOutlined />}
              onClick={handleFilterToggle}
            >
              {filterVisible ? "Masquer les filtres" : "Afficher les filtres"}
            </Button>
            <Button icon={<PrinterOutlined />} type="default">
              Imprimer
            </Button>
          </Space>
        }
      >
        {filterVisible && (
          <ReconciliationFilter
            onFilter={handleFilterChange}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Tableau AVEC SMR */}
        <Card
          title={
            <Space>
              <Tag color="green" icon={<CheckOutlined />}>
                AVEC SMR
              </Tag>
              <Text strong>
                Totaux - EAM: {totalAvecSmr.qte_eam}, FMP: {totalAvecSmr.qte_fmp}, Écart:{" "}
                {totalAvecSmr.ecart}
              </Text>
            </Space>
          }
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          <Table
            columns={columns}
            dataSource={dataAvecSmr}
            rowKey={(record) => record.code_article + record.type_smr}
            size="middle"
            loading={loading}
            pagination={{ ...pagination, showSizeChanger: true, showQuickJumper: true }}
            onChange={(p) => setPagination(p)}
            scroll={{ x: 1200 }}
            locale={{
              emptyText: <Empty description="Aucune donnée disponible" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
            }}
            bordered
            footer={() => tableFooter(totalAvecSmr)}
          />
        </Card>

        {/* Tableau SANS SMR */}
        <Card
          title={
            <Space>
              <Tag color="orange" icon={<MinusOutlined />}>
                SANS SMR
              </Tag>
              <Text strong>
                Totaux - EAM: {totalSansSmr.qte_eam}, FMP: {totalSansSmr.qte_fmp}, Écart:{" "}
                {totalSansSmr.ecart}
              </Text>
            </Space>
          }
          bordered={false}
        >
          <Table
            columns={columns}
            dataSource={dataSansSmr}
            rowKey={(record) => record.code_article + record.type_smr}
            size="middle"
            loading={loading}
            pagination={{ ...pagination, showSizeChanger: true, showQuickJumper: true }}
            onChange={(p) => setPagination(p)}
            scroll={{ x: 1200 }}
            locale={{
              emptyText: <Empty description="Aucune donnée disponible" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
            }}
            bordered
            footer={() => tableFooter(totalSansSmr)}
          />
        </Card>
      </Card>
    </div>
  );
};

export default Reconciliation;
