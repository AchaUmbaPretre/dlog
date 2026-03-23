import React, { useState } from 'react'
import { useQRGenerationAll } from './hooks/useQRGenerationAll'
import { useQRGeneratedColumns } from './hooks/useQRGeneratedColumns';
import { Space } from 'antd';

const CodeQR = () => {
    const { loading, data } = useQRGenerationAll();
    const [setPagination, pagination] = useState({ current: 1, pageSize: 10 });
    const [setSearchValue, searchValue] = useState('');

    const columns = useQRGeneratedColumns({
        pagination,
        columnsVisibility,
        onDetail: (id) => openModal('Detail', id)
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
            title= {
                <Space>
                    <FireOutlined style={{ color: "#fa541c", fontSize: 22 }} />
                    <Title level={4} style={{ margin: 0 }}>
                        Liste des codes QR
                    </Title>
                </Space>
            }
            bordered={false}
            className="shadow-sm rounded-2xl"
            extra= {
                <Space wrap>
                    <Search
                        placeholder="Recherche chauffeur ou véhicule..."
                        allowClear
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{ width: 260 }}
                    />
                    <Button icon={<ReloadOutlined />} onClick={() => reload()} loading={loading}>
                        Actualiser
                    </Button>

                    <Dropdown overlay={columnMenu} trigger={["click"]}>
                        <Button icon={<MenuOutlined />}>
                            Colonnes <DownOutlined />
                        </Button>
                    </Dropdown>
                </Space>
            }
        >

        </Card>
    </div>
  )
}

export default CodeQR