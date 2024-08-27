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
          style={{ height: '100%', borderRight: 0, width: '210px' }}
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
              <Link to='/projet'>
                Projet
              </Link>
            </Menu.Item>
            <Menu.Item key="8">
              <Link to='/offre'>
                Offres
              </Link>
            </Menu.Item>
            <Menu.Item key="8">
              <Link to='/budget'>
                Budget
              </Link>
            </Menu.Item>
{/*             <Menu.Item key="8">
              <Link to='/besoins'>
                Besoins
              </Link>
            </Menu.Item> */}
          </SubMenu>
          <SubMenu key="sub10" icon={<SettingOutlined />} title="Parametre">
            <Menu.Item key="9">
              <Link to='/utilisateur'>
                Liste des personnels
              </Link>
            </Menu.Item>
            <Menu.Item key="10">
              <Link to={'/client'}>
                Liste des clients
              </Link>
            </Menu.Item>
            <Menu.Item key="11">
              <Link to={'/fournisseur'}>
                Liste des fourniseurs
              </Link>
            </Menu.Item>
          </SubMenu>
          <Item key="logout" icon={<LogoutOutlined />} className="logout-item">
            <Link to="/logout">Déconnecter</Link>
          </Item>
        </Menu>
      </Sider>
    </div>
  );
}

export default SideBar;
