import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
  BarChartOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';
import PresenceRapportRP from '../presenceRapportRP/PresenceRapportRP';
import PresenceReport from '../presenceReport/PresenceReport';

const tabConfig = [
  {
    key: '1',
    label: 'Rapport Mensuel',
    icon: <BarChartOutlined />,
    component: <PresenceReport />
  },
  {
    key: '2',
    label: 'Rapport Retard & Ponctualité',
    icon: <ClockCircleOutlined />,
    component: <PresenceRapportRP />
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