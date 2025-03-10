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
  TagsOutlined,
  ScheduleOutlined 
} from '@ant-design/icons';
import './sideBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { useMenu } from '../../context/MenuProvider';

const { Sider } = Layout;
const { SubMenu, Item } = Menu;

const SideBar = ({data}) => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState([]);
  const { isOpen, toggleMenu } = useMenu();
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [isReduced, setIsReduced] = useState(false);

  const toggleSidebar = () => {
    setIsReduced(!isReduced);
  };

  const handleClickOutside = useCallback((event) => {
    if (
      isOpen &&
      sidebarRef.current &&
      hamburgerRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !hamburgerRef.current.contains(event.target)
    ) {
      toggleMenu();
    }
  }, [isOpen, toggleMenu]); // Dépendances
  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
  

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

  const iconMapping = {
    HomeOutlined: <HomeOutlined style={{ color: '#1890ff' }} />,
    ApartmentOutlined: <ApartmentOutlined style={{ color: '#722ed1' }} />,
    DashboardOutlined: <DashboardOutlined style={{ color: '#fa8c16' }} />,
    BankOutlined: <BankOutlined style={{ color: '#13c2c2' }} />,
    ProjectOutlined: <ProjectOutlined style={{ color: '#ff4d4f' }} />,
    FileDoneOutlined: <FileDoneOutlined style={{ color: '#52c41a' }} />,
    TagOutlined: <TagOutlined style={{ color: '#fadb14' }} />,
    DropboxOutlined: <DropboxOutlined style={{ color: '#9254de' }} />,
    FileTextOutlined: <FileTextOutlined style={{ color: '#ffc069' }} />,
    TagsOutlined: <TagsOutlined style={{ color: 'blue' }} />,
    SettingOutlined: <SettingOutlined style={{ color: '#000' }} />,
    ScheduleOutlined: <ScheduleOutlined style={{ color: 'cyan' }} />,
    LogoutOutlined: <LogoutOutlined style={{ color: '#f5222d' }} />,
  };
  
  const renderIcon = (iconName) => {
    return iconMapping[iconName] || <HomeOutlined />;
  };

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
          
          {data?.map(menuItem => (
            menuItem.subMenus && menuItem.subMenus[0]?.submenu_id ? (
              <SubMenu
                key={menuItem?.menu_id}
                icon={renderIcon(menuItem.menu_icon)}
                title={<span className="sidebarH3">{menuItem.menu_title}</span>}
              >
                {menuItem?.subMenus.map(subMenu => (
                  <Item key={`submenu-${menuItem.menu_id}-${subMenu?.submenu_id}`}>
                    <Link to={subMenu?.submenu_url} className="sidebarLink" onClick={toggleMenu}>
                      {subMenu.submenu_title}
                    </Link>
                  </Item>
                ))}
              </SubMenu>
            ) : (
              <Item key={menuItem.menu_id} icon={renderIcon(menuItem.menu_icon)}>
                <Link to={menuItem.menu_url} className="sidebarLink" onClick={toggleMenu}>
                  {menuItem.menu_title}
                </Link>
              </Item>
            )
          ))}
          <Item key="logout" icon={<LogoutOutlined style={{ color: '#f5222d' }} />} className="logout-item" onClick={Logout}>
            <Link>Déconnecter</Link>
          </Item>
        </Menu>
      </Sider>
    </div>
  );
};

export default SideBar;