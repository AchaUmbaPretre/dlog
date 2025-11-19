import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
  FileTextOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../../../utils/tabStyles';
import RapportCatPeriode from './rapportCatPeriode/RapportCatPeriode';

const RapportPeriode = () => {
    const [activeKey, setActiveKey] = useState('1');
    
  return (
    <>
        <div className="rapport_periode">
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
                            <FileTextOutlined style={iconStyle('1', activeKey)} />
                            Rapport période
                        </span>
                    }
                >
                    <RapportPeriode/>
                </Tabs.TabPane>

                <Tabs.TabPane
                    key="2"
                    tab={
                        <span style={getTabStyle('2', activeKey)}>
                            <FileTextOutlined style={iconStyle('2', activeKey)} />
                            Rapport par categorie
                        </span>
                    }
                >
                    <RapportCatPeriode/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    </>
  )
}

export default RapportPeriode