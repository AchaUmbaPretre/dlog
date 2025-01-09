import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
    AreaChartOutlined,
    ContainerOutlined,
    AppstoreOutlined,
    DatabaseOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import './rapportDeclaration.scss'
import RapportFacture from './rapportFacture/RapportFacture';

const { TabPane } = Tabs;

const RapportDeclaration = () => {
    const [activeKey, setActiveKey] = useState(['1', '2']);

    const handleTabChange = (key) => {
        setActiveKey(key);
      };

  return (
    <>
        <div className="rapport_declaration">
            <Tabs
                activeKey={activeKey[0]}
                onChange={handleTabChange}
                type="card"
                tabPosition="top"
                renderTabBar={(props, DefaultTabBar) => (
                    <DefaultTabBar {...props} />
                )}
            >
                <TabPane
                    tab={
                        <span>
                            <AreaChartOutlined /> M² Facturé
                        </span>
                    }
                    key="1"
                >
                    <RapportFacture/>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <ContainerOutlined /> Total Entrepo et Manut
                        </span>
                    }
                    key="2"
                >
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <AppstoreOutlined /> Total Manutention
                        </span>
                    }
                    key="3"
                >
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <DatabaseOutlined /> Total Entreposage
                        </span>
                    }
                    key="4"
                >
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <EyeOutlined /> Vue d'ensemble
                        </span>
                    }
                    key="5"
                >
                </TabPane>
            </Tabs>
        </div>
    </>
  )
}

export default RapportDeclaration