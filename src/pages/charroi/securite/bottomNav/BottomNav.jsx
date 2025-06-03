import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import './bottomNav.scss';
import { useSelector } from 'react-redux';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = useSelector((state) => state.user?.currentUser?.role);

  const menuItems = [
    {
      key: '/',
      label: 'Accueil',
      icon: <HomeOutlined />,
    },
    ...(role === 'securite'
      ? [{
          key: '/securite/dashboard',
          label: 'Sécurité',
          icon: <SafetyCertificateOutlined />,
        }]
      : []),
    {
      key: '/profile',
      label: 'Profil',
      icon: <UserOutlined />,
    },
    {
      key: '/settings',
      label: 'Réglages',
      icon: <SettingOutlined />,
    },
  ];

  return (
    <div className="bottom-nav-wrapper">
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        onClick={(e) => navigate(e.key)}
        items={menuItems}
        className="bottom-nav-menu"
      />
    </div>
  );
};

export default BottomNav;
