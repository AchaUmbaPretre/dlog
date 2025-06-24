import { useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import './bottomNav.scss';

const BottomNav = () => {
  const location = useLocation();
  const role = useSelector((state) => state.user.currentUser?.role);

  const navItems = [
    { path: '/securite/dashboard', icon: <HomeOutlined />, label: 'Accueil' },
    ...(role === 'Securité'
      ? [{ path: '/', icon: <SafetyCertificateOutlined />, label: 'Sécurité' }]
      : []),
    { path: '/profile', icon: <UserOutlined />, label: 'Profil' },
    { path: '/settings', icon: <SettingOutlined />, label: 'Réglages' },
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navigation principale">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const isCenter = index === 0; // Met en avant le premier élément

        return (
          <button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''} ${isCenter ? 'center-item' : ''}`}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={`nav-icon-wrapper ${isActive && isCenter ? 'center-active' : ''}`}>
              {item.icon}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
