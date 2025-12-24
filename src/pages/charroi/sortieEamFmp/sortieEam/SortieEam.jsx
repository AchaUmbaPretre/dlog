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
  LogoutOutlined,
  DownOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useSortieEamTable } from './hook/useSortieEamTable';
import { useSortieEamData } from './hook/useSortieEamData';
import SortieEamModal from './sortieEamModal/SortieEamModal';
import { useSortieEamPhysiqueForm } from './sortieEamModal/hook/useSortieEamPhysiqueForm';

const { Search } = Input;
const { Title } = Typography;

const SortieEam = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [columnsVisibility, setColumnsVisibility] = useState({
        "#": true,
        "Date trans.": true,
        "Mois": false,
        "N° transanction": false,
        "Store description": true,
        "Part": true,
        "Part description": true,
        "Stock type": false,
        "Requisition": false,
        "Transanction date 22": false,
        "Purchase": false,
        "Transaction": false,
        "Out": true,
        "IN": true,
        "Site": false,
        "Status": false,
        "Transaction Type26":false,
        "Qté phy." : false,
        "Bulk issue": false,
        "SMR": true
    });
    const [docModalOpen, setDocModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [docPhysiqueOk, setDocPhysiqueOk] = useState(false);
    const [qteDocPhysique, setQteDocPhysique] = useState(null);

    const [searchValue, setSearchValue] = useState("");
    const { data, setData, loading, reload } = useSortieEamData(null);
    const { postDocPhysiqueEams, loading: loadingDoc } = useSortieEamPhysiqueForm(data, setData, reload);

    const openDocModal = (record) => {
        setSelectedRow(record);
        setDocPhysiqueOk(record.doc_physique_ok === 1);
        setQteDocPhysique(record.qte_doc_physique);
        setDocModalOpen(true);
    };

    const columns = useSortieEamTable({
        pagination,
        columnsVisibility,
        openDocModal
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

        return data.filter((item) =>
            (item.store_description?.toLowerCase().includes(search)) ||
            (item.part_description?.toLowerCase().includes(search)) ||
            (String(item.smr_ref).includes(search))  // convertir le nombre en string
        );
    }, [data, searchValue]);
  
  return (
    <div className="carburant-page">
        <Card
            title={
            <Space style={{display:'flex', alignItems:'center'}}>
                <LogoutOutlined style={{ color: "#1677ff", fontSize: 22 }} />
                <Title level={4} style={{ margin: 0 }}>
                Sorties EAM
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
                <Button icon={<PrinterOutlined />}>Imprimer</Button>
            </Space>
            }
        >
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
      <Modal
        title={`Document physique – SMR ${selectedRow?.smr_ref || ""}`}
        open={docModalOpen}
        onCancel={() => setDocModalOpen(false)}
        onOk={() => {
            postDocPhysiqueEams({
            id_sortie_eam: selectedRow.id_sortie_eam,
            smr_ref : selectedRow.smr_ref,
            part : selectedRow.part,
            docPhysiqueOk,
            qteDocPhysique
            });
            setDocModalOpen(false);
        }}
            okText="Enregistrer"
        >
            <SortieEamModal
                docPhysiqueOk={docPhysiqueOk}
                setDocPhysiqueOk={setDocPhysiqueOk}
                qteDocPhysique={qteDocPhysique}
                setQteDocPhysique={setQteDocPhysique}
            />
      </Modal>
    </div>
  )
}

export default SortieEam