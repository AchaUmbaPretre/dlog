import { useState } from 'react'
import { Tabs } from 'antd';
import {
  ThunderboltOutlined
} from '@ant-design/icons';
import { getTabStyle, iconStyle } from '../../../../utils/tabStyles';
import ListeTypeGen from './listeTypeGen/ListeTypeGen';
import ListeMarqueGen from './listeMarqueGen/ListeMarqueGen';
import ListeModeleGen from './listeModeleGen/ListeModeleGen';

const ListTypeGenerateur = () => {
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
                    Liste des types de générateurs
                    </span>
                }
            >
                <ListeTypeGen />  
            </Tabs.TabPane>
                <Tabs.TabPane
                    key="2"
                    tab={
                        <span style={getTabStyle('2', activeKey)}>
                            <ThunderboltOutlined style={iconStyle('2', activeKey)} />
                            Liste des marques de générateurs
                        </span>
                    }
                >
                    <ListeMarqueGen />       
              </Tabs.TabPane>
                    <Tabs.TabPane
                        key="3"
                        tab={
                            <span style={getTabStyle('3', activeKey)}>
                                <ThunderboltOutlined style={iconStyle('3', activeKey)} />
                                Liste des modèles de générateurs
                            </span>
                        }
                    >
                    <ListeModeleGen />       
               </Tabs.TabPane>
        </Tabs>
    </div>
  )
}

export default ListTypeGenerateur;