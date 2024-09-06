import React from 'react';
import './topBar.scss';
import { useNavigate } from 'react-router-dom';
import { Popover, Button, Divider, message } from 'antd';
import { BellOutlined, DashOutlined } from '@ant-design/icons';
import userIcon from './../../assets/user.png';
import { useSelector } from 'react-redux';
import { logout } from '../../services/authService';

// Composant pour le bouton de déconnexion
const LogoutButton = ({ onLogout }) => (
  <Button type="primary" danger onClick={onLogout} style={{ width: '100%' }}>
    Déconnexion
  </Button>
);

const TopBar = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout(); // Appelle le service de déconnexion
      localStorage.removeItem('persist:root');
      message.success('Déconnexion réussie !');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      message.error('Erreur lors de la déconnexion.');
    }
  };

  // Contenu du popover de déconnexion
  const renderLogoutContent = () => (
    <div style={{ textAlign: 'center' }}>
      <p>Voulez-vous vraiment vous déconnecter ?</p>
      <Divider />
      <LogoutButton onLogout={handleLogout} />
    </div>
  );

  return (
    <div className="topbar">
      <div className="topbar-left" onClick={() => navigate('/')} role="button" tabIndex={0}>
        <span className="logo">DLOG</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-icons">
          <BellOutlined aria-label="Notifications" />
        </div>
        <hr />
        <div className="topbar-user-rows">
          <img src={userIcon} alt="Utilisateur" className="user-logo" />
          <div className="topbar-name-rows">
            <span className="topbar-name">{user?.nom || 'Nom Utilisateur'}</span>
            <span className="topbar-sous-name">{user?.role || 'Rôle'}</span>
          </div>
        </div>
        <div className="topBar-trait">
          {/* Utilisation du Popover pour la déconnexion */}
          <Popover
            content={renderLogoutContent}
            title="Déconnexion"
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
