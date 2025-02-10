import React, { useState } from 'react'
import { Tabs } from 'antd';
import {
    AreaChartOutlined,
    AppstoreOutlined,
    DatabaseOutlined,
    EnvironmentOutlined,
    SwapOutlined,
    GlobalOutlined,
    RiseOutlined,
    UserOutlined,
    FileOutlined
} from '@ant-design/icons';
import './rapportDeclaration.scss'
import RapportFacture from './rapportFacture/RapportFacture';
import RapportManu from './rapportManu/RapportManu';
import RapportEntreposage from './rapportEntreposage/RapportEntreposage';
import RapportVueEnsemble from './rapportVueEnsemble/RapportVueEnsemble';
import RapportExterneEtInterne from './rapportExterneEtInterne/RapportExterneEtInterne';
import RapportPays from './rapportPays/RapportPays';
import RapportSuperficie from './rapportSuperficie/RapportSuperficie';

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

                     <TabPane
                        tab={
                            <span>
                                <RiseOutlined style={{ color: 'blue' }} /> Superficie
                            </span>
                        }
                        key="2"
                    >
                        <RapportSuperficie/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <AppstoreOutlined style={{ color: '#1890ff' }} /> Manutention
                            </span>
                        }
                        key="3"
                    >
                        <RapportManu/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <DatabaseOutlined style={{ color: '#fa8c16' }} /> Entreposage
                            </span>
                        }
                        key="4"
                    >
                        <RapportEntreposage/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <EnvironmentOutlined style={{ color: 'red' }} /> Par ville
                            </span>
                        }
                        key="5"
                    >
                        <RapportVueEnsemble/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <GlobalOutlined style={{ color: 'green' }} /> Par pays
                            </span>
                        }
                        key="6"
                    >
                        <RapportPays/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <SwapOutlined style={{ color: 'red' }} /> Intérieur & Extérieur
                            </span>
                        }
                        key="7"
                    >
                        <RapportExterneEtInterne/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <UserOutlined style={{ color: '#D2691E' }} /> Client
                            </span>
                        }
                        key="8"
                    >
{/*                         <RapportExterneEtInterne/>
 */}                 </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <FileOutlined style={{ color: 'blue' }} /> Template
                            </span>
                        }
                        key="9"
                    >
{/*                         <RapportExterneEtInterne/>
 */}                 </TabPane>
                </Tabs>
            </div>
        </div>
    </>
  )
}

export default RapportDeclaration