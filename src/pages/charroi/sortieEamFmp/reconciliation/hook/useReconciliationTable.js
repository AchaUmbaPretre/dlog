// useReconciliationTable.jsx
import { useMemo } from "react";
import { Tag, Typography, Space, Tooltip } from "antd";
import {
  ThunderboltOutlined,
  FileTextOutlined,
  BoxPlotOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export const useReconciliationTable = ({ columnsVisibility }) => {
  return useMemo(() => {
    const allColumns = [
      {
        title: (
          <Tooltip title="Identifiant SMR">
            <Space style={{ color: "#722ed1" }}>
              <ThunderboltOutlined style={{ color: "#722ed1" }} />
              SMR
            </Space>
          </Tooltip>
        ),
        dataIndex: "smr",
        key: "smr",
        width: 120,
        fixed: "left",
        sorter: (a,b) => a.smr - b.smr,
        render: (v) => <Text strong>{v ?? "N/A"}</Text>,
      },
      {
        title: (
          <Tooltip title="Code de l'article">
            <Space style={{ color: "#fa8c16" }}>
              <FileTextOutlined style={{ color: "#fa8c16" }} />
              Code article
            </Space>
          </Tooltip>
        ),
        dataIndex: "code_article",
        key: "code_article",
        width: 160,
        sorter: (a, b) =>
          (a.code_article ?? "").localeCompare(b.code_article ?? ""),
        render: (v) => <Text>{v ?? "N/A"}</Text>,
      },
      {
        title: (
          <Tooltip title="Quantité selon EAM">
            <Space style={{ color: "#1890ff" }}>
              <BoxPlotOutlined style={{ color: "#1890ff" }} />
              Qté EAM
            </Space>
          </Tooltip>
        ),
        dataIndex: "qte_eam",
        key: "qte_eam",
        align: "right",
        width: 120,
        sorter: (a, b) => (a.qte_eam ?? 0) - (b.qte_eam ?? 0),
      },
      {
        title: (
          <Tooltip title="Quantité selon FMP">
            <Space style={{ color: "#52c41a" }}>
              <CarOutlined style={{ color: "#52c41a" }} />
              Qté FMP
            </Space>
          </Tooltip>
        ),
        dataIndex: "qte_fmp",
        key: "qte_fmp",
        align: "right",
        width: 120,
        sorter: (a, b) => (a.qte_fmp ?? 0) - (b.qte_fmp ?? 0),
      },
      {
        title: (
          <Tooltip title="Écart entre EAM et FMP">
            Écart
          </Tooltip>
        ),
        dataIndex: "ecart",
        key: "ecart",
        align: "center",
        width: 120,
        sorter: (a, b) => (a.ecart ?? 0) - (b.ecart ?? 0),
        render: (v) => {
          if (v === 0)
            return (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                OK
              </Tag>
            );
          if (v > 0 && v <= 5)
            return (
              <Tag color="#40a9ff" icon={<ExclamationCircleOutlined />}>
                +{v}
              </Tag>
            );
          if (v > 5 && v <= 10)
            return (
              <Tag color="#faad14" icon={<ExclamationCircleOutlined />}>
                +{v}
              </Tag>
            );
          return (
            <Tag color="#f5222d" icon={<CloseCircleOutlined />}>
              {v}
            </Tag>
          );
        },
      },
    ];

    return columnsVisibility
      ? allColumns.filter((c) => columnsVisibility[c.key] !== false)
      : allColumns;
  }, [columnsVisibility]);
};
