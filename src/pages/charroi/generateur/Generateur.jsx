import React, { useState } from 'react';
import { Tabs } from 'antd';
import {
  ThunderboltOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';
import ListGenerateur from './listGenerateur/ListGenerateur';
import ListTypeGenerateur from './TypeGenerateur/ListTypeGenerateur';
import PleinGenerateur from './composant/pleinGenerateur/PleinGenerateur';
import RapportGenerateur from './composant/rapportGenerateur/RapportGenerateur';
import ReparationGenerat from './reparationGenerat/ReparationGenerat';

const tabConfig = [
  {
    key: '1',
    label: 'Rapport général',
    icon: <ThunderboltOutlined />,
    component: <RapportGenerateur />
  },
  {
    key: '2',
    label: 'Liste des générateurs',
    icon: <ThunderboltOutlined />,
    component: <ListGenerateur />
  },
  {
    key: '3',
    label: 'Liste des pleins générateurs',
    icon: <DatabaseOutlined />,
    component: <PleinGenerateur />
  },
  {
    key: '4',
    label: 'Les types',
    icon: <AppstoreOutlined />,
    component: <ListTypeGenerateur />
  },
  {
    key: '5',
    label: 'Réparation',
    icon: <ToolOutlined />,
    component: <ReparationGenerat />
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
