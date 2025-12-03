import React, { useState } from 'react';
import { Tabs } from 'antd';
import {
  ThunderboltOutlined,
  DatabaseOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';
import ListGenerateur from './listGenerateur/ListGenerateur';
import ListTypeGenerateur from './TypeGenerateur/ListTypeGenerateur';
import PleinGenerateur from './composant/pleinGenerateur/PleinGenerateur';

const tabConfig = [
  {
    key: '1',
    label: 'Liste des générateurs',
    icon: <ThunderboltOutlined />,
    component: <ListGenerateur />
  },
  {
    key: '2',
    label: 'Liste des pleins générateurs',
    icon: <DatabaseOutlined />,
    component: <PleinGenerateur />
  },
  {
    key: '3',
    label: 'Les types',
    icon: <AppstoreOutlined />,
    component: <ListTypeGenerateur />
  }
];

const Generateur = () => {
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
  );
};

export default Generateur;
