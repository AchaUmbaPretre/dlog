import React, { useState } from 'react';
import { Layout, Menu, message } from 'antd';
import {
  HomeOutlined,
  ApartmentOutlined,
  FileDoneOutlined,
  SettingOutlined,
  LogoutOutlined,
  TagOutlined,
  DashboardOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import './sideBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

const { Sider } = Layout;
const { SubMenu, Item } = Menu;

const SideBar = () => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState([]);

  const onOpenChange = (keys) => {
    // Si un sous-menu est ouvert, fermer les autres
    const latestOpenKey = keys.find(key => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const Logout = async () => {
    try {
      await logout();
      localStorage.removeItem('persist:root');
      message.success('Déconnexion réussie !');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      message.error('Erreur lors de la déconnexion.');
    }
  };

  return (
    <div className="sidebar">
      <Sider>
        <Menu
          mode='inline'
          defaultSelectedKeys={['/']}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{ height: '100%', borderRight: 0, width: '100%', background: '#fff' }}
        >
          <Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Accueil</Link>
          </Item>
          <Item key="1" icon={<ApartmentOutlined />}>
            <Link to='/departement'>Département</Link>
          </Item>
          <Item key="2" icon={<DashboardOutlined />}>
            <Link to='/controle'>Contrôle de base</Link>
          </Item>
          <SubMenu key="sub5" icon={<ProjectOutlined />} title="Projet">
            <Item key="3">
              <Link to='/projet'>Liste de projet</Link>
            </Item>
            <Menu.Item key="4">
              <Link to='/offre'>Liste des offres</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to='/budget'>Budget</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub6" icon={<FileDoneOutlined />} title="Tâches">
            <Menu.Item key="6">
              <Link to='/tache'>Liste des tâches</Link>
            </Menu.Item>
          </SubMenu>
          <Item key="7" icon={<TagOutlined />}>
            <Link to='/article'>Article</Link>
          </Item>
          <SubMenu key="sub10" icon={<SettingOutlined />} title="Paramètre">
            <Menu.Item key="8">
              <Link to='/utilisateur'>Liste des personnels</Link>
            </Menu.Item>
            <Menu.Item key="9">
              <Link to='/client'>Liste des clients</Link>
            </Menu.Item>
            <Menu.Item key="10">
              <Link to='/fournisseur'>Liste des fournisseurs</Link>
            </Menu.Item>
            <Menu.Item key="11">
              <Link to='/batiment'>Liste des bâtiments</Link>
            </Menu.Item>
            <Menu.Item key="12">
              <Link to='/categorie'>Liste des catégories</Link>
            </Menu.Item>
            <Menu.Item key="13">
              <Link to='/format'>Format</Link>
            </Menu.Item>
            <Menu.Item key="14">
              <Link to='/frequence'>Fréquence</Link>
            </Menu.Item>
          </SubMenu>
          <Item key="logout" icon={<LogoutOutlined />} className="logout-item" onClick={Logout}>
            <Link>Déconnecter</Link>
          </Item>
        </Menu>
      </Sider>
    </div>
  );
};

export default SideBar;
