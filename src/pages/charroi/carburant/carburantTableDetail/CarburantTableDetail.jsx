import { useState } from 'react';
import { Table } from 'antd';
import './carburantTableDetail.scss'

const CarburantTableDetail = () => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const scroll = { x: 400 };

    const columns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
          },
          width: "4%",
        },
        {
          title: 'N° PC',
          dataIndex: 'num_pc',
          key: 'num_pc'
        }, 
        {
          title: 'Véhicule',
          dataIndex: 'immatriculation',
          key: 'immatriculation'
        },   
        {
          title: 'Qté',
          dataIndex: 'quantite_litre',
          key: 'quantite_litre',   
        },
        {
          title: 'Km',
          dataIndex: 'compteur_km',
          key: 'compteur_km'
        },
        {
          title: 'date',
          dataIndex: 'date_operation',
          key: 'date_operation'
        },
        { 
          title: 'Créée par', 
          dataIndex: 'username', 
          key: 'username'
        },
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