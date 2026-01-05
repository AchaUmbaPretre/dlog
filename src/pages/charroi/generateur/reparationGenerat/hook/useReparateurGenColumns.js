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
  TrademarkOutlined,
  ToolOutlined,
  DollarCircleOutlined,
  MoreOutlined,
  ShopOutlined,
  UserOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";

import moment from "moment";
import { useMemo } from "react";
import { statusIcons, statutIcons } from "../../../../../utils/prioriteIcons";

export const useReparateurGenColumns = ({
  pagination,
  columnsVisibility,
  onEdit,
  onDetail,
  onDelete
}) => {
  return useMemo(() => {
    const allColumns = [
      {
        title: (
          <Space>
            #
          </Space>
        ),
        key: "index",
        render: (_, __, index) => {
          const pageSize = pagination.pageSize || 10;
          const pageIndex = pagination.current || 1;
          return (pageIndex - 1) * pageSize + index + 1;
        }
      },
      {
        title: (
          <Space>
            <TrademarkOutlined />
            N° série
          </Space>
        ),
        dataIndex: "num_serie",
        key: "num_serie",
        render: (text) => text || "—"
      },
      {
        title: (
          <Space>
            <ThunderboltOutlined />
            Modèle
          </Space>
        ),
        dataIndex: "nom_modele",
        key: "nom_modele",
        render : (text) => (
            <Tag color='blue' bordered={false}>
                {text}
            </Tag>
        )
      },
      {
        title: (
          <Space>
            <FireOutlined style={{ color: "#cf1322" }} />
            Marque
          </Space>
        ),
        dataIndex: "nom_marque",
        key: "nom_marque",
        render: (text) => (
            <Tag color='magenta' bordered={false}>
                {text}
            </Tag>
        )
      },
      {
        title: (
          <Space>
            <ToolOutlined />
            Type rep.
          </Space>
        ),
        dataIndex: "type_rep",
        key: "type_rep",
        render: (text) => (
          <Tag  icon={<ToolOutlined spin />} color='volcano' bordered={false}>
            {text}
          </Tag>
        )
      },
      {
        title: (
          <Space>
            <CalendarOutlined />
            Date Entrée
          </Space>
        ),
        dataIndex: "date_entree",
        key: "date_entree",
        sorter: (a, b) =>
          moment(a.date_entree).unix() - moment(b.date_entree).unix(),
        render: (text) => (
          <Tag icon={<CalendarOutlined />} color="volcano">
            {text ? moment(text).format("DD-MM-YYYY") : "Aucune"}
          </Tag>
        )
      },
      {
        title: (
          <Space>
            <CalendarOutlined />
            Date Sortie
          </Space>
        ),
        dataIndex: "date_sortie",
        key: "date_sortie",
        render: (text) =>
          text ? (
            <Tag color="cyan">{moment(text).format("DD-MM-YYYY")}</Tag>
          ) : "—"
      },
      {
        title: (
          <Space>
            <CalendarOutlined />
            Date rep
          </Space>
        ),
        dataIndex: "date_reparation",
        key: "date_reparation",
        render: (text) =>
          text ? (
            <Tag color="blue">{moment(text).format("DD-MM-YYYY")}</Tag>
          ) : "—"
      },
      {
        title: (
          <Space>
            <ShopOutlined />
            Fournisseur
          </Space>
        ),
        dataIndex: "nom_fournisseur",
        key: "nom_fournisseur",
        align: 'center',
        render: (text) => (
            <Tag style={{fontSize:14}}>
                <ShopOutlined style={{ marginRight: 5, color: '#52c41a' }} />
                {text}
            </Tag>
        )
      },
      {
        title: 'État',
        dataIndex: 'nom_type_statut',
        render: (text) => {
        const {icon, color } = statutIcons(text)
            return (
                <Tag icon={icon} color={color} style={{ fontWeight: 500 }}>
                    {text}
                </Tag>
                );
            },
        }, 
      {
        title: (
          <Space>
            <InfoCircleOutlined />
            Statut
          </Space>
        ),
        dataIndex: "nom_statut_vehicule",
        key: "nom_statut_vehicule",
        render: (text) => {
            const { icon, color } = statusIcons[text] || {};
            return (
                <Space>
                    <Tag icon={icon} color={color}>{text}</Tag>
                </Space>
            )
            
        }
      },
      {
        title: (
          <Space>
            <DollarCircleOutlined />
            Coût
          </Space>
        ),
        dataIndex: "cout",
        key: "cout",
        align: 'right',
        render: (text) => (
          <Tag color="green">
            {text?.toLocaleString()} $
          </Tag>
        )
      },
      {
        title: (
          <Space>
            <DollarCircleOutlined />
            Montant
          </Space>
        ),
        dataIndex: "montant",
        key: "montant",
        align: 'right',
        render: (text) => (
          <Typography.Text strong style={{ color: "#389e0d" }}>
            {text?.toLocaleString()} $
          </Typography.Text>
        )
      },
      {
        title: (
          <Space>
            <UserOutlined />
            Créé par
          </Space>
        ),
        dataIndex: "nom_createur",
        key: "nom_createur",
        align: 'center'
      },
      {
        title: (
          <Space>
            <MoreOutlined />
            Actions
          </Space>
        ),
        key: "action",
        width: "10%",
        render: (_, record) => (
          <Space>
            <Tooltip title="Modifier">
              <Button
                icon={<EditOutlined />}
                type="text"
                style={{ color: "#52c41a" }}
                onClick={() => onEdit(record.id_reparations_generateur)}
              />
            </Tooltip>

            <Tooltip title="Détails">
              <Button
                icon={<EyeOutlined />}
                type="text"
                style={{ color: "#1677ff" }}
                onClick={() => onDetail(record.id_reparations_generateur)}
              />
            </Tooltip>

            <Popconfirm
              title="Confirmer la suppression ?"
              onConfirm={() => onDelete(record.id_reparations_generateur)}
            >
              <Button
                icon={<DeleteOutlined />}
                type="text"
                danger
              />
            </Popconfirm>
          </Space>
        )
      }
    ];

    return allColumns.filter(
      (col) => columnsVisibility[col.title?.props?.children?.[1]] !== false
    );
  }, [pagination, columnsVisibility]);
};
