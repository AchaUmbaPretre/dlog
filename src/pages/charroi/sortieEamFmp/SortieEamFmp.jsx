import React, { useState } from 'react'
import { Tabs } from 'antd';
import SortieEam from './sortieEam/SortieEam'
import SortieFmp from './sortieFmp/SortieFmp'
import {
  ThunderboltOutlined,
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';
import Reconciliation from './reconciliation/Reconciliation';


const tabConfig = [
    {
        key: '1',
        label: 'SORTIES EAM',
        icon: <ThunderboltOutlined />,
        component: <SortieEam />
    },
    {
        key: '2',
        label: 'SORTIES FMP',
        icon: <ThunderboltOutlined />,
        component: <SortieFmp />
    },
    {
        key: '3',
        label: 'RECONCILIATION',
        icon: <ThunderboltOutlined />,
        component: <Reconciliation />
    },
]

const SortieEamFmp = () => {
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
            {tabConfig.map(tab => (
            <Tabs.TabPane
                key={tab.key}
                tab={
                <span style={getTabStyle(tab.key, activeKey)}>
                    {React.cloneElement(tab.icon, { style: iconStyle(tab.key, activeKey) })}
                    {tab.label}
                </span>
                }
            >
                {tab.component}
            </Tabs.TabPane>
            ))}
        </Tabs>
    </div>
  )
}

export default SortieEamFmp