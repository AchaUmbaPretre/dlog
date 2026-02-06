import { useState, useEffect } from 'react';
import './topBar.scss';
import moment from 'moment';
import { Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Popover, Button, Divider, message, Select, Badge, List, notification, Typography, Space } from 'antd';
import { BellOutlined, DesktopOutlined, MoonOutlined, SunOutlined, DashOutlined, MailOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
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
  const user = useSelector((state) => state.user?.currentUser);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const navigate = useNavigate();
  const { isOpen, toggleMenu } = useMenu();
  const { t, i18n } = useTranslation();
  const [isTvMode, setIsTvMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

    const toggleTvMode = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsTvMode(true);
        navigate('/tv-dashboard');
      } else {
        document.exitFullscreen();
        setIsTvMode(false);
        navigate('/');
      }
    };

    useEffect(() => {
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          setIsTvMode(false);
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          navigate('/');
        }
      };
      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }, [navigate]);

    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const closeModal = () => {
      setSelectedNotif(null);
    };

  const handleNotificationClick = async (notif) => {
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
        console.log(error);
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

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  };

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
            <Typography.Text style={{ fontSize: '12px', fontWeight: 500 }}>
              {moment(item.timestamp).format('DD-MM-YYYY HH:mm')} : {item.message}
            </Typography.Text>
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
    <>
      {selectedNotif && (
        <div style={{ position: 'relative', zIndex: 3000 }}>
          <Notification
            idNotif={selectedNotif.id_notifications}
            onClose={closeModal}
          />
        </div>
      )}

      <div className="topbar">
        <div className="topbar-left" onClick={() => navigate('/')} role="button" tabIndex={0}>
          <span className="logo"><div className="logo-d">D</div>LOG</span>
        </div>
        <div className="topbar-right">
          <Switch
            checked={isTvMode}
            onChange={toggleTvMode}
            checkedChildren={<DesktopOutlined />}
            unCheckedChildren={<DesktopOutlined />}
            className='topbar_switch'
          />

          <Popover
            content={renderNotifications()}
            title={t('Notifications')}
            trigger="click"
            placement="Right"
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
          <div className="topbar-icons topbar_message">
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
          <div onClick={toggleTheme} className="topbar-icons" style={{ cursor: 'pointer' }}>
            {theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
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
      </div>
    </>
  );
};

export default TopBar;
