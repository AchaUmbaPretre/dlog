import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  SolutionOutlined,
  AppstoreOutlined,
  AuditOutlined,
  FormOutlined,
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
/*            defaultOpenKeys={['sub1']}  */
          style={{ height: '100%', borderRight: 0, width: '250px' }}
        >
          <Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Accueil</Link>
          </Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="Personnel médical">
            <Menu.Item key="1">
              <Link to="/form_personnel" className="sidebarLink">
                Nouveau personnel
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/liste_docteur" >
                Liste des personnels
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<SolutionOutlined />} title="Utilisateur">
            <Menu.Item key="3">
              <Link to='/form_user'>
                Nouveau compte
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to='/liste_user'>
                Liste des utilisateurs
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<MedicineBoxOutlined />} title="Patient">
            <Menu.Item key="5">
              <Link to='/form_patient'>
                Nouveau patient
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to='/liste_patient'>
                Liste des patients
              </Link>
            </Menu.Item>
            <Menu.Item key="7">Historique des consultations</Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" icon={<AppstoreOutlined />} title="Service">
            <Menu.Item key="8">
              <Link to='/form_service'>
                Nouveau service
              </Link>
            </Menu.Item>
            <Menu.Item key="9">
              <Link to='/liste_service'>
                Liste des services
              </Link>
              </Menu.Item>
          </SubMenu>
          <SubMenu key="sub5" icon={<AuditOutlined />} title="Admission">
            <Menu.Item key="10">
              Nouvelle admission
            </Menu.Item>
            <Menu.Item key="11">
              <Link to='/liste_admissions'>
                Liste des admissions
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub6" icon={<FormOutlined />} title="Consultation">
            <Menu.Item key="12">Nouvelle consultation</Menu.Item>
            <Menu.Item key="13">
              <Link to='/liste_consultation'>
                Liste des consultations
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub7" icon={<MedicineBoxOutlined />} title="Traitement">
            <Menu.Item key="14">Nouveau traitement</Menu.Item>
            <Menu.Item key="15">
              <Link to='/liste_traitement'>
                Liste des traitements
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub8" icon={<MedicineBoxOutlined />} title="Médicament">
            <Menu.Item key="16">Nouveau médicament</Menu.Item>
            <Menu.Item key="17">
              <Link to='/liste_medicament'>
                Liste des médicaments
              </Link>
            </Menu.Item>
            <Menu.Item key="18">Gérer le stock de médicaments</Menu.Item>
          </SubMenu>
          <SubMenu key="sub9" icon={<FileTextOutlined />} title="Ordonnance">
            <Menu.Item key="19">Nouvelle ordonnance</Menu.Item>
            <Menu.Item key="20">
              <Link to='/liste_ordonnance'>
                Liste des ordonnances
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub10" icon={<FundOutlined />} title="Rapports">
            <Menu.Item key="21">Rapports d'activité</Menu.Item>
            <Menu.Item key="22">Statistiques des patients</Menu.Item>
          </SubMenu>
          <Item key="23" icon={<SettingOutlined />}>
            Paramètres
          </Item>
        </Menu>
      </Sider>
    </div>
  );
}

export default SideBar;