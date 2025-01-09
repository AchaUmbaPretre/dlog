import React, { useState } from 'react'
import './rapportFacture.scss'
import { Table } from 'antd';

const RapportFacture = () => {
    const [columnss, setColumnss] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    const data = [
        {
          key: "1",
          client: "BRACONGO",
          "janv-24": 2000,
          "févr-24": 2000,
          "mars-24": 2000,
          "avr-24": 2000,
        },
        {
          key: "2",
          client: "CLIENT. DIVERS",
          "janv-24": 1393.5,
          "févr-24": 1371.5,
          "mars-24": 1351.5,
          "avr-24": 1370.3,
        },
        // Ajoutez d'autres lignes...
      ];

      const columns = [
        {
          title: "Client",
          dataIndex: "client",
          key: "client",
          fixed: "left",
        },
        {
          title: "Janv-24",
          dataIndex: "janv-24",
          key: "janv-24",
        },
        {
          title: "Févr-24",
          dataIndex: "févr-24",
          key: "févr-24",
        },
        {
          title: "Mars-24",
          dataIndex: "mars-24",
          key: "mars-24",
        },
        {
          title: "Avr-24",
          dataIndex: "avr-24",
          key: "avr-24",
        },
        // Ajoutez d'autres colonnes...
      ];
    
  return (
    <>
        <div className="rapport_facture">
            <h2 className="rapport_h2">CLIENT DIVERS M² FACTURE</h2>
            <div className="rapport_wrapper_facture">
            <Table
      dataSource={data}
      columns={columns}
      bordered
      pagination={false} // Désactive la pagination pour afficher tout le tableau
      scroll={{ x: "max-content" }} // Active le défilement horizontal si nécessaire
    />
            </div>
        </div>
    </>
  )
}

export default RapportFacture