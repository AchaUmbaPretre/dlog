import { useMemo } from "react";
import { Tag, Typography, Space, Tooltip } from "antd";
import {
  ThunderboltOutlined,
  FileTextOutlined,
  BoxPlotOutlined,
  CarOutlined,
  InboxOutlined
} from "@ant-design/icons";
import { renderEcartTag } from "../service/reconcialtionService";

const { Text } = Typography;

export const useReconciliationTable = ({ columnsVisibility, pagination, openModal }) => {
  return useMemo(() => {
    const allColumns = [
      {
            title: "#",
            key: "index",
            width: 15,
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
      },
      {
        title: (
          <Tooltip title="Identifiant SMR">
            <Space>
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
        render: (v) => (
            <Tag
                color="green"
                icon={<InboxOutlined />}
            >
                {v ?? "N/A"}
            </Tag>
        )
      },
      {
        title: (
          <Tooltip title="Code de l'article">
            <Space>
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
        render: (v) => <Text onClick={() => openModal('Items', v)}>{v ?? "N/A"}</Text>,
      },
      {
        title: (
          <Tooltip title="Quantité selon EAM">
            <Space>
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
            <Tooltip title="Quantité physique constatée (EAM)">
            <Space>
                <BoxPlotOutlined style={{ color: "#722ed1" }} />
                Qté Phys. EAM
            </Space>
            </Tooltip>
        ),
        dataIndex: "qte_physique_eam",
        key: "qte_physique_eam",
        align: "right",
        width: 140,
        sorter: (a, b) =>
            (a.qte_physique_eam ?? 0) - (b.qte_physique_eam ?? 0),
      },

      {
        title: (
          <Tooltip title="Quantité selon FMP">
            <Space>
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
        dataIndex: "ecart_logique",
        key: "ecart_logique",
        align: "center",
        width: 120,
        sorter: (a, b) => (a.ecart_logique ?? 0) - (b.ecart ?? 0),
        render: renderEcartTag,
      },
      {
        title: (
            <Tooltip title="Écart entre EAM et Physique (EAM)">
            Écart Phys. EAM
            </Tooltip>
        ),
        dataIndex: "ecart_physique_eam",
        key: "ecart_physique_eam",
        align: "center",
        width: 140,
        sorter: (a, b) =>
            (a.ecart_physique_eam ?? 0) - (b.ecart_physique_eam ?? 0),
        render: renderEcartTag,
      },
      {
        title: (
            <Tooltip title="Quantité physique constatée (FMP)">
            <Space>
                <CarOutlined style={{ color: "#13c2c2" }} />
                Qté Phys. FMP
            </Space>
            </Tooltip>
        ),
        dataIndex: "qte_physique_fmp",
        key: "qte_physique_fmp",
        align: "right",
        width: 140,
        sorter: (a, b) =>
            (a.qte_physique_fmp ?? 0) - (b.qte_physique_fmp ?? 0),
      },
      {
        title: (
            <Tooltip title="Écart entre FMP et Physique">
            Écart Phys. FMP
            </Tooltip>
        ),
        dataIndex: "ecart_physique_fmp",
        key: "ecart_physique_fmp",
        align: "center",
        width: 140,
        sorter: (a, b) =>
            (a.ecart_physique_fmp ?? 0) - (b.ecart_physique_fmp ?? 0),
        render: renderEcartTag,
      }
    ];

    return columnsVisibility
      ? allColumns.filter((c) => columnsVisibility[c.key] !== false)
      : allColumns;
  }, [columnsVisibility]);
};
