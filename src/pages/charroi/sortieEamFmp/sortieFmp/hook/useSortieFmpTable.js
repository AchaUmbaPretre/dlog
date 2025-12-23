import { useMemo, useRef, useState } from "react";
import { Tag, Typography } from "antd";
import moment from "moment";
import {
  BarcodeOutlined,
  NumberOutlined,
  HomeOutlined,
  InboxOutlined,
  CommentOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import getColumnSearchProps from "../../../../../utils/columnSearchUtils";

const { Text } = Typography;

export const useSortieFmpTable = ({ pagination, columnsVisibility }) => {
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

      {
        title: "SMR",
        dataIndex: "smr",
        key: "smr",
        ...getColumnSearchProps(
            'smr',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
        render: (v) => (
          <Tag color="green" icon={<InboxOutlined />}>
            {v}
          </Tag>
        )
      },

      {
        title: "N° BE",
        dataIndex: "sortie_gsm_num_be",
        key: "sortie_gsm_num_be",
        sorter: (a,b) => a.sortie_gsm_num_be - b.sortie_gsm_num_be,
        ...getColumnSearchProps(
            'sortie_gsm_num_be',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
        render: (v) => <Tag color='geekblue' icon={<NumberOutlined />}>{v}</Tag>
      },

      {
        title: "Item Code",
        dataIndex: "item_code",
        key: "item_code",
        ...getColumnSearchProps(
            'item_code',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
        render: (v) => <Tag icon={<BarcodeOutlined />}>{v}</Tag>
      },

      {
        title: "PD Code",
        dataIndex: "produit_pd_code",
        key: "produit_pd_code",
        sorter: (a,b) => a.produit_pd_code - b.produit_pd_code,
        ...getColumnSearchProps(
            'produit_pd_code',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
        render: (v) => <Text strong>{v}</Text>
      },

      {
        title: "N° GSM",
        dataIndex: "sortie_gsm_num",
        key: "sortie_gsm_num",
        sorter: (a,b) => a.sortie_gsm_num - b.sortie_gsm_num,
        ...getColumnSearchProps(
            'sortie_gsm_num',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
        render: (v) => <Tag icon={<NumberOutlined />}>{v}</Tag>
      },

      {
        title: "N° Log. GTM",
        dataIndex: "sortie_gsm_num_gtm",
        key: "sortie_gsm_num_gtm",
        ...getColumnSearchProps(
            'sortie_gsm_num_gtm',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
      },

      {
        title: "Site",
        dataIndex: "sortie_gsm_num_site",
        key: "sortie_gsm_num_site",
        ...getColumnSearchProps(
            'sortie_gsm_num_gtm',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
        render: (v) => (
          <Tag icon={<HomeOutlined />} color="blue">
            {v}
          </Tag>
        )
      },

      {
        title: "Désignation",
        dataIndex: "designation",
        key: "designation",
        ellipsis: true,
        ...getColumnSearchProps(
            'designation',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
      },

      {
        title: "Nb Colis",
        dataIndex: "nbre_colis",
        key: "nbre_colis",
        align: "right",
        sorter: (a,b) => a.nbre_colis - b.nbre_colis,
        ...getColumnSearchProps(
            'nbre_colis',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
      },

      {
        title: "Unité",
        dataIndex: "unite",
        key: "unite",
        sorter: (a,b) => a.unite - b.unite,
        ...getColumnSearchProps(
            'unite',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
      },

      {
        title: "Différence",
        dataIndex: "difference",
        key: "difference",
        ...getColumnSearchProps(
            'difference',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
      },

      {
        title: "Colonne 1",
        dataIndex: "colonne1",
        key: "colonne1"
      },

      {
        title: "Commentaire",
        dataIndex: "commentaire",
        key: "commentaire",
        ...getColumnSearchProps(
            'commentaire',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
        render: (v) =>
          v ? (
            <Tag icon={<CommentOutlined />} color="orange">
              {v}
            </Tag>
          ) : (
            <Text type="secondary">—</Text>
          )
      }
    ];

    return allColumns.filter(
      (col) => columnsVisibility[col.title] !== false
    );
  }, [pagination, columnsVisibility]);
};
