import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  EditOutlined,
  CalendarTwoTone,
  DesktopOutlined,
} from '@ant-design/icons';
import PresenceList from './presenceList/PresenceList';
import PresenceReport from './presenceReport/PresenceReport';
import { getTabStyle, iconStyle } from '../../utils/tabStyles';
import PresenceRapportRP from './presenceRapportRP/PresenceRapportRP';
import AutorisationSortie from './autorisationSortie/AutorisationSortie';
import JourFerie from './jourFerie/JourFerie';
import Terminal from './terminal/Terminal';
import PresenceAll from './presenceAll/PresenceAll';
import DashboardPresence from './dashboardPresence/DashboardPresence';
import RapportGenPresence from './rapportGenPresence/RapportGenPresence';
import PresenceHoraire from './presenceHoraire/PresenceHoraire';

const tabConfig = [
  {
    key: '1',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
    component: <DashboardPresence />
  },
  {
    key: '2',
    label: 'Planning de présence',
    icon: <CalendarOutlined />,
    component: <PresenceList />
  },
  {
    key: '3',
    label: 'Liste des présences',
    icon: <UnorderedListOutlined />,
    component: <PresenceAll />
  },
  {
    key: '4',
    label: 'Rapport',
    icon: <BarChartOutlined />,
    component: <RapportGenPresence />
  },
  {
    key: '5',
    label: 'Ajustement de présence',
    icon: <EditOutlined />,
    component: <AutorisationSortie />
  },
  {
    key: '6',
    label: 'Jour férié',
    icon: <CalendarTwoTone twoToneColor="#faad14" />,
    component: <JourFerie />
  },
  {
    key: '7',
    label: 'Terminal',
    icon: <DesktopOutlined />,
    component: <Terminal />
  },
  {
    key: '8',
    label: 'Horaire',
    icon: <CalendarTwoTone twoToneColor="#faad14" />,
    component: <PresenceHoraire />
  },
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