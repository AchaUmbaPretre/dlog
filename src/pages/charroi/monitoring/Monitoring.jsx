import { useState } from 'react';
import { Tabs } from 'antd';
import { EnvironmentOutlined, BarChartOutlined, DesktopOutlined, BellOutlined, FileTextOutlined, DashboardOutlined } from '@ant-design/icons';
import RapportEvent from '../demandeVehicule/charroiLocalisation/rapportEvent/RapportEvent';
import CharroiLocalisation from '../demandeVehicule/charroiLocalisation/CharroiLocalisation';
import GetEventLocalisation from '../demandeVehicule/charroiLocalisation/getEventLocalisation/GetEventLocalisation';
import MoniRealTime from './monoRealTime/MoniRealTime';
import RapportMoniUtilitaire from './rapportMoniUtilitaire/RapportMoniUtilitaire';
import ModeTv from './moniKiosque/ModeTv';

const Monitoring = () => {
    const [activeKey, setActiveKey] = useState('1');

    const handleTabChange = (key) => {
        setActiveKey(key);
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
                        <BarChartOutlined style={iconStyle('1')} />
                        Utilisation
                    </span>
                }
                key="1"
            >
                <RapportMoniUtilitaire />
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span style={getTabStyle('2')}>
                        <EnvironmentOutlined style={iconStyle('2')} />
                        Position
                    </span>
                }
                key="2"
            >
                <CharroiLocalisation />
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span style={getTabStyle('3')}>
                        <DashboardOutlined style={iconStyle('3')} />
                        Monitoring
                    </span>
                }
                key="3"
            >
                <MoniRealTime/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span style={getTabStyle('4')}>
                        <BellOutlined style={iconStyle('4')} />
                        Evénements
                    </span>
                }
                key="4"
            >
                <GetEventLocalisation />
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span style={getTabStyle('5')}>
                        <FileTextOutlined style={iconStyle('5')} />
                        Rapport des connexions
                    </span>
                }
                key="5"
            >
                <RapportEvent />
            </Tabs.TabPane>
            <Tabs.TabPane
                tab={
                    <span style={getTabStyle('6')}>
                        <DesktopOutlined style={iconStyle('6')} />
                        Kiosque
                    </span>
                }
                key="6"
            >
                <ModeTv/>
            </Tabs.TabPane>

        </Tabs>
    )
}

export default Monitoring;