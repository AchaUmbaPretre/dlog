import React, { useState } from 'react'
import './consomInfoGen.scss';
import { EnvironmentOutlined,CarOutlined,FireOutlined,DashboardOutlined,ArrowRightOutlined   } from '@ant-design/icons';
import { Divider, Table, Tag, Tooltip } from 'antd';
import ConsomInfoSiegeKin from './consomInfoSiegeKin/ConsomInfoSiegeKin';

const ConsomInfoGen = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const scroll = { x: 400 };

    const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Tag color="blue">{index + 1}</Tag>
        </Tooltip>
      ),
      width: "3%"
    },
    {
      title: (
        <>
          <EnvironmentOutlined style={{ color: "#52c41a" }} /> Mes Sites
        </>
      ),
      dataIndex: 'nom_site',
      render: (text) => (
        <Tooltip title="Nom du site">
          <Tag color="green">{text}</Tag>
        </Tooltip>
      )
    },
    {
      title: (
        <>
           Plein
        </>
      ),
      dataIndex: 'total_pleins',
      render: (text) => (
        <Tooltip title="Nombre total de pleins">
          <Tag color="gold">{text}</Tag>
        </Tooltip>
      )
    },
    {
      title: (
        <>
          <CarOutlined style={{ color: "#1890ff" }} /> Véhicule
        </>
      ),
      dataIndex: 'nbre_vehicule',
      render: (text) => (
        <Tooltip title="Nombre de véhicules">
          <Tag color="blue">{text}</Tag>
        </Tooltip>
      )
    },
    {
      title: (
        <>
          <ArrowRightOutlined style={{ color: "#722ed1" }} /> Litres
        </>
      ),
      dataIndex: 'total_litres',
      render: (text) => (
        <Tooltip title="Quantité totale en litres">
          <Tag color="purple">{text}</Tag>
        </Tooltip>
      )
    },
    {
      title: (
        <>
          <DashboardOutlined style={{ color: "#eb2f96" }} /> Km
        </>
      ),
      dataIndex: 'total_kilometrage',
      render: (text) => (
        <Tooltip title="Kilométrage total">
          <Tag color="magenta">{text}</Tag>
        </Tooltip>
      )
    },
  ];

  return (
    <>
        <div className="consomInfoGen">
            <Divider>Information générales</Divider>
            <div className="consomInfoGen__container">
                <div className="consomInfoGen__row">
                    <Divider>Mes sites</Divider>
                    <Table
                        columns={columns}
                        dataSource={data}
                        size="small" 
                        loading={loading}
                        scroll={scroll}
                        pagination={false}
                        rowClassName={(_, index) =>
                            index % 2 === 0 ? "table-row-light" : "table-row-dark"
                        }
                        summary={(pageData) => {
                        let totalPlein = 0;
                        let totalVehicule = 0;
                        let totalLitre = 0;
                        let totalKm = 0

                        pageData.forEach(({ total_pleins, nbre_vehicule, total_litres, total_kilometrage }) => {
                            totalPlein += total_pleins;
                            totalVehicule += nbre_vehicule;
                            totalLitre += total_litres;
                            totalKm += total_kilometrage;
                        });

                        const moyennePlein = pageData.length > 0 ? (totalPlein / pageData.length).toFixed(2) : 0;
                        const moyenneVehicule = pageData.length > 0 ? (totalVehicule / pageData.length).toFixed(2) : 0;
                        const moyenneLitre = pageData.length > 0 ? (totalLitre / pageData.length).toFixed(2) : 0;
                        const moyenneKm = pageData.length > 0 ? (totalKm / pageData.length).toFixed(2) : 0;

                        return (
                            <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>{totalPlein}</Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>{totalVehicule}</Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>{totalLitre}</Table.Summary.Cell>
                                <Table.Summary.Cell index={5}>{totalKm}</Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0}>Moyenne</Table.Summary.Cell>
                                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>{moyennePlein}</Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>{moyenneVehicule}</Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>{moyenneLitre}</Table.Summary.Cell>
                                <Table.Summary.Cell index={5}>{moyenneKm}</Table.Summary.Cell>

                            </Table.Summary.Row>
                            </>
                        );
                        }}
                    />
                </div>
                <div className="consomInfoGen__row">
                    <ConsomInfoSiegeKin/>
                </div>
            </div>
        </div> 
    </>
  )
}

export default ConsomInfoGen