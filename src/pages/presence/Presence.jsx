import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
  FileTextOutlined
} from '@ant-design/icons';
import PresenceList from './presenceList/PresenceList';
import PresenceReport from './presenceReport/PresenceReport';
import { getTabStyle, iconStyle } from '../../utils/tabStyles';
import PresenceRapportRP from './presenceRapportRP/PresenceRapportRP';
import AutorisationSortie from './autorisationSortie/AutorisationSortie';
import JourFerie from './jourFerie/JourFerie';
import Terminal from './terminal/Terminal';

const tabConfig = [
    {
        key: '1',
        label: 'Planning de présence',
        icon: <FileTextOutlined/>,
        component: <PresenceList/>
    },
    {
        key: '2',
        label: 'Rapport  Mensuel',
        icon: <FileTextOutlined/>,
        component: <PresenceReport/>
    },
    {
        key: '3',
        label: 'Rapport Retard & Ponctualit',
        icon: <FileTextOutlined/>,
        component: <PresenceRapportRP/>
    },
    {
        key: '4',
        label: 'Ajustement de présence',
        icon: <FileTextOutlined/>,
        component: <AutorisationSortie/>
    },
    {
        key: '5',
        label: 'Jour ferié',
        icon: <FileTextOutlined/>,
        component: <JourFerie/>
    },
    {
        key: '6',
        label: 'Terminal',
        icon: <FileTextOutlined/>,
        component: <Terminal/>
    }
];

const Presence = () => {
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

export default Presence