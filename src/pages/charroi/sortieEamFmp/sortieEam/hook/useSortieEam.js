import { useMemo } from "react";
import {
  Button,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Typography
} from "antd";

const { Text } = Typography;

export const useSortieEam = ({
    pagination,
    columnVisibility,
    onEdit,
    onDetail,
    onDelete
}) => {
    return useMemo(()=> {
        const allColumns = [
            {
                title: "#",
                key: "index",
                width: 60,
                align: "center",
                render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
            },
            { title: "Transanction", dataIndex: "transanction_date", key: "transanction_date" },
            { title: "Mois", dataIndex: "mois", key: "mois" },
            { title: "N° transanction", dataIndex: "transanction_num", key: "transanction_num" },
            { title: "Store_description", dataIndex: "store_description", key: "store_description" },
            { title: "Part", dataIndex: "part", key: "part" },
            { title: "Part description", dataIndex: "part_description", key: "part_description" },
            { title: "Stock type", dataIndex: "stock_type", key: "stock_type" },
            { title: "Requisition", dataIndex: "requisition", key: "requisition" },


        ]
    })
}