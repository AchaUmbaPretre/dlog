import { useMemo } from "react"

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
                render: (_, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
            },
            {
                title: 'Site',
                dataIndex :'nom_site',
                key: 'nom_site'
            },
            {
                title: 'Zone',
                dataIndex :'NomZone',
                key: 'NomZone'
            },
            {
                title: 'Créée par',
                dataIndex :'nom',
                key: 'nom',
                render: (_, record) => (
                    <Space>
                        {record.nom} - {record.prenom}
                    </Space>
                )
            },
            {
                title :'Actions',
                key: 'actions',
                width: '10%',
                render: (_, record) => {
                    <Tooltip title="Voir les détails">
                        <Button
                            icon={<EyeOutlined />}
                            aria-label="Voir les détails"
                            style={{ color: "blue" }}
                            onClick={() => onDetail(record.id_qr)}
                        />
                    </Tooltip>
                }
            }
        ];

        return allColumns.filter((col) => columnsVisibility[col.title] !== false);
    }, [pagination, columnsVisibility, onDetail])
}