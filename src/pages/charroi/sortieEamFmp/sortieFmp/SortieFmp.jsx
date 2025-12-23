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
  Checkbox
} from "antd";
import {
  PrinterOutlined,
  ArrowRightOutlined,
  DownOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useSortieFmpData } from './hook/useSortieFmpData';
import { useSortieFmpTable } from './hook/useSortieFmpTable';

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
    "Unité": false,
    "SMR": true,
    "Différence": false,
    "Colonne 1": false,
    "Commentaire": false
    });
    const [searchValue, setSearchValue] = useState("");
    const { data, loading } = useSortieFmpData(null);

    const columns = useSortieFmpTable({
        pagination,
        columnsVisibility
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
        if(!search) return data;
        return data.filter(
            (item) =>
                item.designation?.toLowerCase().includes(search)
        );
    }, [data, searchValue]);
  
  return (
    <div className="carburant-page">
        <Card
            title={
            <Space>
                <ArrowRightOutlined style={{ color: "blue", fontSize: 22 }} />
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
    </div>
  )
}

export default SortieFmp