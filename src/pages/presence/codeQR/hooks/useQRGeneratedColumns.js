import { useMemo } from "react";
import { Space, Tooltip, Button, Tag, Typography } from "antd";
import { QrcodeOutlined, ExpandOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const useQRGeneratedColumns = ({
    pagination,
    columnsVisibility,
    onQRCodeClick
}) => {
    return useMemo(() => {
        const allColumns = [
            {
                title: '#',
                key: 'index',
                width: 60,
                align: 'center',
                render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
            },
            {
                title: 'Code QR',
                dataIndex: 'code',
                key: 'code',
                width: 200,
                render: (text, record) => (
                    <Space>
                        <Button
                            type="link"
                            icon={<QrcodeOutlined style={{ fontSize: '20px', color: "#52c41a" }} />}
                            onClick={() => onQRCodeClick(record)}
                            style={{ padding: 0, height: 'auto' }}
                        />
                        <Text 
                            style={{ 
                                fontFamily: "monospace", 
                                fontSize: "12px",
                                cursor: 'pointer',
                                color: '#1890ff'
                            }}
                            onClick={() => onQRCodeClick(record)}
                        >
                            {text?.substring(0, 20)}...
                        </Text>
                        <Tooltip title="Agrandir pour scanner">
                            <Button
                                type="link"
                                icon={<ExpandOutlined />}
                                onClick={() => onQRCodeClick(record)}
                                size="small"
                                style={{ color: "#52c41a" }}
                            />
                        </Tooltip>
                    </Space>
                )
            },
            {
                title: 'Site',
                dataIndex: 'nom_site',
                key: 'nom_site',
                render: (text) => text || '-'
            },
            {
                title: 'Zone',
                dataIndex: 'NomZone',
                key: 'NomZone',
                render: (text) => text || '-'
            },
            {
                title: 'Type Pointage',
                dataIndex: 'type_pointage',
                key: 'type_pointage',
                render: (type) => (
                    <Tag color={type === 'ENTREE_SORTIE' ? 'blue' : 'green'}>
                        {type || '-'}
                    </Tag>
                )
            },
            {
                title: 'Statut',
                dataIndex: 'is_active',
                key: 'is_active',
                render: (active) => (
                    <Tag color={active === 1 ? 'success' : 'error'}>
                        {active === 1 ? 'Actif' : 'Inactif'}
                    </Tag>
                )
            },
            {
                title: 'Créée par',
                dataIndex: 'nom',
                key: 'nom',
                render: (_, record) => (
                    <Space>
                        {record.nom} {record.prenom}
                    </Space>
                )
            },
            {
                title: 'Date création',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (date) => date ? new Date(date).toLocaleString() : '-'
            }
        ];

        return allColumns.filter((col) => columnsVisibility[col.title] !== false);
    }, [pagination, columnsVisibility, onQRCodeClick]);
};