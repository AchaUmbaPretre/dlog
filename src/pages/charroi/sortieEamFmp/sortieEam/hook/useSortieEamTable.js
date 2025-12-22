import { useMemo } from "react";
import {
  Button,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Typography
} from "antd";
import moment from "moment";
import {
  CarOutlined,
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";


const { Text } = Typography;

export const useSortieEamTable = ({
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
            { title: "Transanction", 
              dataIndex: "transanction_date", 
              key: "transanction_date",
              sorter: (a,b) => moment(a.transanction_date).unix() - moment(b.transanction_date).unix,
              render: (text) => (
                <Tag icon={<CalendarOutlined />} color="red">
                    {text ? moment(text).format("DD-MM-YYYY") : "Aucune"}
                </Tag>
              )
            },
            { title: "Mois", dataIndex: "mois", key: "mois" },
            { title: "N° transanction", dataIndex: "transanction_num", key: "transanction_num" },
            { title: "Store description", dataIndex: "store_description", key: "store_description" },
            { title: "Part", dataIndex: "part", key: "part" },
            { title: "Part description", dataIndex: "part_description", key: "part_description" },
            { title: "Stock type", dataIndex: "stock_type", key: "stock_type" },
            { title: "Requisition", dataIndex: "requisition", key: "requisition" },
            { title: "SMR", dataIndex: "smr_ref", key: "smr_ref" },
        ];
        return allColumns.filter((col) => columnVisibility[col.title] !== false);

    }, [pagination, columnVisibility])
}