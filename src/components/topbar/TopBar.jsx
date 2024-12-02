import React, { useState, useEffect } from 'react';
import './topBar.scss';
import { useNavigate } from 'react-router-dom';
import { Popover, Button, Divider, message, Select, Badge, List, notification, Modal, Typography, Space } from 'antd';
import { BellOutlined, DashOutlined, MailOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import userIcon from './../../assets/user.png';
import { useSelector } from 'react-redux';
import { logout } from '../../services/authService';
import { useMenu } from '../../context/MenuProvider';
import flagFR from './../../assets/Flag_france.svg.png';
import flagEN from './../../assets/Flag_english.svg.png';
import { useTranslation } from 'react-i18next';
import Notification from './notification/Notification';
import { deletePutNotification, getNotification } from '../../services/tacheService';

const TopBar = () => {
  const user = useSelector((state) => state.user.currentUser);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const navigate = useNavigate();
  const { isOpen, toggleMenu } = useMenu();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false)

  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  // Fermer le modal
  const closeModal = () => {
    setSelectedNotif(null);
  };

  const handleNotificationClick = async (notif) => {
    console.log(notif)
    try {
      setSelectedNotif(notif);
      await deletePutNotification(notif.id_notifications);
      setNotifications((prev) =>
        prev.filter((item) => item.id_notifications !== notif.id_notifications)
      );
    } catch (error) {
      notification.error({
        message: t('Erreur'),
        description: t('Impossible de marquer la notification comme lue.'),
      });
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await getNotification(userId);
        setNotifications(data);
      } catch (error) {
        console.log(error)
      }
    };
  
    fetchNotifications();
  
    const interval = setInterval(fetchNotifications, 5000);
  
    return () => clearInterval(interval);
  }, [userId]);
  

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('persist:root');
      message.success(t('Déconnexion réussie !'));
      navigate('/login');
      window.location.reload();
    } catch (error) {
      message.error(t('Erreur lors de la déconnexion.'));
    }
  };

  const renderLogoutContent = () => (
    <div style={{ textAlign: 'center' }}>
      <p>{t('Voulez-vous vraiment vous déconnecter ?')}</p>
      <Divider />
      <Button type="primary" danger onClick={handleLogout} style={{ width: '100%' }}>
        {t('logout')}
      </Button>
    </div>
  );

  // Fonction pour changer la langue
  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  };

  // Afficher les notifications dans le Popover
  const renderNotifications = () => (
    <List
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item
          onClick={() => handleNotificationClick(item)}
          style={{
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            borderBottom: '1px solid #f0f0f0',
            padding: '12px 16px',
            borderRadius: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Space>
            {item.type === 'success' ? (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : item.type === 'info' ? (
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            ) : (
              <BellOutlined style={{ color: '#faad14' }} />
            )}
            <Typography.Text style={{ fontSize: '16px', fontWeight: 500 }}>{item.message}</Typography.Text>
          </Space>
        </List.Item>
      )}
      locale={{ emptyText: t('Aucune notification') }}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '10px 20px',
      }}
    />
  );
  

  return (
    <div className="topbar">
      <div className="topbar-left" onClick={() => navigate('/')} role="button" tabIndex={0}>
        <span className="logo"><div className="logo-d">D</div>LOG</span>
      </div>
      <div className="topbar-right">
        <Popover
          content={renderNotifications()}
          title={t('Notifications')}
          trigger="click"
          placement="bottomRight"
          visible={visible}
          onVisibleChange={setVisible}
        >
          <Badge count={notifications.length} overflowCount={99}>
            <div className="topbar-icons">
              <BellOutlined aria-label="Notifications" />
            </div>
          </Badge>
        </Popover>
        <hr />
        <div className="topbar-icons">
          <MailOutlined aria-label="Messages" />
        </div>
        <hr />
        <div className="topBar-trait">
          <Select
            value={i18n.language}
            style={{ width: 100 }}
            onChange={handleLanguageChange}
            dropdownMatchSelectWidth={false}
          >
            <Select.Option value="en">
              <img src={flagEN} alt="English" style={{ width: 20, marginRight: 8 }} />
              {t('En')}
            </Select.Option>
            <Select.Option value="fr">
              <img src={flagFR} alt="Français" style={{ width: 20, marginRight: 8 }} />
              {t('Fr')}
            </Select.Option>
          </Select>
        </div>
        <div className="topbar-user-rows">
          <img src={userIcon} alt="Utilisateur" className="user-logo" />
          <div className="topbar-name-rows">
            <span className="topbar-name">{user?.nom || t('Nom Utilisateur')}</span>
            <span className="topbar-sous-name">{user?.role || t('Rôle')}</span>
          </div>
        </div>
        <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="topBar-logout">
          <Popover
            content={renderLogoutContent}
            title={t('Déconnexion')}
            trigger="click"
            placement="bottomRight"
            arrowPointAtCenter
          >
            <DashOutlined className="topbar-icon" aria-label="Options utilisateur" />
          </Popover>
        </div>
      </div>
      <Modal
        title={t('Détails de la notification')}
        visible={!!selectedNotif}
        onCancel={closeModal}
        footer={null}
      >
        {selectedNotif && <Notification idNotif={selectedNotif.id_notifications} />}
      </Modal>
    </div>
  );
};

export default TopBar;
