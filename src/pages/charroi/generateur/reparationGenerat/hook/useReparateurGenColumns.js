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
  TagsOutlined,
  TrademarkOutlined
} from "@ant-design/icons";
import moment from "moment";
import { useMemo } from "react";

export const useReparateurGenColumns = ({pagination, columnsVisibility, onEdit, onDetail, OnDelete}) => {
    return useMemo(() => {
        const allColumns = [
            {
                title:'#',
                dataIndex: 'id',
                key: 'id',
                render: (text, record, index) => {
                const pageSize = pagination.pageSize || 10;
                const pageIndex = pagination.current || 1;
                return (pageIndex - 1) * pageSize + index + 1;
                }
            },
            {
                title: 'Génération',
                dataIndex: 'generation',
                render: (text) => (
                    <div>{text}</div>
                )
            },
            {
                title: 'Modele',
                dataIndex: 'nom_modele',
                render: (text) => (
                    <div>{text}</div>
                )
            },
            {
                title: 'Marque',
                dataIndex: 'nom_marque',
                render: (text) => (
                    <div>{text}</div>
                )
            },
            {
                title: 'Type rep.',
                dataIndex: 'type_rep',
                render: (text) => (
                    <div>{text}</div>
                )
            },
            {
                title: 'Date Entrée',
                dataIndex: 'date_entree',
                render: (text) => {
                    <div>{text}</div>
                }
            },
            {
                title: 'Date Sortie',
                dataIndex: 'date_sortie',
                render: (text) => {
                    <div>{text}</div>
                }
            },
            {
                title: 'Date rep',
                dataIndex: 'date_reparation',
                render: (text) => {
                    <div>{text}</div>
                }
            },
            {
                title: 'Budget',
                dataIndex: 'montant',
                render: (text) => {
                    <div>{text}</div>
                }
            }
        ];
        return allColumns.filter((col)=> columnsVisibility[col.title] !== false);
    }, [pagination, columnsVisibility]);
}