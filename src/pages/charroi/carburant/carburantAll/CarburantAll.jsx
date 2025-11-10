import React, { useState } from 'react'
import { notification, Tabs, Badge } from 'antd';
import {
  BarChartOutlined,
  FireOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../../utils/tabStyles';
import Carburant from '../Carburant';


const CarburantAll = () => {
    const [activeKey, setActiveKey] = useState('1');
    
  return (
    <>
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
                        <FireOutlined style={iconStyle('1', activeKey)} />
                        Carburant
                    </span>
                    }
                >
                    <Carburant />
                </Tabs.TabPane>

                <Tabs.TabPane
                    key="2"
                    tab={
                    <span style={getTabStyle('1', activeKey)}>
                        <BarChartOutlined style={iconStyle('1', activeKey)} />
                        Véhicule & Groupe electrogene
                    </span>
                    }
                >
                    <Carburant />
                </Tabs.TabPane>
            </Tabs>
        </div>
    </>
  )
}

export default CarburantAll