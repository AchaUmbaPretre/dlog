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
import { io } from 'socket.io-client';
import Notification from './notification/Notification';

/* const socket = io('http://localhost:8070'); */

const TopBar = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const { isOpen, toggleMenu } = useMenu();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false)

  const [notifications, setNotifications] = useState([]); // État des notifications
  const [visible, setVisible] = useState(false);
  const [idNotif, setIdNotif] = useState('')

  const closeAllModals = () => {
    setOpen(!open)
  }

  const handModal = (id) => {
    setOpen(true)
    setIdNotif(id)

    console.log(id)
  }

 /*  useEffect(() => {
    if (user?.id_utilisateur) {
      console.log("Enregistrement de l'utilisateur avec ID :", user.id_utilisateur); // Vérifier ici
      socket.emit('register', user.id_utilisateur);
    }

    // Écouter les notifications
    socket.on('notification', (notification) => {
      console.log(notification)
      setNotifications((prev) => [notification, ...prev]);
    });


    return () => {
      socket.disconnect();
    };
  }, [user?.id_utilisateur]);
 */


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
        <List.Item onClick={() => handModal(item.id_notif)}>
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
        title=""
        visible={open}
        onCancel={closeAllModals}
        footer={null}
        width={600}
        centered
      >
        <Notification idNotif={idNotif}/>
      </Modal>
    </div>
  );
};

export default TopBar;
