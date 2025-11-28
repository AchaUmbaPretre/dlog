import React, { useState } from 'react'
import { Tabs } from 'antd';
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';
import {
  ThunderboltOutlined
} from '@ant-design/icons';

const Generateur = () => {
    const [activeKey, setActiveKey] = useState('1');

  return (
    <div className="carburant_all">
        <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            type="card"
            tabPosition="top"
            destroyInactiveTabPane
            animated
        >
            <Tabs.TabPane
                key="1"
                tab={
                    <span style={getTabStyle('1', activeKey)}>
                    <ThunderboltOutlined style={iconStyle('1', activeKey)} />
                    Liste des générateurs
                    </span>
                }
            >
{/*                 <RapportCarburant />
 */}            </Tabs.TabPane>
                <Tabs.TabPane
                    key="2"
                    tab={
                        <span style={getTabStyle('2', activeKey)}>
                            <ThunderboltOutlined style={iconStyle('2', activeKey)} />
                            Type des générateurs
                        </span>
                    }
                >
                    <RapportCarburant />           
                </Tabs.TabPane>
        </Tabs>
    </div>
  )
}

export default Generateur