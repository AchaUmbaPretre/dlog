import { useMemo, useRef, useState } from "react";
import {
  Tag
} from "antd";
import moment from "moment";
import {
  CalendarOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  LogoutOutlined,
  RollbackOutlined,
  DatabaseOutlined,
  NumberOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined
} from "@ant-design/icons";
import getColumnSearchProps from "../../../../../utils/columnSearchUtils";

export const useSortieEamTable = ({
    pagination,
    columnsVisibility
}) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
  
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
            { title: "SMR", 
              dataIndex: "smr_ref", 
              key: "smr_ref",
              ...getColumnSearchProps(
                  'smr_ref',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
              render: (v) => (
                <Tag color="green" icon={<InboxOutlined />}>
                  {v ?? 'N/A'}
                </Tag>
              )
            },
            { title: "Mois", dataIndex: "mois", key: "mois" },
            {
              title: "N° transanction",
              dataIndex: "transanction_num",
              key: "transanction_num",
              ...getColumnSearchProps(
                  'transanction_num',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
              render: (value) => (
                <Tag color="geekblue" icon={<NumberOutlined />}>
                  {value}
                </Tag>
              ),
            },
            { title: "Part", 
              dataIndex: "part", 
              key: "part",
              ...getColumnSearchProps(
                  'part',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
            },
            { title: "Part description", 
              dataIndex: "part_description", 
              key: "part_description",
              ...getColumnSearchProps(
                  'part_description',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
            },
            { title: "Store description", 
              dataIndex: "store_description", 
              key: "store_description",
              ...getColumnSearchProps(
                  'store_description',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
            },
            {
              title: "Stock type",
              dataIndex: "stock_type",
              key: "stock_type",
              ...getColumnSearchProps(
                  'stock_type',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
              render: (type) =>
                type === "Stock" ? (
                  <Tag color="blue" icon={<DatabaseOutlined />}>
                    Stock
                  </Tag>
                ) : (
                  <Tag>{type}</Tag>
                )
            },
            { title: "Requisition", dataIndex: "requisition", key: "requisition" },
            { 
                title: "Transanction date 22", 
                dataIndex: "transaction_date22", 
                key: "transaction_date22",
                sorter: (a,b) => moment(a.transaction_date22).unix() - moment(b.transaction_date22).unix(),
                render: (text) => (
                    <Tag icon={<CalendarOutlined />} color="blue">
                        {text ? moment(text).format("DD-MM-YYYY") : "Aucune"}
                    </Tag>
                )
            },
            { title: "Purchase", 
              dataIndex: "purchase", 
              key: "purchase",
              ...getColumnSearchProps(
                  'purchase',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
            },
            { title: "Transaction", 
              dataIndex: "transaction", 
              key: "transaction",
              sorter: (a,b) => a.transaction - b.transaction
            },
            { title: "Out", 
              dataIndex: "total_quantite_out", 
              key: "total_quantite_out",
              sorter: (a,b) => a.total_quantite_out - b.total_quantite_out,
              render: (text) => (
                <Tag color="red" icon={<ArrowDownOutlined />}>
                  {text}
                </Tag>
              )
            },
            { title: "IN", 
              dataIndex: "total_quantite_in", 
              key: "total_quantite_in",
              sorter: (a,b) => a.total_quantite_in - b.total_quantite_in,
              render: (text) => (
                <Tag color="green" icon={<ArrowUpOutlined />}>
                  {text}
                </Tag>
              )
            },
            { title: "Site", 
              dataIndex: "site", 
              key: "site",
              ...getColumnSearchProps(
                  'site',
                  searchText,
                  setSearchText,
                  setSearchedColumn,
                  searchInput
              ),
            },
            {
              title: "Status",
              dataIndex: "transaction_status25",
              key: "transaction_status25",
              render: (status) => {
                switch (status) {
                  case "Approved":
                    return (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        Approved
                      </Tag>
                    );

                  case "Pending":
                    return (
                      <Tag color="orange" icon={<ClockCircleOutlined />}>
                        Pending
                      </Tag>
                    );

                  case "Rejected":
                    return (
                      <Tag color="red" icon={<CloseCircleOutlined />}>
                        Rejected
                      </Tag>
                    );

                  default:
                    return <Tag>{status}</Tag>;
                }
              }
            },
            {
              title: "Transaction Type26",
              dataIndex: "transaction_type26",
              key: "transaction_type26",        
              render: (type) => {
                switch (type) {
                  case "Goods received":
                    return (
                      <Tag color="green" icon={<InboxOutlined />}>
                        Goods received
                      </Tag>
                    );

                  case "Issue":
                    return (
                      <Tag color="red" icon={<LogoutOutlined />}>
                        Issue
                      </Tag>
                    );

                  case "Return":
                    return (
                      <Tag color="blue" icon={<RollbackOutlined />}>
                        Return
                      </Tag>
                    );

                  case "Issue or return":
                    return (
                      <Tag color="orange" icon={<RollbackOutlined />}>
                        Issue / Return
                      </Tag>
                    );

                  default:
                    return <Tag>{type}</Tag>;
                }
              }
            },
            { title: "Bulk issue", dataIndex: "bulk_issue", key: "bulk_issue" },
            { 
              title: "Date trans.", 
              dataIndex: "last_transaction_date", 
              key: "last_transaction_date",
              sorter: (a,b) => moment(a.transanction_date).unix() - moment(b.transanction_date).unix(),
                render: (text) => (
                  <Tag icon={<CalendarOutlined />} color="red">
                    {text ? moment(text).format("DD-MM-YYYY") : "Aucune"}
                  </Tag>
                )
            },
        ];

        return allColumns.filter((col) => columnsVisibility[col.title] !== false);
    }, [pagination, columnsVisibility]);
}
