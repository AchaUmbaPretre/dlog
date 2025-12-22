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
import { useSortieEamTable } from './hook/useSortieEamTable';
import { useSortieEamData } from './hook/useSortieEamData';

const { Search } = Input;
const { Title } = Typography;

const SortieEam = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [columnsVisibility, setColumnsVisibility] = useState({
        "#": true,
        "Transanction": true,
        "Mois": false,
        "N° transanction": true,
        "Store description": true,
        "Part": true,
        "Part description": true,
        "Stock type": true,
        "Requisition": false,
        "Transanction date 22": false,
        "Purchase": false,
        "Transaction": false,
        "Out": false,
        "IN": false,
        "Site": false,
        "Status": true,
        "Transaction Type26":false,
        "Bulk issue": true,
        "SMR": true
    });
    const [searchValue, setSearchValue] = useState("");
    const { data, loading } = useSortieEamData(null);

    const columns = useSortieEamTable({
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
                item.store_description?.toLowerCase().includes(search) || 
                item.part_description?.toLowerCase().includes(search)
        );
    }, [data, searchValue]);
  
  return (
    <div className="carburant-page">
        <Card
            title={
            <Space>
                <ArrowRightOutlined style={{ color: "blue", fontSize: 22 }} />
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
    </div>
  )
}

export default SortieEam