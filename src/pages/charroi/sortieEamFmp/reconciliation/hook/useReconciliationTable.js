// useReconciliationTable.jsx
import { useMemo } from "react";
import { Tag, Typography } from "antd";

const { Text } = Typography;

export const useReconciliationTable = ({ columnsVisibility }) => {
  return useMemo(() => {
    const allColumns = [
      {
        title: "SMR",
        dataIndex: "smr",
        key: "smr",
        width: 120,
        fixed: "left",
        sorter: (a, b) => a.smr.localeCompare(b.smr),
        render: (v) => <Text strong>{v ?? "N/A"}</Text>,
      },
      {
        title: "Code article",
        dataIndex: "code_article",
        key: "code_article",
        width: 160,
        sorter: (a, b) => a.code_article.localeCompare(b.code_article),
        render: (v) => <Text>{v}</Text>,
      },
      {
        title: "Qté EAM",
        dataIndex: "qte_eam",
        key: "qte_eam",
        align: "right",
        width: 120,
        sorter: (a, b) => a.qte_eam - b.qte_eam,
      },
      {
        title: "Qté FMP",
        dataIndex: "qte_fmp",
        key: "qte_fmp",
        align: "right",
        width: 120,
        sorter: (a, b) => a.qte_fmp - b.qte_fmp,
      },
      {
        title: "Écart",
        dataIndex: "ecart",
        key: "ecart",
        align: "center",
        width: 120,
        sorter: (a, b) => a.ecart - b.ecart,
        render: (v) => {
          if (v === 0) return <Tag color="green">OK</Tag>;
          if (v > 0) return <Tag color="blue">+{v}</Tag>;
          return <Tag color="red">{v}</Tag>;
        },
      },
    ];

    return columnsVisibility
      ? allColumns.filter((c) => columnsVisibility[c.key] !== false)
      : allColumns;
  }, [columnsVisibility]);
};
