import React, { useEffect, useState } from 'react'
import { Tabs, notification } from 'antd';
import { getTabStyle, iconStyle } from '../../../utils/tabStyles';
import {
  ThunderboltOutlined
} from '@ant-design/icons';
import ListGenerateur from './listGenerateur/ListGenerateur';
import ListTypeGenerateur from './TypeGenerateur/ListTypeGenerateur';
import { getGenerateur } from '../../../services/generateurService';

const Generateur = () => {
    const [activeKey, setActiveKey] = useState('1');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = async() => {
        setLoading(true);

        try {
            const response = await getGenerateur();
            setData(response?.data || []);

        } catch (error) {
            notification.error({
                message: "Erreur de chargement",
                description: "Impossible de récupérer les données du générateur.",
                placement: "topRight",
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

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
                    Liste des générateurs
                    </span>
                }
            >
                <ListGenerateur />  
            </Tabs.TabPane>
                <Tabs.TabPane
                    key="2"
                    tab={
                        <span style={getTabStyle('2', activeKey)}>
                            <ThunderboltOutlined style={iconStyle('2', activeKey)} />
                            Les types
                        </span>
                    }
                >
                    <ListTypeGenerateur />           
                </Tabs.TabPane>
        </Tabs>
    </div>
  )
}

export default Generateur