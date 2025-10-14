import { useState } from 'react';
import { Tabs, Badge } from 'antd';
import { EnvironmentOutlined, BellOutlined, FileTextOutlined, DashboardOutlined } from '@ant-design/icons';
import RapportEvent from '../demandeVehicule/charroiLocalisation/rapportEvent/RapportEvent';
import CharroiLocalisation from '../demandeVehicule/charroiLocalisation/CharroiLocalisation';
import GetEventLocalisation from '../demandeVehicule/charroiLocalisation/getEventLocalisation/GetEventLocalisation';
import MoniRealTime from './monoRealTime/MoniRealTime';

const Monitoring = () => {
    const [activeKey, setActiveKey] = useState('1');
    const [unreadEvents, setUnreadEvents] = useState(5); // Exemple : 5 événements non lus

    const handleTabChange = (key) => {
        setActiveKey(key);
        if (key === '3') setUnreadEvents(0); // On marque les événements comme lus si on ouvre l'onglet
    }

    const getTabStyle = (key) => ({
        display: 'flex',
        alignItems: 'center',
        color: activeKey === key ? '#1890ff' : 'rgba(0,0,0,0.65)',
        fontWeight: activeKey === key ? '600' : '400',
        transition: 'color 0.3s',
    });

    const iconStyle = (key) => ({
        marginRight: 8,
        fontSize: 18,
        color: activeKey === key ? '#1890ff' : 'rgba(0,0,0,0.45)',
        transform: activeKey === key ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.3s, color 0.3s',
    });

    return (
        <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
            type="card"
            tabPosition="top"
        >
            <Tabs.TabPane
                tab={
                    <span style={getTabStyle('1')}>
                        <EnvironmentOutlined style={iconStyle('1')} />
                        Position
                    </span>
                }
                key="1"
            >
                <CharroiLocalisation />
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span style={getTabStyle('2')}>
                        <DashboardOutlined style={iconStyle('2')} />
                        Monitoring
                    </span>
                }
                key="2"
            >
                <MoniRealTime/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span style={getTabStyle('3')}>
                        <Badge count={unreadEvents} offset={[5, -5]}>
                            <BellOutlined style={iconStyle('3')} />
                        </Badge>
                        Evénements
                    </span>
                }
                key="3"
            >
                <GetEventLocalisation />
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span style={getTabStyle('4')}>
                        <FileTextOutlined style={iconStyle('4')} />
                        Rapport véhicule
                    </span>
                }
                key="4"
            >
                <RapportEvent />
            </Tabs.TabPane>
        </Tabs>
    )
}

export default Monitoring;