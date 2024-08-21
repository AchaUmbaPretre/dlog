import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  ApartmentOutlined,
  FileDoneOutlined,
  SettingOutlined,
  LogoutOutlined, // Ajoutez cette importation pour l'icône de déconnexion
} from '@ant-design/icons';
import './sideBar.css';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu, Item } = Menu;

const SideBar = () => {
  return (
    <div className="sidebar">
      <Sider>
        <Menu
          mode="inline"
          defaultSelectedKeys={['/']}
          style={{ height: '100%', borderRight: 0, width: '250px' }}
        >
          <Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Accueil</Link>
          </Item>
          <Item key="1" icon={<UserOutlined />}>
            <Link to="/client" className="sidebarLink">
              Client
            </Link>
          </Item>
          <Item key="2" icon={<ApartmentOutlined />}>
            <Link to='/departement'>
              Département
            </Link>
          </Item>
          <SubMenu key="sub5" icon={<FileDoneOutlined />} title="Tâches">
            <Menu.Item key="3">
              <Link to={'/tache'}>
                Tâches
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to={'/controle'}>
                Controle de base
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to='/format'>
                Format
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to='/frequence'>
                Frequence
              </Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to='/besoins'>
                Besoins
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub10" icon={<TeamOutlined />} title="Personnels">
            <Menu.Item key="7">
              <Link to='/utilisateur'>
                Liste des personnels
              </Link>
            </Menu.Item>
            <Menu.Item key="8">Nouveau personnel</Menu.Item>
          </SubMenu>
          <Item key="9" icon={<SettingOutlined />}>
            Paramètres
          </Item>
          <Item key="logout" icon={<LogoutOutlined />} className="logout-item">
            <Link to="/logout">Déconnecter</Link> {/* Assurez-vous que cette route est bien configurée pour la déconnexion */}
          </Item>
        </Menu>
      </Sider>
    </div>
  );
}

export default SideBar;
