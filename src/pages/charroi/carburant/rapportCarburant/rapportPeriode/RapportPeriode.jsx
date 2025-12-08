import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
  FileTextOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../../../utils/tabStyles';
import RapportCatPeriode from './rapportCatPeriode/RapportCatPeriode';
import RapportVehiculePeriode from './rapportVehiculePeriode/RapportVehiculePeriode';
import RapportCarbMois from './rapportCarbMois/RapportCarbMois';

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
                            Rapport par categorie
                        </span>
                    }
                >
                    <RapportCatPeriode/>
                </Tabs.TabPane>

                <Tabs.TabPane
                    key="2"
                    tab={
                        <span style={getTabStyle('2', activeKey)}>
                            <FileTextOutlined style={iconStyle('2', activeKey)} />
                            Rapport par véhicule
                        </span>
                    }
                >
                    <RapportVehiculePeriode/>
                </Tabs.TabPane>
                
                <Tabs.TabPane
                    key="3"
                    tab={
                        <span style={getTabStyle('3', activeKey)}>
                            <FileTextOutlined style={iconStyle('3', activeKey)} />
                            Rapport par mois
                        </span>
                    }
                >
                    <RapportCarbMois/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    </>
  )
}

export default RapportPeriode