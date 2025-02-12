import React, { useEffect, useState } from "react";
import { Table, notification, Tag } from "antd";
import { getRapportVariationClient } from "../../../../../services/templateService";
import moment from "moment";

const RapportVariationClient = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await getRapportVariationClient();
      console.log("Données reçues :", data);

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
          title: "Tot M² FACT (Annuel)",
          dataIndex: "total_facture",
          key: "total_facture",
        },
        {
          title: "Tot Entreposage ($ Annuel)",
          dataIndex: "total_entrep",
          key: "total_entrep",
        },
        {
          title: "TOT MANUT. (Annuel)",
          dataIndex: "total_manu",
          key: "total_manu",
        },
        {
          title: "Superficie Totale (Annuel)",
          dataIndex: "superficie_totale",
          key: "superficie_totale",
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
  }, []);

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      expandable={{
        expandedRowRender: (record) => (
          <Table
            columns={[
              { title: "Mois", dataIndex: "mois", key: "mois" },
              { title: "Tot M² FACT", dataIndex: "total_facture", key: "total_facture" },
              { title: "Tot Entreposage ($)", dataIndex: "total_entrep", key: "total_entrep" },
              { title: "TOT MANUT.", dataIndex: "total_manu", key: "total_manu" },
              { title: "V FACT (%)", dataIndex: "variation_facture", key: "variation_facture" },
              { title: "V ENTREP (%)", dataIndex: "variation_entrep", key: "variation_entrep" },
              { title: "V MANU (%)", dataIndex: "variation_manu", key: "variation_manu" },
            ]}
            dataSource={record.details}
            pagination={false}
          />
        ),
      }}
    />
  );
};

export default RapportVariationClient;
