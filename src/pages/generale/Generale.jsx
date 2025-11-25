import { useState } from 'react'
import { Tabs } from 'antd';
import { BankOutlined, FullscreenExitOutlined, DollarOutlined, UnlockOutlined, DeleteOutlined, TeamOutlined, GlobalOutlined } from '@ant-design/icons';
import Users from '../users/Users';
import Client from '../client/Client';
import Fournisseur from '../fournisseur/Fournisseur';
import Pays from '../pays/Pays';
import Permission from '../permission/Permission';
import Corbeille from '../corbeille/Corbeille';
import ParametreSociete from './parametreSociete/ParametreSociete';
import Personnel from '../personnel/Personnel';
import CarburantPrice from '../charroi/carburant/carburantPrice/CarburantPrice';

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
                        <TeamOutlined
                            style={{
                                color: 'black',
                                fontSize: '16px',
                                marginRight: '8px',
                            }}
                        />
                            Personnels
                    </span>
                }
                key="3"
            >
                <Personnel/>
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
                key="4"
            >
                <Fournisseur/>
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
                        <FullscreenExitOutlined
                            style={{
                                color: 'yellow',
                                fontSize: '16px',
                                marginRight: '8px',
                            }}
                        />
                        Société
                    </span>
                }
                key="7"
            >
                <ParametreSociete/>
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
                key="8"
            >
                <Permission/>
            </Tabs.TabPane>

            <Tabs.TabPane
                tab={
                    <span>
                        <DollarOutlined
                            style={{
                                color: '#000',
                                fontSize: '16px',
                                marginRight: '8px',
                            }}
                        />
                        Prix carburant
                    </span>
                }
                key="9"
            >
                <CarburantPrice/>
            </Tabs.TabPane>
        </Tabs>
    </>
  )
}

export default Generale