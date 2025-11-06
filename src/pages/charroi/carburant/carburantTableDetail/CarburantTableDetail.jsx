import { useState } from 'react';
import { Table, Typography, Tag} from 'antd';
import {
  CalendarOutlined
} from "@ant-design/icons";
import './carburantTableDetail.scss'
import moment from 'moment';

const { Text } = Typography;

const CarburantTableDetail = ({data, loading}) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const scroll = { x: 400 };


    const columns = 
   [
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
        title: "Véhicule",
        dataIndex: "immatriculation",
        key: "immatriculation",
        render: (text) => <Tag color="blue">{text}</Tag>,
      },
      {
        title: "Date",
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
        title: "Qté (L)",
        dataIndex: "quantite_litres",
        key: "quantite_litres",
        align: "right",
        render: (text) => <Text>{text}</Text>,
      },
      {
        title: "Distance (km)",
        dataIndex: "distance",
        key: "distance",
        align: "right",
        render: (text) => <Text>{text}</Text>,
      },
      {
        title: "Km actuel",
        dataIndex: "compteur_km",
        key: "compteur_km",
        align: "right",
        render: (text) => <Text>{text} Km</Text>,
      },
      {
        title: "Cons./100km",
        dataIndex: "consommation",
        key: "consommation",
        align: "right",
        render: (text) => <Text>{text}</Text>,
      }
    ];

  return (
    <>
        <div className="carburantTableDetail">
            <div className="carburant_title_rows">
                <h1 className="carburant_h1">Tableau de bord</h1>
            </div>
            <div className="carburant_table">
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={pagination}
                    onChange={(pagination) => setPagination(pagination)}
                    rowKey="id"
                    bordered
                    size="small"
                    scroll={scroll}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                /> 
            </div>
        </div>
    </>
  )
}

export default CarburantTableDetail