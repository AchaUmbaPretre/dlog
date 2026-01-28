import { useMemo } from "react";
import { Typography } from "antd";
import moment from "moment";

const { Text } = Typography;

export const usePresenceAllColumns = () => {
  return useMemo(() => {
    return [
      {
        title: "#",
        width: 60,
        align: "center",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Nom",
        dataIndex: "nom",
        key: "nom",
        render: (text) => <Text strong>{text}</Text>,
      },
      {
        title: "Site",
        dataIndex: "nom_site",
        key: "nom_site",
        render: (text) => <Text>{text ?? "N/A"}</Text>,
      },
      {
        title: "Statut",
        dataIndex: "statut_jour",
        key: "statut_jour",
        render: (text) => <Text>{text ?? "N/A"}</Text>,
      },
      {
        title: "Date",
        dataIndex: "date_presence",
        key: "date_presence",
        render: (date) =>
          date ? moment(date).format("DD-MM-YYYY") : <Text type="secondary">—</Text>,
      },
      {
        title: "Heure entrée",
        dataIndex: "heure_entree",
        key: "heure_entree",
        render: (time) =>
          time ? moment(time).format("HH:mm") : <Text type="secondary">—</Text>,
      },
      {
        title: "Heure sortie",
        dataIndex: "heure_sortie",
        key: "heure_sortie",
        render: (time) =>
          time ? moment(time).format("HH:mm") : <Text type="secondary">—</Text>,
      },
    ];
  }, []);
};
