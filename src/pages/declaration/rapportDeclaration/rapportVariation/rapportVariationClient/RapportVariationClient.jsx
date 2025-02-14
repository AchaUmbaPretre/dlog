import React, { useEffect, useState } from "react";
import { Table, notification, Tag } from "antd";
import { getRapportVariationClient } from "../../../../../services/templateService";
import moment from "moment";

const RapportVariationClient = ({zone}) => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setDataSource([]);
    const filteredDatas = {
        ville: zone
    };
    try {
      const { data } = await getRapportVariationClient(filteredDatas);

      // Regrouper les données par client
      const groupedData = {};
      data.forEach((item) => {
        const clientNom = item.client_nom;
        const moisAnnee = item.Mois
          ? `${moment().month(item.Mois - 1).format("MMM")}.${String(item.Annee).slice(-2)}`
          : "Total";

        if (!groupedData[clientNom]) {
          groupedData[clientNom] = {
            key: clientNom,
            client: clientNom,
            total_facture: item.Mois ? "-" : item.total_facture?.toLocaleString() || "-",
            total_entrep: item.Mois ? "-" : item.total_entrep?.toLocaleString() || "-",
            total_manu: item.Mois ? "-" : item.total_manu?.toLocaleString() || "-",
            superficie_totale: item.Mois ? "-" : (item.total_entrep + item.total_manu)?.toLocaleString() || "-",
            details: [], // Stocke les détails mensuels avec variations
          };
        }

        if (item.Mois) {
          groupedData[clientNom].details.push({
            key: `${clientNom}-${item.Annee}-${item.Mois}`,
            mois: moisAnnee,
            total_facture: item.total_facture?.toLocaleString() || "-",
            total_entrep: item.total_entrep?.toLocaleString() || "-",
            total_manu: item.total_manu?.toLocaleString() || "-",
            variation_facture: item.variation_facture ? `${item.variation_facture}%` : "-",
            variation_entrep: item.variation_entrep ? `${item.variation_entrep}%` : "-",
            variation_manu: item.variation_manu ? `${item.variation_manu}%` : "-",
          });
        }
      });

      const formattedData = Object.values(groupedData);

      setDataSource(formattedData);
      setColumns([
        {
          title: "Client",
          dataIndex: "client",
          key: "client",
        },
        {
          title: "Tot M² FACT",
          dataIndex: "total_facture",
          key: "total_facture",
          align: 'right' 
        },
        {
          title: "Tot Entreposage",
          dataIndex: "total_entrep",
          key: "total_entrep",
          align: 'right' 
        },
        {
          title: "TOT MANUT.",
          dataIndex: "total_manu",
          key: "total_manu",
          align: 'right' 
        },
        {
          title: "Superficie Totale",
          dataIndex: "superficie_totale",
          key: "superficie_totale",
          align: 'right' 
        },
      ]);
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Une erreur est survenue lors du chargement des données.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [zone]);

  const colums2 = [
    { title: "Mois", 
      dataIndex: "mois", 
      key: "mois",
      render: (text) => (
        <Tag color="#2db7f5">{text}</Tag>
      )
    },
    { title: "M² FACT", dataIndex: "total_facture", key: "total_facture",align: "right", },
    { title: "ENTREPOSAGE", dataIndex: "total_entrep", key: "total_entrep", align: "right", },
    { title: "MANUTENTION", dataIndex: "total_manu", key: "total_manu", align: "right", },
    { title: "V FACT (%)", dataIndex: "variation_facture", key: "variation_facture", align: "right", },
    { title: "V ENTREP (%)", dataIndex: "variation_entrep", key: "variation_entrep", align: "right", },
    { title: "V MANU (%)", dataIndex: "variation_manu", key: "variation_manu", align: "right", },
  ]

  return (
    <div className="rapport_facture">
        <h2 className="rapport_h2">RAPPORT POUR LA VILLE DE {zone} </h2>
        <div className="rapport_wrapper_facture">
        <Table
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      bordered
      size="small"
      expandable={{
        expandedRowRender: (record) => (
          <Table
            bordered
            size="small"
            columns={colums2}
            dataSource={record.details}
            pagination={false}
          />
        ),
      }}
    />
        </div>
    </div>
  );
};

export default RapportVariationClient;
