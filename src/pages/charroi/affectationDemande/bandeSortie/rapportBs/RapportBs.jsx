import { Card, Divider, Tabs } from 'antd'
import './rapportBs.scss'
import { useState } from 'react';
import Performance_op from './performance_op/Performance_op';
import SuiviStatutBs from './suiviStatutBs/SuiviStatutBs';
import Indicateurs_log from './Indicateurs_log/Indicateurs_log';

const RapportBs = () => {
    const [activeKey, setActiveKey] = useState(['1', '2']);

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

  return (
    <>
        <div className="rapport_bs">
            <Card>
                <h2 className="rapport_h2">Rapport de Bon de sortie</h2>
                <Tabs
                    activeKey={activeKey[0]}
                    onChange={handleTabChange}
                    type="card"
                    tabPosition="top"
                    renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
                >
                    <Tabs.TabPane
                        tab={
                            <span>                        
                                Volume global des activités
                            </span>
                        }
                        key="1"
                    >
                        <div className="rapport_bs_wrapper">
                            <Card  type="inner" title="Volume global des activités" className="rapport_bs_globals">
                                <div className="rapport_bs_global">
                                    <div className="bs_global_info">
                                        <div className="row">
                                            <span className="type">Nombre total de bons de sortie :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                        <Divider style={{margin:'20px 0'}} />
                                    </div>

                                    <div className="bs_global_info">
                                        <div className="row">
                                            <span className="type">Nombre total de véhicules mobilisés :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                        <Divider style={{margin:'20px 0'}} />
                                    </div>

                                    <div className="bs_global_info">
                                        <div className="row">
                                            <span className="type">Nombre de chauffeurs impliqués :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                        <Divider style={{margin:'20px 0'}} />
                                    </div>
                                    <div className="bs_global_info">
                                        <div className="row">
                                            <span className="type">Nombre total de bons de sortie :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                        <Divider style={{margin:'20px 0'}} />
                                    </div>
                                    <Card type="inner" title="Répartition par type de véhicule">
                                        <div className="bs_global_infos">
                                            <div className="rows">
                                                <div className="row">
                                                    <span className="type">Motos  :</span>
                                                    <strong className="info_strong">5</strong>
                                                </div>
                                                <div className="row">
                                                    <span className="type">Voitures  :</span>
                                                    <strong className="info_strong">5</strong>
                                                </div>
                                                <div className="row">
                                                    <span className="type">Camions semi-remorques  :</span>
                                                    <strong className="info_strong">5</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card type="inner" title="Répartition par service">
                                        <div className="bs_global_infos">
                                            <div className="rows">
                                                <div className="row">
                                                    <span className="type">Logistique :</span>
                                                    <strong className="info_strong">5</strong>
                                                </div>
                                                <div className="row">
                                                    <span className="type">Administratif :</span>
                                                    <strong className="info_strong">5</strong>
                                                </div>
                                                <div className="row">
                                                    <span className="type">Maritime :</span>
                                                    <strong className="info_strong">5</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Card>
                        </div>
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab={
                            <span>                        
                                Performance opérationnelle
                            </span>
                        }
                        key="2"
                    >
                        <Performance_op/>
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab={
                            <span>                        
                                Suivi des statuts
                            </span>
                        }
                        key="3"
                    >
                        <SuiviStatutBs/>
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab={
                            <span>                        
                                Indicateurs logistiques spécifiques
                            </span>
                        }
                        key="4"
                    >
                        <Indicateurs_log/>
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    </>
  )
}

export default RapportBs