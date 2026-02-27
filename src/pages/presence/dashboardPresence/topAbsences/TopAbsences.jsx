import { Table, Tag, Tooltip } from 'antd';
import {
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import './../dashboardSection.scss';
import UserAvatarProfile from '../../../../utils/UserAvatarProfile';

const TopAbsences = ({ topAbsences }) => {

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
