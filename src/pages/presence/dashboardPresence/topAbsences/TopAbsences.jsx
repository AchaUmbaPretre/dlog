import { Table, Tag } from 'antd';
import './../dashboardSection.scss';

const TopAbsences = ({ topAbsences }) => {

  // Colonnes du tableau
  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom'
    },
    {
      title: 'Nombre de jour',
      dataIndex: 'total_absences',
      key: 'total_absences',
      render: (text) => {
        let color = 'default';
        if (text === 'PRESENT') color = 'green';
        else if (text === 'ABSENT') color = 'red';
        else if (text === 'ABSENCE_JUSTIFIEE') color = 'orange';
        return <Tag color={color}>{text} jour(s)</Tag>;
      }
    }
  ];

  return (
    <div className="dashboard-section">
      <div className="section-header">
        Top Absences
      </div>

      <div className="section-body">
        <Table
          columns={columns}
          dataSource={topAbsences}
          rowKey="nom"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </div>
      
    </div>
  );
};

export default TopAbsences;
