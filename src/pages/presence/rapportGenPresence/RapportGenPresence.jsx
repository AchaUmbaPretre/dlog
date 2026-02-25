import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
  BarChartOutlined,
  ClockCircleOutlined
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
    icon: <BarChartOutlined />,
    component: <PresenceReport />
  },
  {
    key: '2',
    label: 'Rapport par site',
    icon: <BarChartOutlined />,
    component: <RapportPresenceSite />
  },
  {
    key: '3',
    label: 'Rapport par département',
    icon: <BarChartOutlined />,
    component: <RapportPresenceDepartement />
  },
  {
    key: '4',
    label: 'Rapport Retard & Ponctualité',
    icon: <ClockCircleOutlined />,
    component: <PresenceRapportRP />
  },
  {
    key: '5',
    label: 'Rapport Audit',
    icon: <ClockCircleOutlined />,
    component: <PresenceRapportRP />
  },
  {
    key: '6',
    label: 'Rapports de performance',
    icon: <ClockCircleOutlined />,
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