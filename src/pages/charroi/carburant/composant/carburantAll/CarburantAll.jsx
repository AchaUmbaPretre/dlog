import { useState } from 'react';
import { Tabs } from 'antd';
import {
  FireOutlined,
  ThunderboltOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../../utils/tabStyles';
import Carburant from '../Carburant';
import VehiculeCarburant from '../vehiculeCarburant/VehiculeCarburant';
import RapportCarburant from '../rapportCarburant/RapportCarburant';

const CarburantAll = () => {
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
              <FileTextOutlined style={iconStyle('1', activeKey)} />
              Rapport
            </span>
          }
        >
          <RapportCarburant />
        </Tabs.TabPane>
        
        <Tabs.TabPane
          key="2"
          tab={
            <span style={getTabStyle('2', activeKey)}>
              <FireOutlined style={iconStyle('2', activeKey)} />
              Carburant
            </span>
          }
        >
          <Carburant />
        </Tabs.TabPane>

        <Tabs.TabPane
          key="3"
          tab={
            <span style={getTabStyle('3', activeKey)}>
              <ThunderboltOutlined style={iconStyle('3', activeKey)} />
              Véhicule & Groupe électrogène
            </span>
          }
        >
          <VehiculeCarburant />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default CarburantAll;
