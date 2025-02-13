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
    FileOutlined,
    LineChartOutlined 
} from '@ant-design/icons';
import './rapportDeclaration.scss'
import RapportFacture from './rapportFacture/RapportFacture';
import RapportManu from './rapportManu/RapportManu';
import RapportEntreposage from './rapportEntreposage/RapportEntreposage';
import RapportVueEnsemble from './rapportVueEnsemble/RapportVueEnsemble';
import RapportExterneEtInterne from './rapportExterneEtInterne/RapportExterneEtInterne';
import RapportPays from './rapportPays/RapportPays';
import RapportSuperficie from './rapportSuperficie/RapportSuperficie';
import RapportClient from './rapportClient/RapportClient';
import RapportTemplate from './rapportTemplate/RapportTemplate';
import RapportVariation from './rapportVariation/RapportVariation';

const { TabPane } = Tabs;

const RapportDeclaration = () => {
    const [activeKey, setActiveKey] = useState('1'); // Une seule valeur

    const handleTabChange = (key) => {
        setActiveKey(key);
      };

  return (
    <>
        <div className="rapport_declaration">
            <div className="rapport_wrapper">
                <Tabs
                    activeKey={activeKey}
                    onChange={handleTabChange}
                    type="card"
                    tabPosition="top"
                    
                >
                    <TabPane
                        tab={
                            <span>
                                <AreaChartOutlined style={{ color: '#13c2c2' }} /> M² Facturé & Sup
                            </span>
                        }
                        key="1"
                    >
                        <Tabs defaultActiveKey="1">
                            <TabPane
                                tab={
                                <span>
                                    <AreaChartOutlined style={{ color: "#13c2c2" }} /> M² Facturé
                                </span>
                                }
                                key="1"
                            >
                                <RapportFacture />
                            </TabPane>

                            <TabPane
                                tab={
                                <span>
                                    <RiseOutlined style={{ color: "blue" }} /> Superficie
                                </span>
                                }
                                key="2"
                            >
                                <RapportSuperficie />
                            </TabPane>
                        </Tabs>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <AppstoreOutlined style={{ color: '#1890ff' }} /> Entrep & Manu
                            </span>
                        }
                        key="3"
                    >
                        <Tabs defaultActiveKey="1">
                            <TabPane
                                tab={
                                    <span>
                                        <DatabaseOutlined style={{ color: '#fa8c16' }} /> Entreposage
                                    </span>
                                }
                                key="1"
                            >
                                <RapportEntreposage/>
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                        <AppstoreOutlined style={{ color: '#1890ff' }} /> Manutention
                                    </span>
                                }
                                key="2"
                            >
                                <RapportManu/>
                            </TabPane>
                            
                        </Tabs>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <GlobalOutlined style={{ color: 'green' }} /> Pays & ville
                            </span>
                        }
                        key="5"
                    >
                        <Tabs defaultActiveKey="1">
                            <TabPane
                                    tab={
                                    <span>
                                        <EnvironmentOutlined style={{ color: 'red' }} /> Par ville
                                    </span>
                                    }
                                    key="1"
                            >
                                <RapportVueEnsemble/>
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                        <GlobalOutlined style={{ color: 'green' }} /> Par pays
                                    </span>
                                }
                                key="2"
                            >
                                <RapportPays/>
                            </TabPane>

                        </Tabs>
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
                        <RapportClient/>
                   </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <FileOutlined style={{ color: 'blue' }} /> Template
                            </span>
                        }
                        key="9"
                    >
                         <RapportTemplate/>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <LineChartOutlined  style={{ color: 'red' }} /> Variations
                            </span>
                        }
                        key="10"
                    >
                        <RapportVariation/>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </>
  )
}

export default RapportDeclaration