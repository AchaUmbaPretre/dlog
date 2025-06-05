import { useState } from 'react'
import { Tabs } from 'antd';
import { BankOutlined, UnlockOutlined, DeleteOutlined, TeamOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import Users from '../users/Users';
import Client from '../client/Client';
import Fournisseur from '../fournisseur/Fournisseur';
import Profile from '../profile/Profile';
import Pays from '../pays/Pays';
import Permission from '../permission/Permission';
import Corbeille from '../corbeille/Corbeille';

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
                                fontSize: '16px',
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
                                fontSize: '16px',
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
                                fontSize: '16px',
                                marginRight: '8px',
                            }}
                        />
                            Fournisseur
                    </span>
                }
                key="3"
            >
                <Fournisseur/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span>
                        <UserOutlined
                            style={{
                                color: 'orange',
                                fontSize: '16px',
                                marginRight: '8px',
                            }}
                        />
                            Profil
                    </span>
                }
                key="4"
            >
                <Profile/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span>
                        <GlobalOutlined
                            style={{
                                color: 'green',
                                fontSize: '16px',
                                marginRight: '8px',
                            }}
                        />
                            Pays & Province
                    </span>
                }
                key="5"
            >
                <Pays/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span>
                        <DeleteOutlined
                            style={{
                                color: 'red',
                                fontSize: '16px',
                                marginRight: '8px',
                            }}
                        />
                        Corbeilles
                    </span>
                }
                key="6"
            >
                <Corbeille/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span>
                        <UnlockOutlined
                            style={{
                                color: '#000',
                                fontSize: '16px',
                                marginRight: '8px',
                            }}
                        />
                        Permissions
                    </span>
                }
                key="7"
            >
                <Permission/>
            </Tabs.TabPane>
        </Tabs>
    </>
  )
}

export default Generale