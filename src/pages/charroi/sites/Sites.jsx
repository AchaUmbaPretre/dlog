import React from 'react'
import {
  ThunderboltOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  ToolOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { Tabs } from 'antd';
import ListSites from './listSites/ListSites';
import SiteUser from './siteUser/SiteUser';

const tabConfig = [
  {
    key: '1',
    label : 'Liste des sites',
    icon : <ThunderboltOutlined />,
    component: <ListSites />
  },
  {
    key: '2',
    label : "Liste d'affectations",
    icon : <ThunderboltOutlined />,
    component: <SiteUser />
  }
]

const Sites = () => {

  return (
    <div>

    </div>
  )
}

export default Sites