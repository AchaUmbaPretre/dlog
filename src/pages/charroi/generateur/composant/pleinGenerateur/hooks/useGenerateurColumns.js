import { useMemo } from "react";
import {
  Button,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Typography
} from "antd";
import {
  EditOutlined,
  CalendarOutlined,
  EyeOutlined,
  DeleteOutlined,
  FireOutlined,
  ThunderboltOutlined,
  TagsOutlined
} from "@ant-design/icons";
import moment from "moment";
import { formatNumber } from "../../../../../../utils/formatNumber";
const { Text } = Typography;

export const useGenerateurColumns = ({
  pagination,
  columnsVisibility,
  onEdit,
  onDetail,
  onDelete,
}) => {
    return useMemo(() => {
        const allColumns = [
            {
                title: "#",
                key: "index",
                width: 40,
                align: "center",
                render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
            },
            {   title:"N° Facture", dataIndex: "num_facture", key: "num_facture"},
            {   title:"N° Pc", dataIndex: "num_pc", key: "num_pc"},
            {
                title: "Date opération",
                dataIndex: "date_operation",
                key: "date_operation",
                sorter: (a, b) =>
                moment(a.date_operation).unix() - moment(b.date_operation).unix(),
                render: (text) => (
                    <Tag icon={<CalendarOutlined />} color="red">
                        {text ? moment(text).format("DD-MM-YYYY") : "Aucune"}
                    </Tag>
                ),
            },
            {   title:"Code groupe", dataIndex: "code_groupe", key: "code_groupe"},
            {   title:"Marque", dataIndex: "nom_marque", key: "nom_marque", render: (text) =><Text type="success">{text}</Text>},
            {
                title: "Modèle",
                dataIndex: "nom_modele",
                key: "nom_modele",
                render: (text) => (
                  <Tag
                    icon={<TagsOutlined />}
                    style={{
                      fontSize: 12,
                      padding: "2px 7px",
                      border: "1px solid #1677ff",
                      background: "transparent",
                      color: "#1677ff",
                    }}
                  >
                    {text}
                  </Tag>
                ),
            },
            {
              title: "Type gen.",
              dataIndex: "nom_type_gen",
              key: "nom_type_gen",
              render: (text) => (
                <Tag
                  icon={<ThunderboltOutlined />}
                  color="blue"
                  style={{ fontSize: 13, padding: "3px 8px" }}
                >
                  {text}
                </Tag>
              ),
            },
            {
                title: "Type carburant",
                dataIndex: "nom_type_carburant",
                key: "nom_type_carburant",
                render: (text) => {
                const isEssence = text?.toLowerCase() === "essence";

                return (
                  <Tag
                    color={isEssence ? "orange" : "purple"}
                    style={{ display: "flex", alignItems: "center", justifyContent:'center', gap: 6 }}
                  >
                    {isEssence ? <FireOutlined /> : <ThunderboltOutlined />}
                    {text}
                  </Tag>
                );
              },
            },
            {   title:"Fournisseur", dataIndex: "nom_fournisseur", key: "nom_fournisseur", align:'center'},
            {   title:"Qté", dataIndex: "quantite_litres", key: "quantite_litres", render: (text) => <Text mark>{formatNumber(text)} L</Text>},
            {
                title: "P.U Usd",
                dataIndex: "prix_usd",
                key: "prix_usd",
                align: "right",
                sorter: (a, b) => a.prix_usd - b.prix_usd,
                sortDirections: ["descend", "ascend"],
                render: (text) => (
                  <Text strong style={{ color: "#1677ff" }}>
                    {text ? formatNumber(text, " $") : "N/A"}
                  </Text>
                ),
            },
            {
                title: "P.U Cdf",
                dataIndex: "prix_cdf",
                key: "prix_cdf",
                align: "right",
                sorter: (a, b) => a.prix_cdf - b.prix_cdf,
                sortDirections: ["descend", "ascend"],
                render: (text) => (
                    <Text strong style={{ color: "#1677ff" }}>
                        {text ? formatNumber(text, " CDF") : "N/A"}
                    </Text>
                ),
            },
            {
                title: "M. ($)",
                dataIndex: "montant_total_usd",
                key: "montant_total_usd",
                align: "right",
                sorter: (a, b) => a.montant_total_usd - b.montant_total_usd,
                sortDirections: ["descend", "ascend"],
                render: (text) => (
                    <Text strong style={{ color: "#1677ff" }}>
                        {text ? formatNumber(text, " $") : "N/A"}
                    </Text>
                ),
            },
            {
                title: "M. (CDF)",
                dataIndex: "montant_total_cdf",
                key: "montant_total_cdf",
                align: "right",
                sorter: (a, b) => a.montant_total_cdf - b.montant_total_cdf,
                sortDirections: ["descend", "ascend"],
                render: (text) => (
                    <Text strong style={{ color: "#1677ff" }}>
                        {text ? formatNumber(text, " CDF") : "N/A"}
                    </Text>
                ),
            },
            {   title:"Crée par", dataIndex: "createur", key: "createur", render: (text) => <Tag>{text}</Tag>},
            {
                title: "Actions",
                key: "action",
                width: "10%",
                render: (_, record) => (
                    <Space size="middle">
                        <Tooltip title="Modifier">
                          <Button
                            icon={<EditOutlined />}
                            style={{ color: "green" }}
                            onClick={() => onEdit(record.id_plein_generateur)}
                            aria-label="Edit generateur"
                          />
                        </Tooltip>
            
                        <Tooltip title="Voir les détails">
                          <Button
                            icon={<EyeOutlined />}
                            aria-label="Voir les détails"
                            style={{ color: "blue" }}
                            onClick={() => onDetail(record.id_carburant)}
                          />
                        </Tooltip>
            
                        <Tooltip title="Supprimer">
                          <Popconfirm
                            title="Êtes-vous sûr de vouloir supprimer cette ligne ?"
                            onConfirm={() => onDelete(record.id_plein_generateur)}
                            okText="Oui"
                            cancelText="Non"
                          >
                            <Button icon={<DeleteOutlined />} style={{ color: "red" }} aria-label="Delete" />
                          </Popconfirm>
                        </Tooltip>
                    </Space>
                ),
            },
        ];
        return allColumns.filter((col) => columnsVisibility[col.title] !== false);
      }, [pagination, columnsVisibility]);
}