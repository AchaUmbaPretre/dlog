import { useState } from 'react';
import {
  CheckOutlined,
  ClockCircleOutlined,
  StopOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Modal } from 'antd';
import './dashboardStats.scss';
import DetailKpisPresenceToday from '../detailKpisPresence/detailKpisPresenceToday/DetailKpisPresenceToday';
import DetailKpisPresenceRetard from '../detailKpisPresence/detailKpisPresenceRetard/DetailKpisPresenceRetard';
import DetailKpisPresenceAbsent from '../detailKpisPresence/detailKpisPresenceAbsent/DetailKpisPresenceAbsent';

const DashboardStats = ({ kpi, sites }) => {
  const [modalType, setModalType] = useState(null);
  if (!kpi) return null;
  const { total, presents, absents, retards } = kpi;




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
          <InfoCircleOutlined style={{ color: '#555', marginRight: 6, cursor:'pointer' }} onClick={()=>openModal('present')} />
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-value">{retards ?? 0}</div>
        <div className="stat_item_row">
          <div className="stat-label">
            <ClockCircleOutlined style={{ color: '#faad14', marginRight: 6 }} />
            Retards
          </div>
          <InfoCircleOutlined style={{ color: '#555', marginRight: 6, cursor:'pointer' }} onClick={()=>openModal('retard')} />
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
          <InfoCircleOutlined style={{ color: '#555', marginRight: 6, cursor:'pointer' }} onClick={()=>openModal('absent')} />
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
        visible={modalType === 'retard'}
        onCancel={closeAllModals}
        footer={null}
        width={1150}
        centered
      >
        <DetailKpisPresenceRetard />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'absent'}
        onCancel={closeAllModals}
        footer={null}
        width={1150}
        centered
      >
        <DetailKpisPresenceAbsent />
      </Modal>
    </div>
  );
};

export default DashboardStats;
