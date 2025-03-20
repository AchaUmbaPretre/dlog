import React, { useState } from 'react'
import {Tabs } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import TabPane from 'antd/es/tabs/TabPane';


const Corbeille = () => {
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
            <TabPane
            tab={
              <span>
                <DeleteOutlined style={{ color: 'red' }} /> corbeille des taches
              </span>
            }
            key="1"
          >

          </TabPane>

          <TabPane
            tab={
              <span>
                <DeleteOutlined style={{ color: 'red' }} /> corbeille des Déclarations
              </span>
            }
            key="2"
          >

          </TabPane>
        </Tabs>
    </>
  )
}

export default Corbeille