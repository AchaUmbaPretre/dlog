import { Table, Tag, Tooltip } from 'antd';
import {
  UserOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import './../dashboardSection.scss';

const TopAbsences = ({ topAbsences }) => {

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
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <UserOutlined />
          {record.nom} - {record.prenom}
        </div>
      )
    },
    {
      title: 'Absences',
      dataIndex: 'total_absences',
      key: 'total_absences',
      align: "center",
      render: (value) => {

        let color = "green";
        let icon = <CheckCircleOutlined />;
        let label = `${value} j`;

        if (value >= 10) {
          color = "red";
          icon = <CloseCircleOutlined />;
        } 
        else if (value >= 5) {
          color = "orange";
          icon = <WarningOutlined />;
        }

        return (
          <Tooltip title={`${value} jour(s) d'absence`}>
            <Tag color={color} icon={icon}>
              {label}
            </Tag>
          </Tooltip>
        );
      }
    }
  ];

  return (
    <div className="dashboard-section">
      <div className="section-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <TrophyOutlined />
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
