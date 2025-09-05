import { useState } from 'react';
import './rapportCharroi.scss'
import { Tabs } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';

const RapportCharroi = () => {
    const [activeKey, setActiveKey] = useState(['1', '2']);
    
    const handleTabChange = (key) => {
        setActiveKey(key);
    };

  return (
    <>
        <div className="rapport_charroi">
            <div className="rapport_charroi_wrapper">
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
                            <ApartmentOutlined style={{ color: '#52c41a' }} /> Liste des bureaux
                        </span>
                        }
                        key="1"
                    >
                        BS VALIDE
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab={
                        <span>
                            <ApartmentOutlined style={{ color: '#52c41a' }} /> Liste des bureaux
                        </span>
                        }
                        key="2"
                    >
                        VEHICULE EN COURSE
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab={
                        <span>
                            <ApartmentOutlined style={{ color: '#52c41a' }} /> Liste des bureaux
                        </span>
                        }
                        key="3"
                    >
                        UTILITAIRE
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    </>
  )
}

export default RapportCharroi