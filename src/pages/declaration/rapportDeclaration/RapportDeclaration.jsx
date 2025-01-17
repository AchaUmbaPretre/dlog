import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
    AreaChartOutlined,
    AppstoreOutlined,
    DatabaseOutlined,
    EyeOutlined,
    SwapOutlined
} from '@ant-design/icons';
import './rapportDeclaration.scss'
import RapportFacture from './rapportFacture/RapportFacture';
import RapportManu from './rapportManu/RapportManu';
import RapportEntreposage from './rapportEntreposage/RapportEntreposage';
import RapportVueEnsemble from './rapportVueEnsemble/RapportVueEnsemble';

const { TabPane } = Tabs;

const RapportDeclaration = () => {
    const [activeKey, setActiveKey] = useState(['1', '2']);

    const handleTabChange = (key) => {
        setActiveKey(key);
      };

  return (
    <>
        <div className="rapport_declaration">
            <div className="rapport_wrapper">
                <Tabs
                    activeKey={activeKey[0]}
                    onChange={handleTabChange}
                    type="card"
                    tabPosition="top"
                    renderTabBar={(props, DefaultTabBar) => (
                        <DefaultTabBar {...props} />
                    )}
                >
                    <TabPane
                        tab={
                            <span>
                                <AreaChartOutlined style={{ color: '#13c2c2' }} /> M² Facturé
                            </span>
                        }
                        key="1"
                    >
                        <RapportFacture/>
                    </TabPane>

{/*                     <TabPane
                        tab={
                            <span>
                                <ContainerOutlined /> Total Entrepo et Manut
                            </span>
                        }
                        key="2"
                    >
                        <RapportEntrepoEtManu/>
                    </TabPane>
 */}
                    <TabPane
                        tab={
                            <span>
                                <AppstoreOutlined style={{ color: '#1890ff' }} /> Total Manutention
                            </span>
                        }
                        key="3"
                    >
                        <RapportManu/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <DatabaseOutlined style={{ color: '#fa8c16' }} /> Total Entreposage
                            </span>
                        }
                        key="4"
                    >
                        <RapportEntreposage/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <EyeOutlined style={{ color: 'blue' }} /> Total par ville
                            </span>
                        }
                        key="5"
                    >
                        <RapportVueEnsemble/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <SwapOutlined style={{ color: 'red' }} /> Interieure & Exterieure
                            </span>
                        }
                        key="6"
                    >
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </>
  )
}

export default RapportDeclaration