import React from 'react';
import { Layout, Menu, message } from 'antd';
import {
  HomeOutlined,
  ApartmentOutlined,
  FileDoneOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './sideBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

const { Sider } = Layout;
const { SubMenu, Item } = Menu;

const SideBar = () => {
  const navigate = useNavigate()

  const Logout = async () => {
    try {
      await logout()
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
          style={{ height: '100%', borderRight: 0, width: '100%', background:'#fff' }}
        >
          <Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Accueil</Link>
          </Item>
          <Item key="2" icon={<ApartmentOutlined />}>
            <Link to='/departement'>
              Département
            </Link>
          </Item>
          <SubMenu key="sub5" icon={<FileDoneOutlined />} title="Tâches">
            <Menu.Item key="3">
              <Link to={'/controle'}>
                Controle de base
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to={'/tache'}>
                Tâches
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to='/projet'>
                Projet
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to='/offre'>
                Offres
              </Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to='/budget'>
                Budget
              </Link>
            </Menu.Item>
            <Menu.Item key="8">
              <Link to='/format'>
                Format
              </Link>
            </Menu.Item>
            <Menu.Item key="9">
              <Link to='/frequence'>
                Frequence
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub10" icon={<SettingOutlined />} title="Parametre">
            <Menu.Item key="10">
              <Link to='/utilisateur'>
                Liste des personnels
              </Link>
            </Menu.Item>
            <Menu.Item key="11">
              <Link to={'/client'}>
                Liste des clients
              </Link>
            </Menu.Item>
            <Menu.Item key="12">
              <Link to={'/fournisseur'}>
                Liste des fourniseurs
              </Link>
            </Menu.Item>
            <Menu.Item key="12">
              <Link to={'/batiment'}>
                Liste des bâtiment
              </Link>
            </Menu.Item>
          </SubMenu>
          <Item key="logout" icon={<LogoutOutlined />} className="logout-item" onClick={Logout}>
            <Link>Déconnecter</Link>
          </Item>
        </Menu>
      </Sider>
    </div>
  );
}

export default SideBar;
