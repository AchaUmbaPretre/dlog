import React, { useState } from 'react'
import { Tabs } from 'antd';
import './rapportDeclaration.scss'

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

                <TabPane tab="M² Facturé" key="1">
                    <div>
                        11111
                    </div>
                </TabPane>

                <TabPane tab="Total Entrepo et Manut" key="2">
                </TabPane>

                <TabPane tab="Total Manutention" key="3">
                </TabPane>

                <TabPane tab="Total Entreposage" key="4">
                </TabPane>

                <TabPane tab="Vue d'ensemble" key="5">
                </TabPane>

            </Tabs>
        </div>
    </>
  )
}

export default RapportDeclaration