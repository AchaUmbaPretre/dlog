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
  CarOutlined,
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/formatNumber";
import moment from "moment";

const { Text } = Typography;

export const useCarburantColumns = ({
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
        width: 60,
        align: "center",
        render: (_, __, index) =>
          (pagination.current - 1) * pagination.pageSize + index + 1,
      },
      { title: "Num PC", dataIndex: "num_pc", key: "num_pc" },
      { title: "Facture", dataIndex: "num_facture", key: "num_facture" },
      {
        title: "Date op.",
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
      {
        title: "Chauffeur",
        dataIndex: "nom_chauffeur",
        render: (value, record) => (
          <Space>
            <UserOutlined style={{ color: "#a87857ff" }} />
            <Text strong>
              {value && record.prenom ? `${value} ${record.prenom}` : record.commentaire}
            </Text>
          </Space>
        ),
      },
      {
        title: "Marque / Immat.",
        key: "vehicule_marque",
        render: (_, record) => (
          <div>
            <Text strong>{record.nom_marque ?? "N/A"}</Text>
            <br />
            <Tag color="blue">{record.immatriculation ?? "N/A"}</Tag>
          </div>
        ),
        sorter: (a, b) => (a.nom_marque ?? "").localeCompare(b.nom_marque ?? ""),
        width: 180,
      },
      {
        title: "Type vehi.",
        dataIndex: "abreviation",
        key: "abreviation",
        render: (text) => (
          <Space>
            <CarOutlined style={{ color: "#1890ff" }} />
            <Text>{text ?? "N/A"}</Text>
          </Space>
        ),
      },
      { title: "Fournisseur", dataIndex: "nom_fournisseur", key: "nom_fournisseur" },
      {
        title: "Qté (L)",
        dataIndex: "quantite_litres",
        key: "quantite_litres",
        align: "right",
        sorter: (a, b) => a.quantite_litres - b.quantite_litres,
        sortDirections: ["descend", "ascend"],
        render: (text) => <Text>{formatNumber(text)} L</Text>,
      },
      {
        title: "Km actuel",
        dataIndex: "compteur_km",
        key: "compteur_km",
        align: "right",
        sorter: (a, b) => a.compteur_km - b.compteur_km,
        sortDirections: ["descend", "ascend"],
        render: (text) => <Text>{formatNumber(text)} km</Text>,
      },
      {
        title: "Dist. (km)",
        dataIndex: "distance",
        key: "distance",
        align: "right",
        sorter: (a, b) => a.distance - b.distance,
        sortDirections: ["descend", "ascend"],
        render: (text) => <Text>{formatNumber(text)} km</Text>,
      },
      {
        title: "Cons./100km",
        dataIndex: "consommation",
        key: "consommation",
        align: "right",
        sorter: (a, b) => a.consommation - b.consommation,
        sortDirections: ["descend", "ascend"],
        render: (value) => {
          let color = "🟢";
          let statusText = "Normal";

          if (value > 15 && value <= 30) {
            color = "🟡";
            statusText = "À surveiller";
          } else if (value > 30) {
            color = "🔴";
            statusText = "Anormal";
          }

          return (
            <Tooltip title={statusText}>
              <span>
                {formatNumber(value, " L")} / 100km {color}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: "P.U ($)",
        dataIndex: "prix_usd",
        key: "prix_usd",
        align: "right",
        sorter: (a, b) => a.prix_usd - b.prix_usd,
        sortDirections: ["descend", "ascend"],
        render: (text) => <Text>{formatNumber(text, " $")}</Text>,
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
      {
        title: "Créé par",
        dataIndex: "createur",
        key: "createur",
        render: (text) => <Text>{text ?? "N/A"}</Text>,
      },
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
                onClick={() => onEdit(record.id_carburant)}
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
                onConfirm={() => onDelete(record.id_carburant)}
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

    // filter by visibility map (keys are column titles created by caller)
    return allColumns.filter((col) => columnsVisibility[col.title] !== false);
  }, [pagination, columnsVisibility, onEdit, onDetail, onDelete]);
}