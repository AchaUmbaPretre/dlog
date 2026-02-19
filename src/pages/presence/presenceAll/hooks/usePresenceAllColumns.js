import { useMemo } from "react";
import { Typography, Tag, Tooltip } from "antd";
import moment from "moment";
import { statutConfig } from "../../../../utils/presenceStatutConfig";
import UserAvatarProfile from "../../../../utils/UserAvatarProfile"

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
        title: "Profil",
        key: "profil",
        render: (_, record) => (
          <UserAvatarProfile
            nom={record.nom}
            prenom={record.prenom}
            email={record.email}
          />
        ),
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
        align: "center",
        render: (text) => {
          const config = statutConfig[text];
          if (!config) return <Tag>{text}</Tag>;

          return (
            <Tooltip title={config.full}>
              <Tag color={config.color} icon={config.icon}>
                {config.label}
              </Tag>
            </Tooltip>
          );
        },
      },

      {
        title: "Date",
        dataIndex: "date_presence",
        key: "date_presence",
        render: (date) =>
          date
            ? moment(date).format("DD-MM-YYYY")
            : <Text type="secondary">—</Text>,
      },

      {
        title: "Heure entrée",
        dataIndex: "heure_entree",
        key: "heure_entree",
        render: (time) =>
          time
            ? moment(time).format("HH:mm")
            : <Text type="secondary">—</Text>,
      },

      {
        title: "Heure sortie",
        dataIndex: "heure_sortie",
        key: "heure_sortie",
        render: (time) =>
          time
            ? moment(time).format("HH:mm")
            : <Text type="secondary">—</Text>,
      },
    ];
  }, []);
};
