import { Tabs } from 'antd';
import { DashboardOutlined, FileTextOutlined } from '@ant-design/icons'; // Importer les icônes appropriées
import React from 'react';

const TableauBord = () => {
  return (
    <div>
      <Tabs defaultActiveKey="0">
        <Tabs.TabPane
          tab={
            <span>
              <DashboardOutlined /> {/* Icône du tableau de bord */}
              Tableau de bord
            </span>
          }
          key="0"
        >
          {/* Contenu du tableau de bord */}
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span>
              <FileTextOutlined /> {/* Icône des rapports */}
              Les rapports d'entretien
            </span>
          }
          key="1"
        >
          
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default TableauBord;
