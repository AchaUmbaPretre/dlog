import React, { useMemo, useState } from 'react'
import {
  Table,
  Button,
  Dropdown,
  Input,
  Space,
  Typography,
  Card,
  Empty,
  Checkbox,
  Modal
} from "antd";
import {
  PrinterOutlined,
  InboxOutlined,
  DownOutlined,
  MenuOutlined,
  EyeInvisibleOutlined,
  FilterOutlined
} from "@ant-design/icons";
import { useSortieFmpData } from './hook/useSortieFmpData';
import { useSortieFmpTable } from './hook/useSortieFmpTable';
import SortieFmpDocForm from './sortieFmpDocForm/SortieFmpDocForm';
import { useSortieFmpDocForm } from './sortieFmpDocForm/hook/useSortieFmpDocForm';
import SortieByFmp from './sortieByFmp/SortieByFmp';
import SortieFmpFilter from './sortieFmpFilter/SortieFmpFilter';

const { Search } = Input;
const { Title } = Typography;

const SortieFmp = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [columnsVisibility, setColumnsVisibility] = useState({
    "#": true,
    "PD Code": true,
    "N° GSM": true,
    "N° BE": true,
    "N° Log. GTM": false,
    "Site": true,
    "Item Code": true,
    "Désignation": true,
    "Nb Colis": true,
    "Qté Doc." : false,
    "Écart": false,
    "Doc FMP": false,
    "Unité": false,
    "SMR": true,
    "Différence": false,
    "Colonne 1": false,
    "Commentaire": false,
    "Date sortie" : true
    });
    const [docModalOpen, setDocModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const { data, setData, loading, reload, setFilters } = useSortieFmpData(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [docPhysiqueOk, setDocPhysiqueOk] = useState(false);
    const [qteDocPhysique, setQteDocPhysique] = useState(null);
    const { postDocPhysiqueFmps, loading: loadingDoc } = useSortieFmpDocForm(data, setData, reload);    
    const [modal, setModal] = useState({ type: null, id: null, twoId : null });
    const [filterVisible, setFilterVisible] = useState(false);

    const openDocModal = (record) => {
        setSelectedRow(record);
        setDocPhysiqueOk(record.doc_physique_ok === 1);
        setQteDocPhysique(record.qte_doc_physique);
        setDocModalOpen(true);
    };

    const openModal = (type, id = null, idTwo = null) => setModal({ type, id, idTwo });
    const closeAllModals = () => setModal({ type: null, id: null, idTwo: null });

    const columns = useSortieFmpTable({
        pagination,
        columnsVisibility,
        openDocModal,
        openModal
    });

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

    const filteredData = useMemo(() => {
        const search = searchValue.toLowerCase().trim();
        if (!search) return data;
        return data.filter(
            (item) =>
                item.designation?.toLowerCase().includes(search) || 
                String(item.smr).includes(search)
        );
    }, [data, searchValue]);


    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        reload(newFilters);
    };


  return (
    <div className="carburant-page">
        <Card
            title={
            <Space>
                <InboxOutlined style={{ color: "#fa8c16", fontSize: 22 }} />
                <Title level={4} style={{ margin: 0 }}>
                Sorties FMP
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
                <Dropdown overlay={columnMenu} trigger={["click"]}>
                    <Button icon={<MenuOutlined />}>
                        Colonnes <DownOutlined />
                    </Button>
                </Dropdown>
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
            {filterVisible && <SortieFmpFilter onFilter={handleFilterChange} />}
            <div>
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
            </div>
      </Card>
        <Modal
            title={`Document physique – SMR ${selectedRow?.smr || ""}`}
            open={docModalOpen}
            onCancel={() => setDocModalOpen(false)}
            onOk={() => {
                  postDocPhysiqueFmps({
                  smr : selectedRow.smr,
                  sortie_gsm_num_be : selectedRow.sortie_gsm_num_be,
                  item_code : selectedRow.item_code,
                  docPhysiqueOk,
                  qteDocPhysique
                  });
                  setDocModalOpen(false);
            }}
            okText="Enregistrer"
        >
            <SortieFmpDocForm
                docPhysiqueOk={docPhysiqueOk}
                setDocPhysiqueOk={setDocPhysiqueOk}
                qteDocPhysique={qteDocPhysique}
                setQteDocPhysique={setQteDocPhysique}
            />
        </Modal>

        <Modal
            open= {modal.type === 'View'}
            onCancel={closeAllModals}
            footer={null}
            width={1150}
        >
            <SortieByFmp num_be={modal.id} smr={modal.idTwo} />
      </Modal>
    </div>
  )
}

export default SortieFmp