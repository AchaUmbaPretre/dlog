import { useState } from 'react'
import { Tabs } from 'antd';
import { BankOutlined, TeamOutlined } from '@ant-design/icons';
import Users from '../users/Users';
import Client from '../client/Client';
import Fournisseur from '../fournisseur/Fournisseur';


const Generale = () => {
    const [activeKey, setActiveKey] = useState(['1', '2']);

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

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
                        <TeamOutlined
                            style={{
                                color: 'orange',
                                fontSize: '18px',
                                marginRight: '8px',
                            }}
                        />
                            Utilisateurs
                    </span>
                }
                key="1"
            >
                <Users/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span>
                        <TeamOutlined
                            style={{
                                color: 'orange',
                                fontSize: '18px',
                                marginRight: '8px',
                            }}
                        />
                            Clients
                    </span>
                }
                key="2"
            >
                <Client/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span>
                        <BankOutlined
                            style={{
                                color: '#000',
                                fontSize: '18px',
                                marginRight: '8px',
                            }}
                        />
                            Fournisseur
                    </span>
                }
                key="2"
            >
                <Fournisseur/>
            </Tabs.TabPane>
        </Tabs>
    </>
  )
}

export default Generale