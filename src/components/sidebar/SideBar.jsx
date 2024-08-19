import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  ApartmentOutlined,
  FileDoneOutlined,
  FundOutlined,
  SettingOutlined,
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
              <Link to='/form_service'>
                Département
              </Link>
          </Item>
          <SubMenu key="sub5" icon={<FileDoneOutlined />} title="Tâches">
            <Menu.Item key="3">
              Controle de base
            </Menu.Item>
            <Menu.Item key="4">
              <Link to='/liste_admissions'>
                Format
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to='/liste_admissions'>
                Frequence
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to='/liste_admissions'>
                Frequence
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub10" icon={<TeamOutlined />} title="Personnels">
            <Menu.Item key="7">Liste des personnels</Menu.Item>
            <Menu.Item key="8">Nouveau personnel</Menu.Item>
          </SubMenu>
{/*           <SubMenu key="sub10" icon={<FundOutlined />} title="Rapports">
            <Menu.Item key="21">Rapports d'activité</Menu.Item>
            <Menu.Item key="22">Statistiques des patients</Menu.Item>
          </SubMenu> */}
          <Item key="9" icon={<SettingOutlined />}>
            Paramètres
          </Item>
        </Menu>
      </Sider>
    </div>
  );
}

export default SideBar;