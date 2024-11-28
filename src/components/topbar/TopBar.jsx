import React, { useState, useEffect } from 'react';
import './topBar.scss';
import { useNavigate } from 'react-router-dom';
import { Popover, Button, Divider, message, Select, Badge, List, notification, Modal } from 'antd';
import { BellOutlined, DashOutlined, MailOutlined } from '@ant-design/icons';
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
  const navigate = useNavigate();
  const { isOpen, toggleMenu } = useMenu();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false)

  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const [idNotif, setIdNotif] = useState('')
  const [selectedNotif, setSelectedNotif] = useState(null);

  // Fermer le modal
  const closeModal = () => {
    setSelectedNotif(null);
  };

  const handModal = (id) => {
    setOpen(true)
    setIdNotif(id)
  }

  const handleNotificationClick = async (notif) => {
    console.log(notif)
    try {
      setSelectedNotif(notif); // Ouvrir le modal pour afficher les détails
      await deletePutNotification(notif.id_notifications); // API pour marquer comme lue
      setNotifications((prev) =>
        prev.filter((item) => item.id_notifications !== notif.id_notifications) // Retirer de la liste
      );
    } catch (error) {
      notification.error({
        message: t('Erreur'),
        description: t('Impossible de marquer la notification comme lue.'),
      });
    }
  };

  useEffect(() => {
    const fetchData = async() => {
      try {
        const { data } = await getNotification();
        setNotifications(data);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
      }
    }

    fetchData();
  }, []) 

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
        <List.Item onClick={() => handleNotificationClick(item)}>
          <span>{item.message}</span>
        </List.Item>
      )}
      locale={{ emptyText: t('Aucune notification') }}
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
