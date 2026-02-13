import React, { useState } from 'react'
import { Table, Card, Space, Typography, Input, Button, notification } from "antd";

const { Search } = Input;
const { Text } = Typography;

const DetailKpisPresenceToday = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);

  const columns = [
      {
        title: "#",
        width: '20%',
        align: "center",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Site",
        dataIndex: "nom_site",
        key: "nom_site",
        render: (text) => <Text>{text ?? "N/A"}</Text>,
      },
    ]

  return (
    <>
      <Card
        title="Détail des présents par site"
        bordered={false}
        bodyStyle={{ padding: 16 }}
        extra={
          <Space wrap size="middle">
            <Search
              placeholder="Recherche utilisateur"
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 280 }}
            />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          rowKey="id_utilisateur"
          scroll={{ x: "max-content", y: 600 }}
          size="middle"
          sticky
          bordered
        />
      </Card>
    </>
  )
}

export default DetailKpisPresenceToday