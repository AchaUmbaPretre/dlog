import { useMemo } from "react";
import { Tag, Typography } from "antd";

const { Text } = Typography;

export const useReconciliationTable = ({
    pagination,
    columnsVisibility
}) => {
    return useMemo(() => {

        const allColumns = [
            {
                title: "Code article",
                dataIndex: "code_article",
                key: "code_article",
                fixed: "left",
                width: 150,
                render: (value) => <Text strong>{value}</Text>,
            },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
                ellipsis: true,
                width: 250,
            },
            {
                title: "Qté EAM",
                dataIndex: "qte_eam",
                key: "qte_eam",
                align: "right",
                width: 120,
                render: (value) => (
                    <Text>{value}</Text>
                ),
            },
            {
                title: "Qté FMP",
                dataIndex: "qte_fmp",
                key: "qte_fmp",
                align: "right",
                width: 120,
                render: (value) => (
                    <Text>{value}</Text>
                ),
            },
            {
                title: "Écart",
                dataIndex: "ecart",
                key: "ecart",
                align: "center",
                width: 120,
                render: (value) => {
                    if (value === 0) {
                        return <Tag color="green">0</Tag>;
                    }
                    if (value > 0) {
                        return <Tag color="blue">+{value}</Tag>;
                    }
                    return <Tag color="red">{value}</Tag>;
                },
            },
        ];

        // Gestion optionnelle de visibilité dynamique
        const visibleColumns = columnsVisibility
            ? allColumns.filter(col => columnsVisibility[col.key] !== false)
            : allColumns;

        return visibleColumns;

    }, [pagination, columnsVisibility]);
};
