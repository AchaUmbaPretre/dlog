import { useState, useMemo } from "react";
import { Input, DatePicker, Table, Select, Card, Space } from "antd";
import { usePresenceAllData } from "./hooks/usePresenceAllData";
import { usePresenceAllColumns } from "./hooks/usePresenceAllColumns";

const { RangePicker } = DatePicker;
const { Search } = Input;

const PresenceAll = () => {
  const [searchValue, setSearchValue] = useState("");
  const { presences, sites, loading, dateRange, setDateRange, siteData, setSiteData } =
    usePresenceAllData();

  const columns = usePresenceAllColumns();

  const filteredData = useMemo(() => {
    if (!searchValue) return presences;
    return presences.filter((item) =>
      item.nom?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [presences, searchValue]);

  return (
    <Card
      bordered={false}
      title="Liste des présences"
      extra={
        <Space wrap>
          <RangePicker value={dateRange} onChange={setDateRange} format="DD/MM/YYYY" />
          <Select
            allowClear
            showSearch
            options={sites.map((item) => ({
              value: item.id_site,
              label: item.nom_site,
            }))}
            onChange={setSiteData}
            placeholder="Sélectionnez un site..."
            style={{ width: 200 }}
          />
          <Search
            placeholder="Recherche utilisateur"
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 250 }}
          />
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 15 }}
        rowKey="id_presence"
        bordered
        size="middle"
        scroll={{ x: 700 }}
        rowClassName={(_, index) => (index % 2 === 0 ? "odd-row" : "even-row")}
      />
    </Card>
  );
};

export default PresenceAll;
