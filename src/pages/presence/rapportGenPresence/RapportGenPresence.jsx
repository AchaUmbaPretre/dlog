import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
  CalendarOutlined,
  ApartmentOutlined,
  TrophyOutlined,
  WarningOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';
import PresenceRapportRP from '../presenceRapportRP/PresenceRapportRP';
import PresenceReport from '../presenceReport/PresenceReport';
import RapportPresenceSite from '../rapportPresenceSite/RapportPresenceSite';
import RapportPresenceDepartement from '../rapportPresenceDepartement/RapportPresenceDepartement';
import RapportPresencePerfomance from '../rapportPresencePerfomance/RapportPresencePerfomance';

const tabConfig = [
  {
    key: '1',
    label: 'Rapport Mensuel',
    icon: <CalendarOutlined />,
    description: 'Vue d\'ensemble mensuelle',
    component: <PresenceReport />
  },
  {
    key: '2',
    label: 'Rapport par site',
    icon: <GlobalOutlined />, 
    description: 'Statistiques par site',
    component: <RapportPresenceSite />
  },
  {
    key: '3',
    label: 'Rapport par département',
    icon: <ApartmentOutlined />,
    description: 'Analyse par département',
    component: <RapportPresenceDepartement />
  },
  {
    key: '4',
    label: 'Rapport Retard & Ponctualité',
    icon: <WarningOutlined />,
    description: 'Analyse des retards et de la ponctualité',
    component: <PresenceRapportRP />
  },
  {
    key: '5',
    label: 'Rapports de performance',
    icon: <TrophyOutlined />,
    description: 'Indicateurs de performance',
    component: <RapportPresencePerfomance />
  }
];


const RapportGenPresence = () => {
    const [activeKey, setActiveKey] = useState('1');
    
  return (
    <div>
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

export default RapportGenPresence