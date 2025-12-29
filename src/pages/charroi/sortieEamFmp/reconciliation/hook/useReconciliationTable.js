import { useMemo, useRef, useState } from "react";
import { Tag, Typography } from "antd";
import getColumnSearchProps from "../../../../../utils/columnSearchUtils";

const { Text } = Typography;

export const useReconciliationTable = ({
    pagination,
    columnsVisibility
}) => {

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    return useMemo(() => {

        const allColumns = [
            {
                title: "Code article",
                dataIndex: "code_article",
                key: "code_article",
                fixed: "left",
                width: 150,
                ...getColumnSearchProps(
                    'code_article',
                    searchText,
                    setSearchText,
                    setSearchedColumn,
                    searchInput
                ),
                render: (value) => <Text strong>{value}</Text>,
            },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
                ellipsis: true,
                width: 250,
                ...getColumnSearchProps(
                    'description',
                    searchText,
                    setSearchText,
                    setSearchedColumn,
                    searchInput
                ),
            },
            {
                title: "Qté EAM",
                dataIndex: "qte_eam",
                key: "qte_eam",
                align: "right",
                width: 120,
                sorter: (a,b) => a.qte_eam - b.qte_eam,
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
                sorter: (a,b) => a.qte_fmp - b.qte_fmp,
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
                sorter: (a,b) => a.ecart - b.ecart,
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
