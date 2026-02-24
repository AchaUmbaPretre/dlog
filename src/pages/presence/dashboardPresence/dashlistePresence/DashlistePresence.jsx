import { Table, Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/fr';
import './../dashboardSection.scss';
import { statutConfig } from '../../../../utils/presenceStatutConfig';
import UserAvatarProfile from '../../../../utils/UserAvatarProfile';

const DashlistePresence = ({ employes }) => {

  const columns = [
    {
      title: "#",
      width: 50,
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
      title: "Entrée",
      dataIndex: "heure_entree",
      key: "heure_entree",
      align: "center",
      render: (text) => {
        if (!text || text === "-") return "-";
        return moment(text, "HH:mm:ss", true).isValid()
          ? moment(text, "HH:mm:ss").format("HH:mm")
          : "-";
      },
    },
    {
      title: "Sortie",
      dataIndex: "heure_sortie",
      key: "heure_sortie",
      align: "center",
      render: (text) => {
        if (!text || text === "-") return "-";
        return moment(text, "HH:mm:ss", true).isValid()
          ? moment(text, "HH:mm:ss").format("HH:mm")
          : "-";
      },
    },
    {
      title: "Ponctualité",
      dataIndex: "statut_affiche",
      key: "statut_affiche",
      align: "center",
      render: (text) => {
        if (!text) return "-";

        const statusConfig = {
          RETARD: {
            color: "red",
            icon: <ExclamationCircleOutlined />,
            label: "RET"
          },
          A_L_HEURE: {
            color: "green",
            icon: <CheckCircleOutlined />,
            label: "OK"
          },
          ABSENT: {
            color: "volcano",
            icon: <CloseCircleOutlined />,
            label: "ABS"
          },
          JOUR_NON_TRAVAILLE: {
            color: "blue",
            icon: <CalendarOutlined />,
            label: "OFF"
          }
        };

        const current = statusConfig[text];

        return (
          <Tag
            color={current?.color || "default"}
            icon={current?.icon || <QuestionCircleOutlined />}
          >
            {current?.label || text}
          </Tag>
        );
      }
    }
  ];

  return (
    <div className="dashboard-section">
      <div className="section-header"  style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <UserOutlined />
        Liste des employés
      </div>

      <div className="section-body">
        <Table
          columns={columns}
          dataSource={employes}
          rowKey="nom"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </div>
    </div>
  );
};

export default DashlistePresence;
