import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Layout, Menu, message } from 'antd';
import {
  HomeOutlined,
  ApartmentOutlined,
  FileDoneOutlined,
  SettingOutlined,
  LogoutOutlined,
  TagOutlined,
  DashboardOutlined,
  ProjectOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BankOutlined,
  DropboxOutlined,
  TagsOutlined 
} from '@ant-design/icons';
import './sideBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { useMenu } from '../../context/MenuProvider';
import { getMenusOne } from '../../services/permissionService';
import { useSelector } from 'react-redux';

const { Sider } = Layout;
const { SubMenu, Item } = Menu;

const SideBar = () => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState([]);
  const { isOpen, toggleMenu } = useMenu();
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const userId = useSelector((state) => state.user?.currentUser.id_utilisateur);
  const [data, setData] = useState([]);

  const [isReduced, setIsReduced] = useState(false);

  const toggleSidebar = () => {
    setIsReduced(!isReduced);
  };

  const handleClickOutside = (event) => {
    if (
      isOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      hamburgerRef.current &&
      !hamburgerRef.current.contains(event.target)
    ) {
      toggleMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const onOpenChange = (keys) => {
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

  const fetchMenu = useCallback(async () => {
    try {
      getMenusOne(userId)
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu, userId]);

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? 'visible' : ''} ${isReduced ? 'sidebar-reduced' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isReduced ? <ArrowRightOutlined style={{ color: 'grey' }} /> : <ArrowLeftOutlined style={{ color: 'grey' }} />}
      </button>
      <Sider>
        <Menu
          mode='inline'
          defaultSelectedKeys={['/']}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{ height: '100%', borderRight: 0, width: '100%', background: '#fff' }}
        >
          <Item key="/" icon={<HomeOutlined style={{ color: '#1890ff' }} />} onClick={toggleMenu}>
            <Link to="/">Accueil</Link>
          </Item>
          <Item key="1" icon={<ApartmentOutlined style={{ color: '#722ed1' }} />} onClick={toggleMenu}>
            <Link to='/departement'>Département</Link>
          </Item>
          <Item key="2" icon={<DashboardOutlined style={{ color: '#fa8c16' }} />} onClick={toggleMenu}>
            <Link to='/controle'>Contrôle de base</Link>
          </Item>
          <SubMenu key="sub1" icon={<BankOutlined style={{ color: '#13c2c2' }} />} title="Bâtiment">
            <Item key="3" onClick={toggleMenu}>
              <Link to='/batiment'>Liste des Bâtiments</Link>
            </Item>
            <Item key="4" onClick={toggleMenu}>
              <Link to='/liste_bins'>Liste des Bins</Link>
            </Item>
            <Item key="5" onClick={toggleMenu}>
              <Link to='/liste_equipement'>Liste d'équipements</Link>
            </Item>
            <Item key="6" onClick={toggleMenu}>
              <Link to='/liste_bureaux'>Liste des bureaux</Link>
            </Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<ProjectOutlined style={{ color: '#ff4d4f' }} />} title="Projet" onClick={toggleMenu}>
            <Item key="6">
              <Link to='/projet'>Liste de projet</Link>
            </Item>
            <Menu.Item key="7" onClick={toggleMenu}>
              <Link to='/offre'>Liste des offres</Link>
            </Menu.Item>
            <Menu.Item key="8" onClick={toggleMenu}>
              <Link to='/budget'>Budget</Link>
            </Menu.Item>
            <Menu.Item key="9" onClick={toggleMenu}>
              <Link to='/besoins'>Besoins</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<FileDoneOutlined style={{ color: '#52c41a' }} />} title="Tâches">
            <Menu.Item key="10" onClick={toggleMenu}>
              <Link to='/tache'>Liste des tâches</Link>
            </Menu.Item>
            <Menu.Item key="11" onClick={toggleMenu}>
              <Link to='/liste_tracking'>Liste des tracking</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" icon={<TagOutlined style={{ color: '#fadb14' }} />} title="Articles">
            <Menu.Item key="12" onClick={toggleMenu}>
              <Link to='/article'>Liste des articles</Link>
            </Menu.Item>
            <Menu.Item key="13" onClick={toggleMenu}>
              <Link to='/prix'>Liste des prix</Link>
            </Menu.Item>
          </SubMenu>
          <Item key="14" icon={<DropboxOutlined style={{ color: '#9254de' }} />} onClick={toggleMenu}>
            <Link to='/stock'>Stock</Link>
          </Item>
          <Item key="15" icon={<FileTextOutlined style={{ color: '#ffc069' }} />} onClick={toggleMenu}>
            <Link to='/dossier'>Document</Link>
          </Item>
          <Item key="16" icon={<TagsOutlined style={{ color: 'blue' }} />} onClick={toggleMenu}>
            <Link to='/tags'>Tags</Link>
          </Item>
          <SubMenu key="sub5" icon={<SettingOutlined style={{ color: '#000' }} />} title="Paramètre">
            <Menu.Item key="17" onClick={toggleMenu}>
              <Link to='/utilisateur'>Liste des personnels</Link>
            </Menu.Item>
            <Menu.Item key="18" onClick={toggleMenu}>
              <Link to='/client'>Liste des clients</Link>
            </Menu.Item>
            <Menu.Item key="19" onClick={toggleMenu}>
              <Link to='/fournisseur'>Liste des fournisseurs</Link>
            </Menu.Item>
            <Menu.Item key="20" onClick={toggleMenu}>
              <Link to='/categorie'>Liste de cat d'article</Link>
            </Menu.Item>
            <Menu.Item key="21" onClick={toggleMenu}>
              <Link to='/liste_cat_tache'>Liste de cat tache</Link>
            </Menu.Item>
            <Menu.Item key="22" onClick={toggleMenu}>
              <Link to='/corpsMetier'>Liste des corps de métier</Link>
            </Menu.Item>
            <Menu.Item key="23" onClick={toggleMenu}>
              <Link to='/format'>Format</Link>
            </Menu.Item>
            <Menu.Item key="24" onClick={toggleMenu}>
              <Link to='/frequence'>Fréquence</Link>
            </Menu.Item>
            <Menu.Item key="25" onClick={toggleMenu}>
              <Link to='/permission'>Permission</Link>
            </Menu.Item>
          </SubMenu>
          <Item key="logout" icon={<LogoutOutlined style={{ color: '#f5222d' }} />} className="logout-item" onClick={Logout}>
            <Link>Déconnecter</Link>
          </Item>
        </Menu>
      </Sider>
    </div>
  );
};

export default SideBar;
