import { Card, Tabs } from 'antd';
import { FileTextOutlined, BarChartOutlined, SyncOutlined } from '@ant-design/icons';
import { useState } from 'react';
import VolumeGlobal from './volumeGlobal/VolumeGlobal';
import PerformanceM from './performanceM/PerformanceM';
import SuiviStatutM from './suiviStatutM/SuiviStatutM';
import CoutMaintenance from './coutMaintenance/CoutMaintenance';

const { TabPane } = Tabs;

const InspectionRapport = () => {
    const [activeKey, setActiveKey] = useState('1');

      const tabItems = 
  [
    {
      key: '1',
      label: 'Volume global des activités',
      icon: FileTextOutlined,
    },
    {
      key: '2',
      label: 'Performance maintenance',
      icon: BarChartOutlined,
    },
    {
      key: '3',
      label: 'Couts de maintenance',
      icon: BarChartOutlined,
    },
    {
      key: '4',
      label: 'Suivi des statuts',
      icon: SyncOutlined,
    }
  ];
    
  return (
    <>
        <div className="rapport_bs">
            <Card bordered={false} className="rapport_bs_card">
                <h2 className="rapport_h2">Tableau de bord - Inspections & Réparations du charroi</h2>
                <Tabs 
                    activeKey={activeKey} 
                    onChange={setActiveKey} 
                    type="card" 
                    tabPosition="top"
                    tabBarGutter={24}
                    className="rapport_tabs"
                >
                    {tabItems.map(({ key, label, icon: Icon}) => (
                    <TabPane
                        key={key}
                        tab={
                            <span
                                className={`custom_tab_label ${activeKey === key ? 'active' : ''}`}
                            >
                                <Icon
                                style={{
                                    fontSize: 18,
                                    marginRight: 8,
                                    color: activeKey === key ? '#1890ff' : '#8c8c8c',
                                    transition: 'color 0.3s',
                                }}
                                />
                                <span>{label}</span>
                            </span>
                        }
                    >
                        {key === '1' && <VolumeGlobal /> }
                        {key === '2' && <PerformanceM />}
                        {key === '3' && <CoutMaintenance />}
                        {key === '4' && <SuiviStatutM />}
                    </TabPane>
                    ))}
                </Tabs>
            </Card>
        </div>
    </>
  )
}

export default InspectionRapport