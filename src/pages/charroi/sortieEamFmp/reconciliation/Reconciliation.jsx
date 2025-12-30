// Reconciliation.jsx
import React, { useMemo, useState, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Card,
  Collapse,
  notification,
} from "antd";
import {
  PrinterOutlined,
  SwapOutlined,
  EyeInvisibleOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { useReconciliationData } from "./hook/useReconciliationData";
import { useReconciliationTable } from "./hook/useReconciliationTable";
import ReconciliationFilter from "./reconciliationFilter/ReconciliationFilter";

const { Title } = Typography;
const { Panel } = Collapse;

const Reconciliation = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });
  const [searchValue, setSearchValue] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  const [columnsVisibility] = useState({
    code_article: true,
    description: true,
    qte_eam: true,
    qte_fmp: true,
    ecart: true,
  });

  const { data, loading, reload, setFilters } = useReconciliationData(null);
  const columns = useReconciliationTable({ columnsVisibility });

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    const lowerSearch = searchValue.toLowerCase();
    return data.filter(
      (item) =>
        item.description?.toLowerCase().includes(lowerSearch) ||
        item.code_article?.toLowerCase().includes(lowerSearch)
    );
  }, [data, searchValue]);

  const handleFilterChange = useCallback(
    (filters) => {
      setPagination((p) => ({ ...p, current: 1 }));
      setFilters(filters);
      reload(filters);
      notification.success({
        message: "Filtres appliqués",
        description: "Les filtres ont été appliqués avec succès.",
        placement: "topRight",
      });
    },
    [reload, setFilters]
  );

  const handlePrint = useCallback(() => {
    notification.info({
      message: "Impression",
      description: "La fonctionnalité d'impression a été déclenchée.",
      placement: "topRight",
    });
  }, []);

  const handleReload = useCallback(() => {
    reload();
    notification.success({
      message: "Données rechargées",
      placement: "topRight",
    });
  }, [reload]);

  return (
    <div className="reconciliation-page">
      <Card
        title={
          <Space align="center">
            <SwapOutlined style={{ color: "#1890ff", fontSize: 22 }} />
            <Title level={4} style={{ margin: 0 }}>
              Réconciliation
            </Title>
          </Space>
        }
        extra={
          <Space wrap>
            <Input.Search
              placeholder="Recherche..."
              allowClear
              style={{ width: 260 }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              type="default"
              icon={filterVisible ? <EyeInvisibleOutlined /> : <FilterOutlined />}
              onClick={() => setFilterVisible((v) => !v)}
            >
              {filterVisible ? "Cacher les filtres" : "Afficher les filtres"}
            </Button>
            <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
              Imprimer
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReload}>
              Recharger
            </Button>
          </Space>
        }
      >
        {filterVisible && (
          <Collapse
            defaultActiveKey={["1"]}
            ghost
            style={{ marginBottom: 24 }}
          >
            <Panel key="1" header="Filtres avancés">
              <ReconciliationFilter onFilter={handleFilterChange} />
            </Panel>
          </Collapse>
        )}

        <Card bordered={false}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(r) => `${r.smr}-${r.code_article}`}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            onChange={(pag) => setPagination(pag)}
            bordered
            scroll={{ x: "max-content", y: 500 }}
            sticky
          />
        </Card>
      </Card>
    </div>
  );
};

export default Reconciliation;
