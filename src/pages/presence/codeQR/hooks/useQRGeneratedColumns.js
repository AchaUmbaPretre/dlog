import { useMemo } from "react";
import { Space, Tooltip, Button, Tag } from "antd";
import { EyeOutlined, QrcodeOutlined } from "@ant-design/icons";

export const useQRGeneratedColumns = ({
    pagination,
    columnsVisibility,
    onDetail
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
                render: (text) => (
                    <Space>
                        <QrcodeOutlined style={{ color: "#52c41a" }} />
                        <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
                            {text}
                        </span>
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
            },
            {
                title: 'Actions',
                key: 'actions',
                width: '10%',
                fixed: 'right',
                render: (_, record) => (
                    <Tooltip title="Voir les détails">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            aria-label="Voir les détails"
                            style={{ color: "blue" }}
                            onClick={() => onDetail(record.id_qr)}
                        />
                    </Tooltip>
                )
            }
        ];

        return allColumns.filter((col) => columnsVisibility[col.title] !== false);
    }, [pagination, columnsVisibility, onDetail]);
};