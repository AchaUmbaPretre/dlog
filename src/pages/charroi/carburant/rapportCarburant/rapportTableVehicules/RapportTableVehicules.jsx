import React from "react";
import { Table, Tag, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import './rapportTableVehicules.scss';

const RapportTableVehicules = ({ vehicles = [] }) => {
  const columns = [
    {
      title: 'Immatriculation',
      dataIndex: 'immatriculation',
      key: 'immatriculation',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Marque',
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      render: text => text
    },
    {
      title: 'Total litres',
      dataIndex: 'total_litres',
      key: 'total_litres',
      render: value => value ?? '-'
    },
    {
      title: 'Total CDF',
      dataIndex: 'total_cdf',
      key: 'total_cdf',
      render: value => value ?? '-'
    },
    {
      title: 'Total USD',
      dataIndex: 'total_usd',
      key: 'total_usd',
      render: value => value ?? '-'
    },
    {
      title: 'Conso Moyenne',
      dataIndex: 'conso_moyenne',
      key: 'conso_moyenne',
      render: value => value ? `${value} L/100km` : '-'
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
