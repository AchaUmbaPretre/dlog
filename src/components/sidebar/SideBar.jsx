import { useRef, useState, useEffect, useCallback } from 'react';
import { Layout, Menu, message } from 'antd';
import {
  HomeOutlined,
  SwapOutlined,
  GlobalOutlined,
  RetweetOutlined,
  TruckOutlined,
  CarOutlined,
  ApartmentOutlined,
  FileDoneOutlined,
  SettingOutlined,
  LogoutOutlined,
  TagOutlined,
  FolderOpenFilled,
  DashboardOutlined,
  FireOutlined,
  ProjectOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BankOutlined,
  HddOutlined,
  DropboxOutlined,
  TagsOutlined,
  ScheduleOutlined,
  DeleteOutlined,
  ToolOutlined,
  PushpinOutlined,
  DollarOutlined,
  CheckSquareOutlined,
  EnvironmentOutlined,
  FormOutlined,
  IdcardOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  LockOutlined,
  UserOutlined,
  SolutionOutlined,
  TeamOutlined,
  AuditOutlined,
  DeliveredProcedureOutlined,
  FullscreenExitOutlined,
  UserSwitchOutlined,
  BuildOutlined
} from '@ant-design/icons';
import './sideBar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const currentPath = location.pathname;


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
  }, [isOpen, toggleMenu]);
  
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

  useEffect(() => {
  const currentPath = location.pathname;

  // Trouver le menu parent d’un sous-menu actif
  const parentMenu = data?.find(menu =>
    menu.subMenus?.some(sub => sub.submenu_url === currentPath)
  );

  if (parentMenu) {
    setOpenKeys([parentMenu.menu_id.toString()]);
  } else {
    // Ouvrir uniquement le menu correspondant s’il n’a pas de sous-menus
    const directMenu = data?.find(menu => menu.menu_url === currentPath);
    if (directMenu && !directMenu.subMenus?.length) {
      setOpenKeys([]);
    }
  }
}, [location.pathname, data]);


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
    DeleteOutlined: <DeleteOutlined style={{ color: '#f5222d' }} />,
    ToolOutlined: <ToolOutlined style={{ color: 'cyan' }} />,
    PushpinOutlined: <PushpinOutlined style={{ color: '#f5222d' }} />,
    DollarOutlined: <DollarOutlined style={{ color: '#722ed1' }} />,
    CheckSquareOutlined : <CheckSquareOutlined style={{ color: '#13c2c2' }} />,
    EnvironmentOutlined: <EnvironmentOutlined style={{ color: '#f5222d' }} />,
    FormOutlined: <FormOutlined style={{ color: '#722ed1' }} />,
    IdcardOutlined: <IdcardOutlined style={{ color: '#2f54eb' }} />,
    ShoppingOutlined: <ShoppingOutlined style={{ color: '#13c2c2' }} />,
    UnorderedListOutlined: <UnorderedListOutlined style={{ color: '#1890ff' }} />,
    LockOutlined: <LockOutlined style={{ color: '#ffc069' }} />,
    UserOutlined: <UserOutlined style={{ color: '#000' }} />,
    SolutionOutlined: <SolutionOutlined style={{ color: '#13c2c2' }} />,
    TeamOutlined: <TeamOutlined style={{ color: '#000' }} />,
    HddOutlined: <HddOutlined style={{ color: '#000' }} />,
    AuditOutlined : <AuditOutlined style={{ color: '#2f54eb' }} />,
    TruckOutlined: <TruckOutlined style={{ color: '#2f54eb' }} />,
    CarOutlined: <CarOutlined style={{ color: '#13c2c2' }} />,
    SwapOutlined: <SwapOutlined style={{ color: '#ffc069' }} />,
    RetweetOutlined: <RetweetOutlined style={{ color: 'cyan' }} />,
    DeliveredProcedureOutlined : <DeliveredProcedureOutlined style={{ color: '#2f54eb' }} />,
    GlobalOutlined : <GlobalOutlined style={{ color: 'green' }} />,
    FolderOpenFilled: <FolderOpenFilled style={{ color: '#fadb14' }} />,
    FullscreenExitOutlined :<FullscreenExitOutlined style={{ color: '#2f54eb' }} />,
    UserSwitchOutlined: <UserSwitchOutlined style={{ color: '#000' }} />,
    FireOutlined : <FireOutlined style={{ color: '#ffc069' }} />,
    BuildOutlined : <BuildOutlined style={{ color: '#f1c40f' }} />

  };
  
  const renderIcon = (iconName) => {
    return iconMapping[iconName] || <HomeOutlined />;
  };

  return (
  <div
    ref={sidebarRef}
    className={`sidebar ${isOpen ? 'visible' : ''} ${isReduced ? 'sidebar-reduced' : ''}`}
  >
    <button className="sidebar-toggle" onClick={toggleSidebar}>
      {isReduced ? (
        <ArrowRightOutlined style={{ color: 'var(--text-secondary)' }} />
      ) : (
        <ArrowLeftOutlined style={{ color: 'var(--text-secondary)' }} />
      )}
    </button>

    <Sider style={{ background: 'var(--bg)' }}>
      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{
          background: 'var(--bg)',
          color: 'var(--text)',
        }}
        theme="light"
      >
        <Item
          key="/"
          icon={<HomeOutlined style={{ color: 'var(--accent)' }} />}
          onClick={toggleMenu}
        >
          <Link to="/">Accueil</Link>
        </Item>

        {data?.map((menuItem) =>
          menuItem.subMenus && menuItem.subMenus[0]?.submenu_id ? (
            <SubMenu
              key={menuItem.menu_id.toString()}
              icon={renderIcon(menuItem.menu_icon)}
              title={<span className="sidebarH3">{menuItem.menu_title}</span>}
            >
              {menuItem?.subMenus.map((subMenu) => (
                <Item
                  icon={renderIcon(subMenu.submenu_icon)}
                  key={subMenu?.submenu_url}
                >
                  <Link
                    to={subMenu?.submenu_url}
                    className="sidebarLink"
                    onClick={toggleMenu}
                  >
                    {subMenu.submenu_title}
                  </Link>
                </Item>
              ))}
            </SubMenu>
          ) : (
            <Item key={menuItem.menu_url} icon={renderIcon(menuItem.menu_icon)}>
              <Link
                to={menuItem.menu_url}
                className="sidebarLink"
                onClick={toggleMenu}
              >
                {menuItem.menu_title}
              </Link>
            </Item>
          )
        )}

        <Item
          key="logout"
          icon={<LogoutOutlined style={{ color: 'var(--logout-color)' }} />}
          className="logout-item"
          onClick={Logout}
        >
          <Link>Déconnecter</Link>
        </Item>
      </Menu>
    </Sider>
    
  </div>
  );
};

export default SideBar;