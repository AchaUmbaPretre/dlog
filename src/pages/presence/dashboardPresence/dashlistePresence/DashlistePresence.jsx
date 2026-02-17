import { Table, Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  StopOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/fr';
import './../dashboardSection.scss';

const DashlistePresence = ({ employes }) => {

  const statutConfig = {
    PRESENT: {
      label: "Présent",
      full: "Présent",
      color: "green",
      icon: <CheckCircleOutlined />,
    },
    ABSENT: {
      label: "Absent",
      full: "Absent",
      color: "red",
      icon: <CloseCircleOutlined />,
    },
    ABSENCE_JUSTIFIEE: {
      label: "AJ",
      full: "Absence justifiée",
      color: "orange",
      icon: <ExclamationCircleOutlined />,
    },
    JOUR_FERIE: {
      label: "JF",
      full: "Jour férié",
      color: "purple",
      icon: <CalendarOutlined />,
    },
    JOUR_NON_TRAVAILLE: {
      label: "JNT",
      full: "Jour non travaillé",
      color: "default",
      icon: <StopOutlined />,
    },
    SUPPLEMENTAIRE: {
      label: "SUP",
      full: "Heure supplémentaire",
      color: "blue",
      icon: <ClockCircleOutlined />,
    },
  };

  const columns = [
    {
      title: "#",
      width: 50,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Nom & Prénom",
      dataIndex: "nom",
      key: "nom",
      render: (_, record) => (
        <div>{record.nom} - {record.prenom}</div>
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

      const config = {
        RETARD: {
          color: "red",
          icon: <ExclamationCircleOutlined />,
          label: "RET"
        },
        A_L_HEURE: {
          color: "green",
          icon: <CheckCircleOutlined />,
          label: "OK"
        }
      };

      const current = config[text];

      return (
        <Tag color={current?.color || "default"} icon={current?.icon}>
          {current?.label || text}
        </Tag>
      );
    }
    },
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
