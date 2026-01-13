import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
  FileTextOutlined
} from '@ant-design/icons';
import PresenceList from './presenceList/PresenceList';
import PresenceReport from './presenceReport/PresenceReport';
import { getTabStyle, iconStyle } from '../../utils/tabStyles';

const tabConfig = [
    {
        key: '1',
        label: 'Planning de présence',
        icon: <FileTextOutlined/>,
        component: <PresenceList/>
    },
    {
        key: '2',
        label: 'Rapport des présences',
        icon: <FileTextOutlined/>,
        component: <PresenceReport/>
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