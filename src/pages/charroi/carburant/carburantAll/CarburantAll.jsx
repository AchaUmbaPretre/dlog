import { useState } from 'react';
import { Tabs } from 'antd';
import {
  FireOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../../utils/tabStyles';
import Carburant from '../Carburant';
import VehiculeCarburant from '../vehiculeCarburant/VehiculeCarburant';

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
              <FireOutlined style={iconStyle('1', activeKey)} />
              Carburant
            </span>
          }
        >
          <Carburant />
        </Tabs.TabPane>

        {/* Onglet Véhicule & Groupe électrogène */}
        <Tabs.TabPane
          key="2"
          tab={
            <span style={getTabStyle('2', activeKey)}>
              <ThunderboltOutlined style={iconStyle('2', activeKey)} />
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
