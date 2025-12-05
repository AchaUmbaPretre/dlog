import { useState } from 'react';
import { Table, Typography, Tag, Tooltip} from 'antd';
import {
  CalendarOutlined
} from "@ant-design/icons";
import './carburantTableDetail.scss'
import moment from 'moment';

const { Text } = Typography;

const CarburantTableDetail = ({data, setCarburantId, loading}) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const scroll = { x: 'max-content' };

    const handleRowClick = (id) => {
      setCarburantId(id)
    }

    const columns = 
        [
          {
            title: "#",
            key: "index",
            width: 40,
            align: "center",
            render: (_, __, index) =>
              (pagination.current - 1) * pagination.pageSize + index + 1,
          },
          {
            title: "Marque",
            dataIndex: "nom_marque",
            key: "nom_marque",
            ellipsis:'true',
            render: (text, record) => (
              <Tooltip title='Récupérer les données de cet enregistrement'>
                <Tag color='success' onClick={() => handleRowClick(record.id_carburant)}>{text}</Tag>
              </Tooltip>
            )
          },
          {
            title: "Immatri.",
            dataIndex: "immatriculation",
            key: "immatriculation",
            ellipsis:'true',
            render: (text, record) => <Tag color="blue" onClick={() => handleRowClick(record.id_carburant)}>{text ?? 'N/A'}</Tag>,
          },
          {
            title: "Date",
            dataIndex: "date_operation",
            key: "date_operation",
            ellipsis:'true',
            sorter: (a, b) =>
              moment(a.date_operation).unix() - moment(b.date_operation).unix(),
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="red">
                {text ? moment(text).format("DD-MM-YYYY") : "Aucune"}
              </Tag>
            ),
          },
          {
            title: "Dist. (km)",
            dataIndex: "distance",
            key: "distance",
            align: "right",
            ellipsis:'true',
            render: (text) => <Tag>{text} Km</Tag>,
          },
          {
            title: "Compteur KM",
            dataIndex: "compteur_km",
            key: "compteur_km",
            align: "right",
            ellipsis:'true',
            render: (text) => <Tag>{text} Km</Tag>,
          },
          {
            title: "Qté",
            dataIndex: "quantite_litres",
            key: "quantite_litres",
            align: "right",
            ellipsis:'true',
            render: (text) => <Text mark>{text} L</Text>,
          },
          {
            title: "Cons.",
            dataIndex: "consommation",
            key: "consommation",
            align: "right",
            render: (text) => <Text mark>{text} L</Text>,
          },
          {
            title: "Crée par",
            dataIndex: "createur",
            key: "createur",
            align: "right",
            render: (text) => <Tag>{text ?? 'N/A'}</Tag>,
          }
        ];

  return (
    <>
        <div className="carburantTableDetail">
            <div className="carburant_title_rows">
                <h1 className="carburant_h1">5 derniers enregistrements { setCarburantId ?'' : 'mm'}</h1>
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