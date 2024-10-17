import React, { useState } from 'react';
import './topBar.scss';
import { useNavigate } from 'react-router-dom';
import { Popover, Button, Divider, message, Select } from 'antd';
import { BellOutlined, DashOutlined, MailOutlined } from '@ant-design/icons';
import userIcon from './../../assets/user.png';
import { useSelector } from 'react-redux';
import { logout } from '../../services/authService';
import { useMenu } from '../../context/MenuProvider';
import flagFR from './../../assets/Flag_france.svg.png';
import flagEN from './../../assets/Flag_english.svg.png';
import { useTranslation } from 'react-i18next'; 


const TopBar = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const { isOpen, toggleMenu } = useMenu();
  const { t, i18n } = useTranslation(); 

  const LogoutButton = ({ onLogout }) => (
    <Button type="primary" danger onClick={onLogout} style={{ width: '100%' }}>
      {t('logout')}
    </Button>
  );

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('persist:root');
      message.success(t('Déconnexion réussie !')); // Utilisation de t ici aussi
      navigate('/login');
      window.location.reload();
    } catch (error) {
      message.error(t('Erreur lors de la déconnexion.')); // Utilisation de t ici aussi
    }
  };

  // Contenu du popover de déconnexion
  const renderLogoutContent = () => (
    <div style={{ textAlign: 'center' }}>
      <p>{t('Voulez-vous vraiment vous déconnecter ?')}</p>
      <Divider />
      <LogoutButton onLogout={handleLogout} />
    </div>
  );

  // Fonction pour changer la langue
  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="topbar">
      <div className="topbar-left" onClick={() => navigate('/')} role="button" tabIndex={0}>
        <span className="logo"><div className="logo-d">D</div>LOG</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-icons">
          <BellOutlined aria-label="Notifications" />
        </div>
        <hr />
        <div className="topbar-icons">
          <MailOutlined aria-label="Messages" />
        </div>
        <hr />
        <div className="topBar-trait">
          {/* Sélecteur de langue */}
          <Select
            value={i18n.language} // Utilisez la langue actuelle
            style={{ width: 100 }}
            onChange={handleLanguageChange}
            dropdownMatchSelectWidth={false}
          >
            <Select.Option value="en">
              <img src={flagEN} alt="English" style={{ width: 20, marginRight: 8 }} />
              {t('English')}
            </Select.Option>
            <Select.Option value="fr">
              <img src={flagFR} alt="Français" style={{ width: 20, marginRight: 8 }} />
              {t('Français')}
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
          {/* Utilisation du Popover pour la déconnexion */}
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
    </div>
  );
};

export default TopBar;
