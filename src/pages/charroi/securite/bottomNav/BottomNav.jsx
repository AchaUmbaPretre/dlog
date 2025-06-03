import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.currentUser?.role);

  const navItems = [
    { path: '/', icon: <HomeOutlined /> },
    ...(role === 'Securité'
      ? [{ path: '/securite/dashboard', icon: <SafetyCertificateOutlined /> }]
      : []),
    { path: '/profile', icon: <UserOutlined /> },
    { path: '/settings', icon: <SettingOutlined /> },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
