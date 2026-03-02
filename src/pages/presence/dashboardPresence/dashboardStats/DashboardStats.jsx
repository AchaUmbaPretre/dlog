import { useState } from 'react';
import {
  CheckOutlined,
  ClockCircleOutlined,
  StopOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import './dashboardStats.scss';
import DetailKpisPresenceToday from '../detailKpisPresence/DetailKpisPresenceToday';
import AbsentDashboard from '../absentDashboard/AbsentDashboard';
import RetardDashboard from '../retardDashboard/RetardDashboard';

const DashboardStats = ({ kpi, sites }) => {
  const [modalType, setModalType] = useState(null);
  if (!kpi) return null;
  const { total, presents, absencesTotales, retards } = kpi;

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type) => {
    closeAllModals();
    setModalType(type);
  };

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
          <Tooltip title="Cliquez ici pour voir le détail des Présents, Retards, Absences & Justifications">
            <InfoCircleOutlined
              style={{ color: '#555', marginRight: 6, cursor: 'pointer' }}
              onClick={() => openModal('present')}
            />
          </Tooltip>
        </div>
      </div>

      <div className="stat-item" onClick={() => openModal('retard')}>
        <div className="stat-value">{retards ?? 0}</div>
        <div className="stat_item_row">
          <div className="stat-label">
            <ClockCircleOutlined style={{ color: '#faad14', marginRight: 6 }} />
            Retards
          </div>
        </div>
      </div>

      {/* Absences */}
      <div className="stat-item" onClick={() => openModal('absence')}>
        <div className="stat-value">{absencesTotales ?? 0}</div>
        <div className="stat_item_row">
          <div className="stat-label">
            <StopOutlined style={{ color: 'red', marginRight: 6 }} />
            Absences & justifications
          </div>
        </div>
      </div>
      <Modal
        title=""
        visible={modalType === 'present'}
        onCancel={closeAllModals}
        footer={null}
        width={1210}
        centered
      >
        <DetailKpisPresenceToday sites={sites} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'absence'}
        onCancel={closeAllModals}
        footer={null}
        width={1010}
        centered
      >
        <AbsentDashboard />
      </Modal>


      <Modal
        title=""
        visible={modalType === 'retard'}
        onCancel={closeAllModals}
        footer={null}
        width={1010}
        centered
      >
        <RetardDashboard />
      </Modal>
    </div>
  );
};

export default DashboardStats;
