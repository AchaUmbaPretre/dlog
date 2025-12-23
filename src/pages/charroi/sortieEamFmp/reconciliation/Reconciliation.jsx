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
  Select
} from "antd";
import {
  PrinterOutlined,
  ArrowRightOutlined,
  DownOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { useReconciliationData } from './hook/useReconciliationData'
import { useReconciliationTable } from './hook/useReconciliationTable';

const { Search } = Input;
const { Title } = Typography;

const Reconciliation = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });
    const [columnsVisibility, setColumnsVisibility] = useState({
            "Code article": true,
            "Description": true,
            "Qté EAM": false,
            "Qté FMP": false,
            "Ecart": true
    });
    const [searchValue, setSearchValue] = useState("");
    const { data, loading, smrs, setSelectedSmr } = useReconciliationData(null);

    const columns = useReconciliationTable({
        pagination,
        columnsVisibility
    });

    const filteredData = useMemo(() => {
        const search = searchValue.toLowerCase().trim();
            if(!search) return data;
            return data.filter(
                (item) =>
                    item.part_description?.toLowerCase().includes(search) || 
                    item.designation?.toLowerCase().includes(search)    
            );
    }, [data, searchValue]);

    const smrOptions = useMemo(
        () => 
            smrs?.map((item) => ({
                value: item.smr,
                label: item.smr
            })),
        [smrs]
    );

    console.log(smrs)
  return (
    <>
        <div className="carburant-page">
            <Card
                title={
                <Space>
                    <ArrowRightOutlined style={{ color: "blue", fontSize: 22 }} />
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
                    placeholder="Recherche..."
                    allowClear
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ width: 260 }}
                    />
                    <Button icon={<PrinterOutlined />}>Imprimer</Button>
                </Space>
                }
            >
                <div className="select_rec">
                    <Select
                        mode="multiple"
                        showSearch
                        optionFilterProp="label"
                        style={{ width: "100%" }}
                        options={smrOptions}
                        placeholder="Sélectionnez..."
                        onChange={setSelectedSmr}
                    />
                </div>

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
    </>
  )
}

export default Reconciliation