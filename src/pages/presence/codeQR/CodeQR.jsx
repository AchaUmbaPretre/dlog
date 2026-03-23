import React, { useState } from 'react';
import { Card, Space, Table, Button, Dropdown, Checkbox, Input } from 'antd';
import { 
    FireOutlined, 
    ReloadOutlined, 
    MenuOutlined, 
    DownOutlined 
} from '@ant-design/icons';
import { useQRGenerationAll } from './hooks/useQRGenerationAll';
import { useQRGeneratedColumns } from './hooks/useQRGeneratedColumns';

const { Search } = Input;
const { Title } = Typography; // Assurez-vous d'importer Typography

const CodeQR = () => {
    const { loading, data, reload } = useQRGenerationAll();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchValue, setSearchValue] = useState('');
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'ID QR': true,
        'Code QR': true,
        'Site': true,
        'Zone': true,
        'Type Pointage': true,
        'Statut': true,
        'Créée par': true,
        'Date création': true,
        'Dernière modification': true,
        'Actions': true
    });

    const openModal = (type, id) => {
        console.log(`Opening ${type} modal for ID: ${id}`);
        // Implémentez votre logique d'ouverture de modal ici
    };

    const columns = useQRGeneratedColumns({
        pagination,
        columnsVisibility,
        onDetail: (id) => openModal('Detail', id)
    });

    // Filtrer les données en fonction de la recherche
    const filteredData = data.filter(item => {
        if (!searchValue) return true;
        const searchLower = searchValue.toLowerCase();
        return (
            (item.code && item.code.toLowerCase().includes(searchLower)) ||
            (item.nom && `${item.nom} ${item.prenom}`.toLowerCase().includes(searchLower)) ||
            (item.nom_site && item.nom_site.toLowerCase().includes(searchLower)) ||
            (item.NomZone && item.NomZone.toLowerCase().includes(searchLower))
        );
    });

    const columnMenu = (
        <div style={{ padding: 10, background: "#fff", minWidth: 150 }}>
            {Object.keys(columnsVisibility).map((colName) => (
                <div key={colName} style={{ marginBottom: 8 }}>
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
                            Liste des codes QR
                        </Title>
                    </Space>
                }
                bordered={false}
                className="shadow-sm rounded-2xl"
                extra={
                    <Space wrap>
                        <Search
                            placeholder="Rechercher par code QR, créateur, site ou zone..."
                            allowClear
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ width: 300 }}
                        />
                        <Button icon={<ReloadOutlined />} onClick={reload} loading={loading}>
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
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: filteredData.length,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} éléments`,
                        onChange: (page, pageSize) => {
                            setPagination({ current: page, pageSize });
                        }
                    }}
                    scroll={{ x: 'max-content' }}
                    rowKey="id_qr"
                />
            </Card>
        </div>
    );
};

export default CodeQR;