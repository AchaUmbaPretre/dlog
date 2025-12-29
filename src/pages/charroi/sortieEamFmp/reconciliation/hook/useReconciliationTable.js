import { useMemo, useRef, useState } from "react";
import { Tag, Typography } from "antd";
import getColumnSearchProps from "../../../../../utils/columnSearchUtils";

const { Text } = Typography;

export const useReconciliationTable = ({ columnsVisibility, searchText, setSearchText }) => {
  const searchInput = useRef(null);

  return useMemo(() => {
    const allColumns = [
      {
        title: "Code article",
        dataIndex: "code_article",
        key: "code_article",
        fixed: "left",
        width: 150,
        ...getColumnSearchProps('code_article', searchText, setSearchText, null, searchInput),
        render: (value) => <Text strong>{value}</Text>,
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        width: 250,
        ...getColumnSearchProps('description', searchText, setSearchText, null, searchInput),
      },
      {
        title: "Qté EAM",
        dataIndex: "qte_eam",
        key: "qte_eam",
        align: "right",
        width: 120,
        sorter: (a,b) => a.qte_eam - b.qte_eam,
      },
      {
        title: "Qté FMP",
        dataIndex: "qte_fmp",
        key: "qte_fmp",
        align: "right",
        width: 120,
        sorter: (a,b) => a.qte_fmp - b.qte_fmp,
      },
      {
        title: "Écart",
        dataIndex: "ecart",
        key: "ecart",
        align: "center",
        width: 120,
        sorter: (a,b) => a.ecart - b.ecart,
        render: (value) => {
          if (value === 0) return <Tag color="green">0</Tag>;
          if (value > 0) return <Tag color="blue">+{value}</Tag>;
          return <Tag color="red">{value}</Tag>;
        },
      },
      {
        title: "SMR",
        dataIndex: "type_smr",
        key: "type_smr",
        align: "center",
        width: 120,
        render: (value) =>
          value === "SANS_SMR" ? <Tag color="orange">Sans SMR</Tag> : <Tag color="green">Avec SMR</Tag>,
      },
    ];

    // Appliquer la visibilité des colonnes
    const visibleColumns = allColumns.filter(col => columnsVisibility[col.key] !== false);

    return visibleColumns;
  }, [columnsVisibility, searchText]);
};
