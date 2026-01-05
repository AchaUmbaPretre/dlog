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
  Checkbox,
  Dropdown,
  Modal
} from "antd";
import {
  PrinterOutlined,
  SwapOutlined,
  EyeInvisibleOutlined,
  FilterOutlined,
  ReloadOutlined,
  FileTextOutlined,
  DownOutlined,
  MenuOutlined
} from "@ant-design/icons";

import { useReconciliationData } from "./hook/useReconciliationData";
import { useReconciliationTable } from "./hook/useReconciliationTable";
import ReconciliationFilter from "./reconciliationFilter/ReconciliationFilter";
import ReconGlobalItems from "./reconGlobalItems/ReconGlobalItems";
import ReconciliationItems from "./reconciliationItems/ReconciliationItems";

const { Title } = Typography;
const { Panel } = Collapse;

const Reconciliation = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });
  const [searchValue, setSearchValue] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [columnsVisibility, setColumnsVisibility] = useState({
    smr: true,
    "code_article": true,
    "qte_eam": true,
    "qte_physique_eam": false,
    "ecart_logique": true,
    "ecart_physique_eam": false,
    "qte_physique_fmp": false,
    "qte_fmp": true,
    "ecart_physique_fmp": false
  });
  const [modal, setModal] = useState({ type: null, id: null });

  const { data, loading, reload, filters, setFilters} = useReconciliationData(null);
  const openModal = (type, id = '') => setModal({ type, id });
  const closeAllModals = () => setModal({ type: null, id: null });

  const columns = useReconciliationTable({ columnsVisibility, pagination, openModal });

const filteredData = useMemo(() => {
  if (!searchValue.trim()) return data;
  const lowerSearch = searchValue.toLowerCase();

  return data.filter((item) => {
    const description = item.description?.toLowerCase() ?? "";
    const codeArticle = item.code_article?.toLowerCase() ?? "";
    const smr = item.smr != null ? String(item.smr).toLowerCase() : ""; // <-- conversion sécurisée

    return (
      description.includes(lowerSearch) ||
      codeArticle.includes(lowerSearch) ||
      smr.includes(lowerSearch)
    );
  });
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
            <Button icon={<FileTextOutlined />} onClick={() => openModal('Global')}>
              Rapport
            </Button>
            <Button
              type="default"
              icon={filterVisible ? <EyeInvisibleOutlined /> : <FilterOutlined />}
              onClick={() => setFilterVisible((v) => !v)}
            >
              {filterVisible ? "Cacher les filtres" : "Afficher les filtres"}
            </Button>
            <Dropdown overlay={columnMenu} trigger={["click"]}>
                <Button icon={<MenuOutlined />}>
                    Colonnes <DownOutlined />
                </Button>
            </Dropdown>
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
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            sticky
          />
      </Card>

      <Modal
        open={modal.type === "Items"}
        onCancel={closeAllModals}
        footer={null}
        width={950}
        centered
        destroyOnClose
      >
        <ReconciliationItems items={modal.id} dateRange={filters?.dateRange} onSaved={reload} closeModal={closeAllModals} />
      </Modal>

      <Modal
        open={modal.type === "Global"}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
        destroyOnClose
      >
        <ReconGlobalItems filters={filters} onSaved={reload} closeModal={closeAllModals} />
      </Modal>
    </div>
  );
};

export default Reconciliation;
