import React from "react";
import { Table } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import './rapportTableVehicules.scss';
import { formatNumber } from "../../../../../utils/formatNumber";

const RapportTableVehicules = ({ vehicles }) => {


const columns = [
  {
    title: 'Immatriculation',
    dataIndex: 'immatriculation',
    key: 'immatriculation',
    render: text => <strong>{text?? 'N/A'}</strong>
  },
  {
    title: 'Marque',
    dataIndex: 'nom_marque',
    key: 'nom_marque',
  },
  {
    title: 'Total litres',
    dataIndex: 'total_litres',
    key: 'total_litres',
    align: "right",
    render: value => formatNumber(value)
  },
  {
    title: 'Total CDF',
    dataIndex: 'total_cdf',
    key: 'total_cdf',
    align: "right",
    render: value => formatNumber(value)
  },
  {
    title: 'Total USD',
    dataIndex: 'total_usd',
    key: 'total_usd',
    align: "right",
    render: value => formatNumber(value)
  },
  {
    title: 'Conso Moyenne',
    dataIndex: 'conso_moyenne',
    key: 'conso_moyenne',
    align: "right",
    render: value => value ? `${formatNumber(value)} L/100km` : '-'
  },
];


  return (
    <section className="card table-card">
      <h2 className="card__title"><InfoCircleOutlined /> Détails des véhicules</h2>
      <Table
        className="rapport-table"
        dataSource={vehicles}
        columns={columns}
        rowKey={(record) => record.immatriculation}
        pagination={{ pageSize: 8 }}
        bordered
        locale={{ emptyText: 'Aucun véhicule' }}
      />
    </section>
  );
};

export default RapportTableVehicules;
