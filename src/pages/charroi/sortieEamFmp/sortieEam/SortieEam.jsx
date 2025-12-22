import React, { useState } from 'react'
import {
  Table,
  Button,
  Dropdown,
  Input,
  Space,
  Modal,
  Typography,
  Card,
  notification,
  Empty,
  Checkbox,
  Skeleton,
  message,
} from "antd";
import {
  CarOutlined,
  DashboardOutlined,
  DollarOutlined,
  PrinterOutlined,
  FireOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  DownOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useSortieEamTable } from './hook/useSortieEamTable';

const { Search } = Input;
const { Title } = Typography;

const SortieEam = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [columnsVisibility, setColumnsVisibility] = useState({
        "#": true,
        "Transanction": true,
        "Mois": true,
        "N° transanction": true,
        "Store description": true,
        "Part": true,
        "Part description": true,
        "N° transanction": true,
        "Store description": true,
        "Part": true,
        "Part description": true,
        "Stock type": true,
        "Requisition": true,
        "SMR": true
    });
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [data, setData] = useState([]);

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

  
  return (
    <div className="carburant-page">
        <Card
            title={
            <Space>
                <FireOutlined style={{ color: "#fa541c", fontSize: 22 }} />
                <Title level={4} style={{ margin: 0 }}>
                Gestion des carburants
                </Title>
            </Space>
            }
            bordered={false}
            className="shadow-sm rounded-2xl"
            extra={
            <Space wrap>
                <Search
                placeholder="Recherche chauffeur ou véhicule..."
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
                dataSource={data}
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