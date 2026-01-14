import React, { useState } from 'react'
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
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';

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
  const [activeKey, setActiveKey] = useState('1');

  return (
    <div className="carburant_all">
            <Tabs
              activeKey={activeKey}
              onChange={setActiveKey}
              type="card"
              tabPosition="top"
              destroyInactiveTabPane
              animated
            >
              {tabConfig.map(tab => (
                        <Tabs.TabPane
                          key={tab.key}
                          tab={
                            <span style={getTabStyle(tab.key, activeKey)}>
                              {React.cloneElement(tab.icon, { style: iconStyle(tab.key, activeKey) })}
                              {tab.label}
                            </span>
                          }
                        >
                          {tab.component}
                        </Tabs.TabPane>
                      ))}
            </Tabs>
    </div>
  )
}

export default Sites