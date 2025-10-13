import React, { useState } from 'react'
import { Table, Button, Image, Tabs, Input, message, Dropdown, Menu, Space, Tooltip, Popconfirm, Tag, Modal, notification } from 'antd';
import RapportEvent from '../demandeVehicule/charroiLocalisation/rapportEvent/RapportEvent';
import CharroiLocalisation from '../demandeVehicule/charroiLocalisation/CharroiLocalisation';
import GetEventLocalisation from '../demandeVehicule/charroiLocalisation/getEventLocalisation/GetEventLocalisation';


const Monitoring = () => {
    const [activeKey, setActiveKey] = useState(['1', '2']);

    const handleTabChange = (key) => {
        setActiveKey(key);
    }

  return (
    <>
        <Tabs
            activeKey={activeKey[0]}
            onChange={handleTabChange}
            type="card"
            tabPosition="top"
            renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
        >
            <Tabs.TabPane
                tab={
                    <span>
                        📍 Position
                    </span>
                }
                key="1"
            >
                <CharroiLocalisation/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                        <span>
                            Evénements
                        </span>
                    }
                    key="2"
                >
                <GetEventLocalisation/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span>
                        Rapport véhicule
                    </span>
                    }
                    key="3"
                >
                <RapportEvent/>
            </Tabs.TabPane>
        </Tabs>
    </>
  )
}

export default Monitoring