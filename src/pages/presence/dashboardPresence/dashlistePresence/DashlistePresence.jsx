import { Table, Tag } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import './../dashboardSection.scss';

const DashlistePresence = ({ employes }) => {

  const columns = [
    {
      title: "#",
      width: 50,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Nom & Prénom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text, record) => (
        <div>{record.nom} - {record.prenom}</div>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'statut_jour',
      key: 'statut_jour',
      render: (text) => {
        let color = 'default';
        if (text === 'PRESENT') color = 'green';
        else if (text === 'ABSENT') color = 'red';
        else if (text === 'ABSENCE_JUSTIFIEE') color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Heure entrée',
      dataIndex: 'heure_entree',
      key: 'heure_entree',
      render: (text) => {
        if (!text || text === '-') return '-';
        return moment(text, 'HH:mm:ss', true).isValid()
          ? moment(text, 'HH:mm:ss').format('HH:mm')
          : '-';
      }
    },
    {
      title: 'Heure sortie',
      dataIndex: 'heure_sortie',
      key: 'heure_sortie',
      render: (text) => {
        if (!text || text === '-') return '-';
        return moment(text, 'HH:mm:ss', true).isValid()
          ? moment(text, 'HH:mm:ss').format('HH:mm')
          : '-';
      }
    },
    {
      title: 'Statut affiché',
      dataIndex: 'statut_affiche',
      key: 'statut_affiche',
      render: (text) => {
        let color = 'blue';
        if (text === 'RETARD') color = 'red';
        else if (text === 'A L_HEURE') color = 'green';
        return <Tag color={color}>{text}</Tag>;
      }
    }
  ];

  return (
    <div className="dashboard-section">
      <div className="section-header">
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
