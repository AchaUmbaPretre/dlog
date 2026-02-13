import {
  CheckOutlined,
  ClockCircleOutlined,
  StopOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import './dashboardStats.scss';

const DashboardStats = ({ kpi }) => {
  if (!kpi) return null;

  const { total, presents, absents, retards } = kpi;

  return (
    <div className="dashboard-stats">
      
      <div className="stat-item">
        <div className="stat-value">
          {presents ?? 0}<span>/{total}</span>
        </div>
        <div className="stat_item_row">
          <div className="stat-label">
            <CheckOutlined style={{ color: 'green', marginRight: 6 }} />
            Présents aujourd’hui
          </div>
          <InfoCircleOutlined style={{ color: '#555', marginRight: 6 }} />
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-value">{retards ?? 0}</div>
        <div className="stat_item_row">
          <div className="stat-label">
            <ClockCircleOutlined style={{ color: '#faad14', marginRight: 6 }} />
            Retards
          </div>
          <InfoCircleOutlined style={{ color: '#555', marginRight: 6 }} />
        </div>
      </div>

      {/* Absences */}
      <div className="stat-item">
        <div className="stat-value">{absents ?? 0}</div>
        <div className="stat_item_row">
          <div className="stat-label">
            <StopOutlined style={{ color: 'red', marginRight: 6 }} />
            Absences & justifications
          </div>
          <InfoCircleOutlined  style={{ color: '#555', marginRight: 6 }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
